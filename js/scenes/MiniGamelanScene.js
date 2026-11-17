import { GAME_W as W, GAME_H as H } from '../config.js'
import { Audio } from '../systems/Audio.js'
import { txt, exitButton, closeMini } from '../ui/miniUi.js'

// MISI 2: Dinamika Gamelan (gaya kebyar Bali).
// Fase 1: dengarkan tiap instrumen. Fase 2: tabuh berurutan dari gaung terpanjang & terendah (Gong)
// hingga ledakan pendek & tertinggi (Ceng-ceng). Urutan acak setiap percobaan.
const SET = [
  { key: 'gong', name: 'GONG AGENG', scale: 3, res: 5, pitch: 1, ket: 'Gaung sangat panjang, nada sangat rendah' },
  { key: 'kempul', name: 'KEMPUL', scale: 3, res: 4, pitch: 2, ket: 'Gaung panjang, nada rendah' },
  { key: 'kenong', name: 'KENONG', scale: 3, res: 3, pitch: 3, ket: 'Gaung sedang, nada menengah' },
  { key: 'gender', name: 'GENDER', scale: 2, res: 2, pitch: 4, ket: 'Gaung pendek, nada tinggi' },
  { key: 'cengceng', name: 'CENG-CENG', scale: 3, res: 1, pitch: 5, ket: 'Meledak, sangat pendek, nada tertinggi' },
]

export class MiniGamelanScene extends Phaser.Scene {
  constructor() { super('MiniGamelan') }
  init(d) { this.parentKey = d.parent; this.practice = !!d.practice }

  create() {
    this.cameras.main.setBackgroundColor('#3a2a4d')
    this.cameras.main.fadeIn(300, 255, 255, 255)
    const g = this.add.graphics()
    g.fillStyle(0x5b4570).fillRect(0, 0, W, H)
    g.fillStyle(0xb97c4a).fillRect(0, 138, W, H - 138)
    g.fillStyle(0xe0a96d).fillRect(0, 138, W, 4)
    for (let x = 0; x < W; x += 22) g.fillStyle(0x8a5a3c).fillRect(x, 142, 1, H - 142)

    this.title = txt(this, W / 2, 6, '', { color: '#ffd467', stroke: '#3a2a4d' })
    this.info = txt(this, W / 2, 18, '', { color: '#fffaf0', stroke: '#3a2a4d' })
    this.msg = txt(this, W / 2, 173, '', { color: '#fff7b8', stroke: '#3a2a4d' })
    exitButton(this, () => closeMini(this, null))

    this.errors = 0
    this.slots = []
    this.items = []
    this.phase = 'dengar'
    this.next = 0
    this.heard = new Set()

    this.sync = this.add.graphics().setDepth(2)
    this.build()
    this.btn = this.add.rectangle(W / 2, 200, 150, 18, 0xc96890).setStrokeStyle(2, 0x3a2a4d).setDepth(5).setInteractive({ useHandCursor: true })
    this.btnText = txt(this, W / 2, 195, 'SIAP, SUSUN URUTAN', { color: '#fffaf0', stroke: '#3a2a4d', depth: 6 })
    this.btn.on('pointerdown', () => { if (this.phase === 'dengar') this.startOrder() })
    this.setPhase('dengar')

    const kb = this.input.keyboard
    for (let i = 1; i <= 5; i++) kb.on(`keydown-${i}`, () => this.tap(this.items[i - 1]))
    this.events.once('shutdown', () => kb.removeAllListeners())
  }

  // posisi tetap ke-i; instrumen ditempatkan sesuai urutan acak
  build(order = [0, 1, 2, 3, 4]) {
    this.items.forEach((it) => { it.sprite.destroy(); it.label.destroy(); it.meter.destroy(); it.num.destroy() })
    this.items = order.map((idx, i) => {
      const d = SET[idx], x = 48 + i * 72
      const sprite = this.add.image(x, 136, d.key).setOrigin(0.5, 1).setScale(d.scale).setDepth(3).setInteractive({ useHandCursor: true })
      const label = txt(this, x, 143, d.name, { size: 8, color: '#fffaf0', stroke: '#3a2a4d', depth: 4 })
      const meter = this.add.graphics().setDepth(4)
      const num = txt(this, x, 96 - (d.key === 'gong' ? 20 : 0), `${i + 1}`, { size: 8, color: '#ffd467', stroke: '#3a2a4d', depth: 5 })
      const it = { d, x, sprite, label, meter, num }
      sprite.on('pointerdown', () => this.tap(it))
      return it
    })
    this.items.forEach((it) => this.drawMeter(it, this.phase === 'dengar' && this.heard.has(it.d.key)))
  }

  drawMeter(it, show) {
    const m = it.meter
    m.clear()
    const bars = [['GAUNG', it.d.res, 0xf594b5], ['NADA', it.d.pitch, 0x72c7ae]]
    bars.forEach(([name, v, col], r) => {
      const y = 158 + r * 10, x0 = it.x - 24
      m.fillStyle(0x3a2a4d).fillRect(x0 - 1, y - 1, 50, 7)
      m.fillStyle(0xfffaf0).fillRect(x0, y, 48, 5)
      if (show) m.fillStyle(col).fillRect(x0, y, (48 * v) / 5, 5)
    })
  }

  setPhase(p) {
    this.phase = p
    if (p === 'dengar') {
      this.title.setText('FASE 1: DENGARKAN')
      this.info.setText('KETUK TIAP INSTRUMEN (ATAU 1-5): DENGARKAN GAUNG & NADA')
      this.btn.setVisible(true); this.btnText.setVisible(true)
    } else {
      this.title.setText('FASE 2: SUSUN INTENSITAS')
      this.info.setText('TABUH DARI GAUNG TERPANJANG KE LEDAKAN TERPENDEK')
      this.btn.setVisible(false); this.btnText.setVisible(false)
    }
    this.drawSlots()
  }

  drawSlots() {
    const g = this.sync
    g.clear()
    if (this.phase !== 'susun') return
    for (let i = 0; i < 5; i++) {
      const x = W / 2 - 60 + i * 30, y = 40
      g.fillStyle(0x3a2a4d).fillRect(x - 11, y - 11, 22, 22)
      g.fillStyle(i < this.next ? 0xffd467 : 0x7561ad).fillRect(x - 9, y - 9, 18, 18)
    }
    this.slotIcons?.forEach((s) => s.destroy())
    this.slotIcons = []
    for (let i = 0; i < this.next; i++) {
      this.slotIcons.push(this.add.image(W / 2 - 60 + i * 30, 40, SET[i].key).setScale(SET[i].key === 'gender' ? 0.6 : 0.8).setDepth(4))
    }
  }

  startOrder() {
    Audio.click()
    const order = Phaser.Utils.Array.Shuffle([0, 1, 2, 3, 4])
    this.next = 0
    this.phase = 'susun'
    this.build(order)
    this.setPhase('susun')
    this.msg.setText('Dengarkan, lalu pilih yang paling dalam dulu.')
  }

  flash(it, color) {
    this.tweens.add({ targets: it.sprite, scale: it.d.scale * 1.18, duration: 90, yoyo: true })
    const ring = this.add.circle(it.x, 110, 6, color, 0.6).setDepth(2)
    this.tweens.add({ targets: ring, radius: 30, alpha: 0, duration: 420 * it.d.res, onComplete: () => ring.destroy() })
  }

  tap(it) {
    if (!it || this.locked) return
    Audio.strike(it.d.key)
    if (this.phase === 'dengar') {
      this.heard.add(it.d.key)
      this.drawMeter(it, true)
      this.flash(it, 0xffd467)
      this.msg.setText(it.d.ket)
      return
    }
    const want = SET[this.next]
    if (it.d.key === want.key) {
      this.flash(it, 0x72c7ae)
      this.next += 1
      it.sprite.setTint(0xfff7b8)
      this.drawSlots()
      if (this.next >= 5) { this.win(); return }
      this.msg.setText(`${want.name}: tepat! Lanjut ke yang lebih menyala.`)
    } else {
      this.errors += 1
      Audio.bad()
      this.flash(it, 0xc0334f)
      this.cameras.main.shake(160, 0.004)
      this.items.forEach((x) => x.sprite.clearTint())
      this.next = 0
      this.drawSlots()
      this.msg.setText(this.errors >= 2 ? 'Petunjuk: mulai dari gaung PALING PANJANG dan nada PALING RENDAH.' : 'Belum tepat. Urutan diulang dari awal.')
    }
  }

  win() {
    this.locked = true
    this.score = Math.max(50, 100 - this.errors * 12)
    this.title.setText('GAMELAN BERGELORA!')
    this.msg.setText('Bunyi menanjak seperti api yang tumbuh.')
    Audio.win()
    this.items.forEach((it, i) => this.time.delayedCall(i * 80, () => this.flash(it, 0xffd467)))
    this.time.delayedCall(2300, () => closeMini(this, { score: this.score }))
  }
}
