import { GAME_W as W, GAME_H as H } from '../config.js'
import { Audio } from '../systems/Audio.js'
import { CALIB, CALIB_TOL, CALIB_HOLD } from '../data/calibrate.js'
import { txt, exitButton, closeMini } from '../ui/miniUi.js'

// MISI 5: Kalibrasi Apresiasi. Lagu terdengar sumbang; geser 4 slider osiloskop hingga gelombang mulus dan telinga lega.
// Setiap slider merusak satu unsur musik bila meleset: nada (sumbang), irama (goyah dari denyut), melodi (nada salah), harmoni (tabrakan).
const BASE = [293.7, 329.6, 370, 440, 493.9]
const MEL = [0, 1, 2, 3, 2, 1, 2, 0]
const TRACK = { x: 118, w: 182, y0: 112, gap: 16 }
const SCOPE = { x: 20, y: 34, w: 344, h: 66 }
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

export class MiniCalibrateScene extends Phaser.Scene {
  constructor() { super('MiniCalibrate') }
  init(d) { this.parentKey = d.parent; this.practice = !!d.practice }

  create() {
    this.cameras.main.setBackgroundColor('#2d1f3d')
    this.cameras.main.fadeIn(300, 255, 255, 255)
    const g = this.add.graphics()
    g.fillStyle(0x3a2a4d).fillRect(0, 0, W, H)
    g.fillStyle(0x5b4570).fillRect(0, 0, W, 30)
    g.fillStyle(0xf594b5).fillRect(0, 28, W, 2)
    txt(this, W / 2, 5, 'KALIBRASI APRESIASI', { color: '#fffaf0', stroke: '#3a2a4d' })
    this.info = txt(this, W / 2, 16, 'GESER SLIDER SAMPAI GELOMBANG MULUS & LAGU TERDENGAR SELARAS', { color: '#a8e8d3', stroke: '#3a2a4d' })
    exitButton(this, () => this.leave(null))

    this.vals = CALIB.map((c) => c.start)
    this.revealed = CALIB.map(() => false)
    this.hints = 0
    this.elapsed = 0
    this.lockT = 0
    this.done = false
    this.drag = null
    this.gfx = this.add.graphics().setDepth(2)
    this.labels = CALIB.map((c, i) => txt(this, 20, TRACK.y0 + i * TRACK.gap - 4, c.label, { color: '#fffaf0', stroke: '#3a2a4d', align: 0, depth: 4 }))
    this.valTxt = CALIB.map((c, i) => txt(this, TRACK.x + TRACK.w + 10, TRACK.y0 + i * TRACK.gap - 4, '', { color: '#ffd467', stroke: '#3a2a4d', align: 0, depth: 4 }))
    this.meterTxt = txt(this, 20, 178, 'KESELARASAN', { color: '#fffaf0', stroke: '#3a2a4d', align: 0, depth: 4 })
    this.meterVal = txt(this, TRACK.x + TRACK.w + 10, 178, '', { color: '#ffd467', stroke: '#3a2a4d', align: 0, depth: 4 })
    this.msg = txt(this, 20, 203, '', { color: '#fff7b8', stroke: '#3a2a4d', align: 0, depth: 4 })

    // tombol petunjuk
    this.hintBtn = this.add.rectangle(W - 62, 206, 112, 14, 0x7561ad).setStrokeStyle(2, 0xfffaf0).setDepth(5).setInteractive({ useHandCursor: true })
    txt(this, W - 62, 202, 'PETUNJUK (-10)', { color: '#fffaf0', stroke: '#3a2a4d', depth: 6 })
    this.hintBtn.on('pointerdown', () => this.hint())

    // input slider: pointer + keyboard (atas/bawah pilih, kiri/kanan geser)
    this.sel = 0
    this.input.on('pointerdown', (p, over) => {
      if (over.length || this.done) return
      for (let i = 0; i < 4; i++) {
        const y = TRACK.y0 + i * TRACK.gap
        if (p.x > TRACK.x - 10 && p.x < TRACK.x + TRACK.w + 10 && p.y > y - 8 && p.y < y + 8) { this.drag = i; this.sel = i; this.setFromX(i, p.x); return }
      }
    })
    this.input.on('pointermove', (p) => { if (this.drag !== null && p.isDown) this.setFromX(this.drag, p.x) })
    this.input.on('pointerup', () => { this.drag = null })
    const kb = this.input.keyboard
    kb.addCapture('UP,DOWN,LEFT,RIGHT')
    kb.on('keydown-UP', () => { this.sel = (this.sel + 3) % 4 })
    kb.on('keydown-DOWN', () => { this.sel = (this.sel + 1) % 4 })
    kb.on('keydown-LEFT', () => { this.vals[this.sel] = clamp(this.vals[this.sel] - 2, 0, 100) })
    kb.on('keydown-RIGHT', () => { this.vals[this.sel] = clamp(this.vals[this.sel] + 2, 0, 100) })

    this.loop = Audio.dynLoop(() => this.makeHits())
    this.t = 0
    this.events.once('shutdown', () => { this.loop?.stop(); kb.removeAllListeners() })
  }

  err(i) { return clamp(Math.abs(this.vals[i] - CALIB[i].target) / 35, 0, 1) }

  setFromX(i, x) { this.vals[i] = Math.round(clamp(((x - TRACK.x) / TRACK.w) * 100, 0, 100)) }

  // melodi 8 langkah; tiap unsur rusak sebanding dengan jarak slider dari targetnya
  makeHits() {
    const [eN, eR, eM, eH] = [0, 1, 2, 3].map((i) => this.err(i))
    const cents = (this.vals[0] - CALIB[0].target) * 7
    const semi = 4 + (this.vals[3] - CALIB[3].target) * 0.07
    const hits = []
    for (let i = 0; i < 8; i++) {
      let idx = MEL[i]
      if (Math.random() < eM * 0.85) idx = (idx + 1 + Math.floor(Math.random() * 3)) % 5
      const f = BASE[idx] * 2 ** (cents / 1200)
      const off = (Math.random() * 2 - 1) * eR * 0.45
      hits.push({ v: 'pluck', step: i, off, f, vol: 0.3 })
      if (i % 2 === 0) hits.push({ v: 'pluck', step: i, off, f: f * 2 ** (semi / 12), vol: 0.14 })
      if (i % 2 === 0) hits.push({ v: 'hat', step: i, off: 0 })
    }
    return hits
  }

  hint() {
    if (this.done || this.hints >= 4) return
    let worst = -1, we = -1
    for (let i = 0; i < 4; i++) if (!this.revealed[i] && this.err(i) > we) { we = this.err(i); worst = i }
    if (worst < 0) return
    this.revealed[worst] = true
    this.hints += 1
    Audio.click()
    this.msg.setText(`Titik terang di ${CALIB[worst].label} = sasaran.`)
  }

  leave(result) { this.loop?.stop(); closeMini(this, result) }

  update(_, delta) {
    const dt = Math.min(delta, 50) / 1000
    this.t += dt
    if (!this.done) this.elapsed += dt
    const errs = [0, 1, 2, 3].map((i) => this.err(i))
    const mean = errs.reduce((a, b) => a + b, 0) / 4
    const allOk = CALIB.every((c, i) => Math.abs(this.vals[i] - c.target) <= CALIB_TOL)
    if (!this.done) {
      this.lockT = allOk ? this.lockT + dt : 0
      if (this.lockT >= CALIB_HOLD) this.win()
    }
    this.draw(errs, mean, allOk)
  }

  win() {
    this.done = true
    this.loop?.stop()
    this.score = Math.max(60, 100 - this.hints * 10 - Math.max(0, Math.floor((this.elapsed - 60) / 20)) * 10)
    this.info.setText('TELINGAMU SUDAH PERSEPTIF!')
    this.msg.setText('Gelombang mulus, semua selaras!')
    Audio.win()
    this.time.delayedCall(2300, () => closeMini(this, { score: this.score }))
  }

  draw(errs, mean, allOk) {
    const g = this.gfx
    g.clear()
    // layar osiloskop
    g.fillStyle(0x0f0b18).fillRect(SCOPE.x - 3, SCOPE.y - 3, SCOPE.w + 6, SCOPE.h + 6)
    g.fillStyle(0x16341f).fillRect(SCOPE.x, SCOPE.y, SCOPE.w, SCOPE.h)
    g.lineStyle(1, 0x2c5a3a)
    for (let i = 1; i < 8; i++) { g.lineBetween(SCOPE.x + (SCOPE.w * i) / 8, SCOPE.y, SCOPE.x + (SCOPE.w * i) / 8, SCOPE.y + SCOPE.h) }
    for (let i = 1; i < 4; i++) { g.lineBetween(SCOPE.x, SCOPE.y + (SCOPE.h * i) / 4, SCOPE.x + SCOPE.w, SCOPE.y + (SCOPE.h * i) / 4) }
    const [eN, eR, eM, eH] = errs, t = this.t, cy = SCOPE.y + SCOPE.h / 2
    const col = this.done || allOk ? 0xa8e8d3 : (mean < 0.35 ? 0xffd467 : 0xf594b5)
    g.lineStyle(2, col)
    g.beginPath()
    for (let px = 0; px <= SCOPE.w; px += 2) {
      const x = (px / SCOPE.w) * 6.2832 * 3
      const w = Math.sin(x + t * 6 + eN * 3 * Math.sin(x * 2.3)) * (1 - 0.55 * eR * Math.abs(Math.sin(x * 0.7 + t * 3)))
        + eM * 0.55 * Math.sin(x * 7.3 + t * 11) * Math.sin(x * 1.1)
        + eH * 0.6 * Math.sin(x * 1.09 + t * 6.5)
      const y = cy - clamp(w, -1.4, 1.4) * (SCOPE.h * 0.33)
      px === 0 ? g.moveTo(SCOPE.x + px, y) : g.lineTo(SCOPE.x + px, y)
    }
    g.strokePath()

    // slider
    for (let i = 0; i < 4; i++) {
      const y = TRACK.y0 + i * TRACK.gap
      const ok = Math.abs(this.vals[i] - CALIB[i].target) <= CALIB_TOL
      g.fillStyle(0x0f0b18).fillRect(TRACK.x - 2, y - 4, TRACK.w + 4, 8)
      g.fillStyle(0x5b4570).fillRect(TRACK.x, y - 2, TRACK.w, 4)
      g.fillStyle(this.done ? 0xa8e8d3 : 0xf594b5).fillRect(TRACK.x, y - 2, (TRACK.w * this.vals[i]) / 100, 4)
      if (this.revealed[i]) { const tx = TRACK.x + (TRACK.w * CALIB[i].target) / 100; g.fillStyle(0xffd467).fillRect(tx - 1, y - 7, 3, 14) }
      const kx = TRACK.x + (TRACK.w * this.vals[i]) / 100
      g.fillStyle(0x3a2a4d).fillRect(kx - 5, y - 7, 10, 14)
      g.fillStyle(i === this.sel ? 0xffd467 : 0xfffaf0).fillRect(kx - 4, y - 6, 8, 12)
      if (this.revealed[i] && ok) g.fillStyle(0x4ea08a).fillRect(kx - 2, y - 3, 4, 6)
      this.valTxt[i].setText(`${this.vals[i]}%`)
    }
    // keselarasan
    const al = Math.round((1 - mean) * 100)
    g.fillStyle(0x0f0b18).fillRect(TRACK.x - 2, 176, TRACK.w + 4, 10)
    g.fillStyle(0xfffaf0).fillRect(TRACK.x, 178, TRACK.w, 6)
    g.fillStyle(al > 90 ? 0x72c7ae : al > 60 ? 0xffd467 : 0xf594b5).fillRect(TRACK.x, 178, (TRACK.w * al) / 100, 6)
    this.meterVal.setText(`${al}%`)
    if (!this.msg.text) this.msg.setText('Dengarkan: bunyi mana yang sumbang?')
  }
}
