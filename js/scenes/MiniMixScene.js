import { GAME_W as W, GAME_H as H } from '../config.js'
import { Audio } from '../systems/Audio.js'
import { CHIPS, TRACKS, STEPS, LOOP_SEC } from '../data/mix.js'
import { txt, exitButton, closeMini } from '../ui/miniUi.js'

// MISI 4: Ramuan Modern Etnik. Tiap track punya pemilih < chip > dengan 4 pilihan.
// Track 1 (ritme) dan Track 2 (harmoni) = presisi digital, Track 3 (melodi) = organik tradisional (human error).
// Semua chip berada pada satu tangga nada dan rangkaian akor (Am-F-C-G), jadi kombinasi apa pun tetap selaras.
const L = { y0: 48, h: 38, gap: 3 }
const TL = { x: 136, w: 240 }
const laneY = (i) => L.y0 + i * (L.h + L.gap)
const COL = { digital: 0x4ea08a, organik: 0xc96890 }
const SEL = { ax: 6, aw: 14, bx: 22, bw: 92, rx: 116 }   // panah kiri, kotak chip, panah kanan (lebar relatif ke x kiri panel)
const ALL = Object.keys(CHIPS)

// rentang nada tiap chip (untuk posisi vertikal batang nada)
const RANGE = {}
for (const [id, c] of Object.entries(CHIPS)) {
  const ms = c.hits.flatMap((h) => h.m || [])
  RANGE[id] = ms.length ? [Math.min(...ms), Math.max(...ms)] : null
}
const PERC_H = { kick: 20, snare: 15, hat: 7, ohat: 9, clap: 14, tom: 18, rim: 10 }

export class MiniMixScene extends Phaser.Scene {
  constructor() { super('MiniMix') }
  init(d) { this.parentKey = d.parent; this.practice = !!d.practice }

  create() {
    this.cameras.main.setBackgroundColor('#3a2a4d')
    this.cameras.main.fadeIn(300, 255, 255, 255)
    const g = this.add.graphics()
    g.fillStyle(0x5b4570).fillRect(0, 0, W, H)
    g.fillStyle(0x7561ad).fillRect(0, 0, W, 44)
    g.fillStyle(0xf594b5).fillRect(0, 42, W, 2)
    txt(this, W / 2, 6, 'RAMUAN MODERN ETNIK', { color: '#fffaf0', stroke: '#3a2a4d' })
    this.info = txt(this, W / 2, 20, 'GANTI CHIP DENGAN PANAH < >, LALU DENGARKAN', { color: '#fffaf0', stroke: '#3a2a4d' })
    this.msg = txt(this, 8, 171, '', { color: '#fff7b8', stroke: '#3a2a4d', align: 0, depth: 6 })
    this.msg.setWordWrapWidth(W - 16)
    exitButton(this, () => this.leave(null))

    this.sel = [0, 0, 0]            // indeks pilihan tiap track
    this.changed = [false, false, false]
    this.played = false
    this.locked = false
    this.mixer = null
    this.ready = false

    this.laneGfx = this.add.graphics().setDepth(1)
    this.hits = this.add.graphics().setDepth(3)
    this.rows = TRACKS.map((t, i) => this.makeRow(t, i))
    this.rows.forEach((r, i) => this.refreshRow(i))

    this.btnShuffle = this.button(48, 202, 76, 'ACAK', 0x7561ad, () => this.shuffle())
    this.btnPlay = this.button(W / 2 + 18, 202, 112, 'PUTAR RACIKAN', 0xc96890, () => this.togglePlay())
    this.btnDone = this.button(W / 2 + 130, 202, 96, 'SELESAI', 0x4ea08a, () => this.finish())
    this.setEnabled(this.btnPlay, false); this.setEnabled(this.btnDone, false)
    this.msg.setText('Memuat chip...')
    Audio.loadChips(ALL).then(() => {
      if (!this.sys.isActive()) return
      this.ready = true
      this.setEnabled(this.btnPlay, true)
      this.msg.setText('Pilih chip tiap track. Tekan panah, racikanmu langsung terdengar.')
    })
    this.events.once('shutdown', () => this.mixer?.stop())
  }

  button(cx, cy, w, label, color, onClick) {
    const r = this.add.rectangle(cx, cy, w, 18, color).setStrokeStyle(2, 0x3a2a4d).setDepth(5).setInteractive({ useHandCursor: true })
    const t = txt(this, cx, cy - 5, label, { color: '#fffaf0', stroke: '#3a2a4d', depth: 6 })
    const b = { r, t, on: true, color }
    r.on('pointerdown', () => { if (b.on && !this.locked) { Audio.click(); onClick() } })
    return b
  }
  setEnabled(b, on) { b.on = on; b.r.setFillStyle(on ? b.color : 0x6b5a80); b.t.setAlpha(on ? 1 : 0.5) }

  // satu baris track: label, panah kiri, kotak chip (ikon + nama), panah kanan, titik indikator
  makeRow(t, i) {
    const y = laneY(i)
    txt(this, SEL.ax, y + 1, `${t.label} · ${t.role}`, { color: '#ffd467', stroke: '#3a2a4d', align: 0, depth: 4 })
    const arrow = (x, dir) => {
      const r = this.add.rectangle(x + SEL.aw / 2, y + 22, SEL.aw, 18, 0xfffaf0).setStrokeStyle(2, 0x3a2a4d).setDepth(4).setInteractive({ useHandCursor: true })
      const gr = this.add.graphics().setDepth(5).fillStyle(0x7561ad)
      const cx = x + SEL.aw / 2
      if (dir < 0) gr.fillTriangle(cx + 2, y + 16, cx + 2, y + 28, cx - 3, y + 22)
      else gr.fillTriangle(cx - 2, y + 16, cx - 2, y + 28, cx + 3, y + 22)
      r.on('pointerdown', () => { if (!this.locked) this.step(i, dir) })
      r.on('pointerover', () => r.setFillStyle(0xe2d4f7)); r.on('pointerout', () => r.setFillStyle(0xfffaf0))
    }
    arrow(SEL.ax, -1); arrow(SEL.rx, 1)
    const box = this.add.rectangle(SEL.bx + SEL.bw / 2, y + 22, SEL.bw, 18, 0xfffaf0).setStrokeStyle(2, 0x3a2a4d).setDepth(4)
    const ico = this.add.image(SEL.bx + 12, y + 22, 'synth').setDepth(5)
    const name = txt(this, SEL.bx + 25, y + 18, '', { color: '#3a2a4d', stroke: null, align: 0, depth: 5 })
    const dots = this.add.graphics().setDepth(5)
    return { y, box, ico, name, dots, t }
  }

  refreshRow(i) {
    const r = this.rows[i], id = TRACKS[i].options[this.sel[i]], c = CHIPS[id]
    const src = this.textures.get(c.tex).getSourceImage()
    r.ico.setTexture(c.tex).setScale(Math.min(2, 16 / src.width, 14 / src.height))
    r.name.setText(c.name.toUpperCase()).setScale(1)
    if (r.name.width > 64) r.name.setScale(64 / r.name.width)
    r.box.setFillStyle(c.kind === 'digital' ? 0xe3f6ef : 0xfde4ec)
    r.dots.clear()
    TRACKS[i].options.forEach((_, k) => {
      r.dots.fillStyle(k === this.sel[i] ? COL[c.kind] : 0x3a2a4d).fillRect(SEL.bx + SEL.bw / 2 - 18 + k * 10, r.y + 33, 6, 3)
    })
  }

  step(i, dir) {
    const n = TRACKS[i].options.length
    this.sel[i] = (this.sel[i] + dir + n) % n
    this.changed[i] = true
    this.refreshRow(i)
    this.audition(i)
  }

  shuffle() {
    TRACKS.forEach((t, i) => { this.sel[i] = Phaser.Math.Between(0, t.options.length - 1); this.changed[i] = true; this.refreshRow(i) })
    this.audition(-1)
  }

  // ganti chip langsung terdengar: bila belum diputar, mulai memutar
  audition(i) {
    if (!this.ready) return
    const id = (k) => TRACKS[k].options[this.sel[k]]
    if (!this.mixer) this.startMix()
    else if (i >= 0) this.mixer.setTrack(i, id(i))
    else TRACKS.forEach((_, k) => this.mixer.setTrack(k, id(k)))
    const c = CHIPS[i >= 0 ? id(i) : id(2)]
    this.msg.setText(i >= 0 ? c.ket : 'Racikan acak! Dengarkan, lalu ubah lagi sesukamu.')
    this.markPlayed()
  }

  startMix() {
    this.mixer = Audio.chipMixer(LOOP_SEC)
    TRACKS.forEach((t, k) => this.mixer.setTrack(k, t.options[this.sel[k]]))
    this.btnPlay.t.setText('HENTIKAN')
  }

  markPlayed() { this.played = true; this.setEnabled(this.btnDone, true) }

  togglePlay() {
    if (this.mixer) { this.mixer.stop(); this.mixer = null; this.btnPlay.t.setText('PUTAR RACIKAN'); return }
    this.startMix()
    this.markPlayed()
    this.msg.setText('Lihat: ketukan mesin lurus di grid, napas manusia sedikit melenceng. Ganti chip dengan panah.')
  }

  finish() {
    if (!this.played || this.locked) return
    this.locked = true
    this.mixer?.stop(); this.mixer = null
    const explored = this.changed.filter(Boolean).length
    this.score = 70 + explored * 10
    this.info.setText(explored === 3 ? 'RAMUAN SEMPURNA!' : 'RAMUANMU SELESAI!')
    this.msg.setText(explored === 3 ? 'Kamu menjelajahi ketiga track. Mesin menjaga ketepatan, tradisi memberi jiwa.' : 'Coba ganti chip di semua track lain kali untuk nilai penuh.')
    Audio.win()
    this.time.delayedCall(2200, () => closeMini(this, { score: this.score }))
  }

  leave(result) { this.mixer?.stop(); closeMini(this, result) }

  update() {
    const g = this.laneGfx, h = this.hits
    g.clear(); h.clear()
    const phase = this.mixer ? this.mixer.phase() : -1
    const sw = TL.w / STEPS
    TRACKS.forEach((t, i) => {
      const y = laneY(i), id = t.options[this.sel[i]], c = CHIPS[id]
      g.fillStyle(0x3a2a4d).fillRect(TL.x - 2, y - 2, TL.w + 4, L.h + 4)
      g.fillStyle(0xfffaf0, 0.94).fillRect(TL.x, y, TL.w, L.h)
      for (let s = 0; s <= STEPS; s++) {
        const x = TL.x + sw * s
        g.fillStyle(s % 8 === 0 ? 0x9d86cf : s % 4 === 0 ? 0xcdbbea : 0xeee6fa).fillRect(Math.round(x), y, 1, L.h)
      }
      const rg = RANGE[id]
      const base = COL[c.kind]
      for (const ht of c.hits) {
        const px = TL.x + sw * (ht.step + (ht.off || 0))
        const near = phase >= 0 && Math.abs(((phase * STEPS - (ht.step + (ht.off || 0)) + STEPS * 1.5) % STEPS) - STEPS / 2) < 0.5
        const col = near ? 0xffd467 : base
        if (c.kind === 'organik') h.fillStyle(0xcdbbea).fillRect(Math.round(TL.x + sw * ht.step), y + L.h - 3, 1, 3)   // posisi grid (acuan mesin)
        if (!ht.m) {
          const hh = PERC_H[ht.v] || 12
          h.fillStyle(col).fillRect(Math.round(px) - 1, y + (L.h - hh) / 2, near ? 4 : 3, hh)
        } else {
          const lo = rg[0], hi = rg[1]
          const rows = ht.m.length
          for (const m of ht.m) {
            const f = hi === lo ? 0.5 : (m - lo) / (hi - lo)
            const yy = y + L.h - 6 - f * (L.h - 12)
            const w = Math.max(2, (ht.len || 1) * sw - 1)
            h.fillStyle(col).fillRect(Math.round(px), Math.round(yy), near ? w + 1 : w, rows > 1 ? 2 : 3)
          }
        }
      }
    })
    if (phase >= 0) {
      const x = Math.round(TL.x + TL.w * phase)
      h.fillStyle(0x3a2a4d).fillRect(x, laneY(0) - 4, 2, laneY(2) + L.h - laneY(0) + 8)
    }
  }
}
