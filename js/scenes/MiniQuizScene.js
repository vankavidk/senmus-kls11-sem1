import { GAME_W as W, GAME_H as H } from '../config.js'
import { Audio } from '../systems/Audio.js'
import { KUIS, PASS } from '../data/kuis.js'
import { txt, exitButton, closeMini } from '../ui/miniUi.js'

// Kuis Layar Materi: 10 soal, lima jenis (pilihan ganda, benar/salah, isi kata, susun urutan, jodohkan).
// Jenis seret: tiap potongan bisa diseret ke kotak, atau diketuk (ketuk lagi untuk mengembalikan).
const HINT = { mc: 'PILIH JAWABAN', tf: 'BENAR ATAU SALAH', fill: 'SERET KATA KE KOTAK', order: 'SERET, SUSUN URUTAN', match: 'SERET, JODOHKAN' }
const SX = 249, SW = 246, SH = 19, CW = 178, CH = 18   // kotak jawaban dan potongan

export class MiniQuizScene extends Phaser.Scene {
  constructor() { super('MiniQuiz') }
  init(d) { this.parentKey = d.parent; this.kid = d.kuis; this.K = KUIS[d.kuis] }

  create() {
    this.cameras.main.setBackgroundColor('#3a2a4d')
    this.cameras.main.fadeIn(300, 255, 255, 255)
    const g = this.add.graphics()
    g.fillStyle(0x5b4570).fillRect(0, 0, W, H)
    g.fillStyle(0x7561ad).fillRect(0, 0, W, 24)
    g.fillStyle(0xf594b5).fillRect(0, 22, W, 2)
    txt(this, W / 2, 4, this.K.title.toUpperCase(), { color: '#fffaf0', stroke: '#3a2a4d' })
    this.prog = txt(this, W / 2, 14, '', { color: '#ffd467', stroke: '#3a2a4d' })
    exitButton(this, () => closeMini(this, null))
    this.items = Phaser.Utils.Array.Shuffle(this.K.q.slice())
    this.i = 0; this.right = 0
    this.input.dragDistanceThreshold = 3
    this.show()
  }

  head() { this.prog.setText(`SOAL ${this.i + 1} DARI ${this.items.length} · ${HINT[this.cur.t]} · BENAR ${this.right}`) }
  add_(o) { this.ui.push(o); return o }

  show() {
    this.ui?.forEach((o) => o.destroy())
    this.ui = []; this.locked = false; this.chips = []; this.slots = []; this.btnCek = null
    const it = this.cur = this.items[this.i]
    this.head()
    const q = this.add_(txt(this, W / 2, 30, it.q, { color: '#fffaf0', stroke: '#3a2a4d' }))
    q.setWordWrapWidth(W - 28)
    this.fb = this.add_(txt(this, 8, 186, '', { color: '#fff7b8', stroke: '#3a2a4d', align: 0 }))
    this.fb.setWordWrapWidth(W - 24)
    if (it.t === 'mc') this.buildChoice(it.o.map((t, k) => ({ t, ok: k === it.a })), 66, 28, W - 36, 25, 1)
    else if (it.t === 'tf') this.buildChoice([{ t: 'BENAR', ok: it.a === true }, { t: 'SALAH', ok: it.a === false }], 84, 0, 150, 56, 2)
    else this.buildDrag(it)
  }

  // ---------- pilihan ganda / benar-salah ----------
  buildChoice(opts, y0, step, w, h, cols) {
    const order = it => it
    const list = this.cur.t === 'mc' ? Phaser.Utils.Array.Shuffle(opts.slice()) : opts
    this.btns = list.map((o, k) => {
      const x = cols === 1 ? W / 2 : W / 2 + (k === 0 ? -85 : 85)
      const y = cols === 1 ? y0 + k * step : y0
      const r = this.add_(this.add.rectangle(x, y + h / 2, w, h, 0xfffaf0).setStrokeStyle(2, 0x3a2a4d).setInteractive({ useHandCursor: true }))
      const t = this.add_(txt(this, x, y + h / 2, o.t, { color: '#3a2a4d', stroke: null, size: cols === 2 ? 12 : 8 }))
      t.setWordWrapWidth(w - 12).setOrigin(0.5, 0.5).setAlign('center')
      r.on('pointerover', () => { if (!this.locked) r.setFillStyle(0xe2d4f7) })
      r.on('pointerout', () => { if (!this.locked) r.setFillStyle(0xfffaf0) })
      r.on('pointerdown', () => this.pickChoice(k, o.ok))
      return { r, ok: o.ok }
    })
  }

  pickChoice(k, ok) {
    if (this.locked) return
    this.locked = true
    this.btns.forEach((b) => { if (b.ok) b.r.setFillStyle(0xa8e8d3) })
    if (!ok) this.btns[k].r.setFillStyle(0xf5a3a3)
    this.verdict(ok)
  }

  verdict(ok) {
    if (ok) { this.right++; Audio.sfx('ok') } else Audio.sfx('bad')
    this.fb.setText(`${ok ? 'BENAR!' : 'BELUM TEPAT.'} ${this.cur.e}`)
    this.head()
    if (this.btnCek) this.btnCek.setVisible(false)
    this.time.delayedCall(ok ? 1800 : 2800, () => this.next())
  }

  // ---------- seret: fill / order / match ----------
  buildDrag(it) {
    let labels, chipDefs
    if (it.t === 'fill') { labels = ['JAWABAN']; chipDefs = [{ t: it.ans, f: 0 }, ...it.d.map((t) => ({ t, f: -1 }))] }
    else if (it.t === 'order') { labels = it.items.map((_, i) => String(i + 1)); chipDefs = it.items.map((t, i) => ({ t, f: i })) }
    else { labels = it.pairs.map((p) => p[0]); chipDefs = it.pairs.map((p, i) => ({ t: p[1], f: i })) }
    const n = labels.length, y0 = it.t === 'fill' ? 64 : 56
    labels.forEach((l, i) => {
      const y = y0 + i * 21 + SH / 2
      const rect = this.add_(this.add.rectangle(SX, y, SW, SH, 0xe9defa).setStrokeStyle(2, 0x3a2a4d))
      const lab = this.add_(txt(this, it.t === 'order' ? 114 : 8, y - 4, it.t === 'order' ? l : l, { color: '#ffd467', stroke: '#3a2a4d', align: 0 }))
      if (it.t !== 'order' && lab.width > 112) lab.setScale(112 / lab.width)
      if (it.t === 'order') lab.setX(112 - lab.width)
      this.slots.push({ y, rect, occ: null })
    })
    const py = it.t === 'fill' ? y0 + 36 : y0 + n * 21 + 8
    Phaser.Utils.Array.Shuffle(chipDefs).forEach((d, k) => {
      const hx = 12 + CW / 2 + (k % 2) * 186, hy = py + Math.floor(k / 2) * 22 + CH / 2
      const rect = this.add.rectangle(0, 0, CW, CH, 0xfffaf0).setStrokeStyle(2, 0x3a2a4d)
      const tx = txt(this, 0, -4, d.t, { color: '#3a2a4d', stroke: null })
      tx.setWordWrapWidth(500); if (tx.width > CW - 8) tx.setScale((CW - 8) / tx.width)
      const c = this.add_(this.add.container(hx, hy, [rect, tx]).setSize(CW, CH).setDepth(10).setInteractive({ useHandCursor: true }))
      this.input.setDraggable(c)
      const ch = { c, rect, hx, hy, f: d.f, slot: -1 }
      c.on('dragstart', (p) => { if (this.locked) return; ch.sx = p.x; ch.sy = p.y; c.setDepth(30); this.freeSlot(ch) })
      c.on('drag', (p, dx, dy) => { if (!this.locked) c.setPosition(dx, dy) })
      c.on('dragend', (p) => {
        if (this.locked) return
        c.setDepth(10)
        if (Math.hypot(p.x - ch.sx, p.y - ch.sy) < 4) { this.tap(ch); return }
        const si = this.slots.findIndex((s) => Math.abs(p.y - s.y) <= SH / 2 + 2 && p.x >= SX - SW / 2 - 6 && p.x <= SX + SW / 2 + 6)
        if (si >= 0) this.place(ch, si); else this.home(ch)
      })
      this.chips.push(ch)
    })
    if (it.t !== 'fill') {
      const r = this.add_(this.add.rectangle(336, 202, 80, 18, 0x4ea08a).setStrokeStyle(2, 0x3a2a4d).setInteractive({ useHandCursor: true }))
      const t = this.add_(txt(this, 336, 198, 'CEK', { color: '#fffaf0', stroke: '#3a2a4d' }))
      const grp = { r, t, setVisible: (v) => { r.setVisible(v); t.setVisible(v) } }
      r.on('pointerdown', () => { if (!this.locked && this.allFilled()) { Audio.click(); this.check() } })
      this.btnCek = grp; this.updateCek()
    }
  }

  allFilled() { return this.slots.every((s) => s.occ) }
  updateCek() { if (!this.btnCek) return; const on = this.allFilled(); this.btnCek.r.setFillStyle(on ? 0x4ea08a : 0x6b5a80); this.btnCek.t.setAlpha(on ? 1 : 0.5) }
  freeSlot(ch) { if (ch.slot >= 0) { this.slots[ch.slot].occ = null; ch.slot = -1 } this.updateCek() }
  home(ch) { this.freeSlot(ch); this.tweens.add({ targets: ch.c, x: ch.hx, y: ch.hy, duration: 140 }) }
  tap(ch) {
    if (ch.slot >= 0) return this.home(ch)
    const si = this.slots.findIndex((s) => !s.occ)
    if (si >= 0) this.place(ch, si); else this.home(ch)
  }
  place(ch, si) {
    const s = this.slots[si]
    if (s.occ && s.occ !== ch) this.home(s.occ)
    this.freeSlot(ch)
    s.occ = ch; ch.slot = si
    Audio.sfx('pickup')
    this.tweens.add({ targets: ch.c, x: SX, y: s.y, duration: 120 })
    this.updateCek()
    if (this.cur.t === 'fill') this.check()
  }
  check() {
    if (this.locked) return
    this.locked = true
    let all = true
    this.slots.forEach((s, i) => {
      const good = s.occ && s.occ.f === i
      if (!good) all = false
      s.occ?.rect.setFillStyle(good ? 0xa8e8d3 : 0xf5a3a3)
    })
    this.verdict(all)
  }

  // ---------- hasil ----------
  next() {
    this.i++
    if (this.i < this.items.length) return this.show()
    this.ui.forEach((o) => o.destroy())
    const n = this.items.length, pass = this.right >= PASS, score = Math.round((this.right / n) * 100)
    this.ui = []
    const t = (y, s, o) => this.ui.push(txt(this, W / 2, y, s, o))
    t(50, pass ? 'KUIS LULUS!' : 'BELUM LULUS', { color: pass ? '#a8e8d3' : '#f5a3a3', stroke: '#3a2a4d' })
    t(76, `${this.right} dari ${n} benar · nilai ${score}`, { color: '#fffaf0', stroke: '#3a2a4d' })
    t(104, pass ? 'Kamu memahami materi dengan baik.' : `Butuh minimal ${PASS} benar. Tonton ulang filmnya, lalu coba lagi.`, { color: '#fff7b8', stroke: '#3a2a4d' })
    this.prog.setText('HASIL KUIS')
    if (pass) Audio.win(); else Audio.sfx('bad')
    const r = this.add.rectangle(W / 2, 160, 120, 22, 0xc96890).setStrokeStyle(2, 0x3a2a4d).setInteractive({ useHandCursor: true })
    const bt = txt(this, W / 2, 155, pass ? 'LANJUT' : 'SELESAI', { color: '#fffaf0', stroke: '#3a2a4d' })
    this.ui.push(r, bt)
    r.on('pointerdown', () => closeMini(this, { score, pass }))
  }
}
