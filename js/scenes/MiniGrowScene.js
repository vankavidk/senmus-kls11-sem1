import { GAME_W as W, GAME_H as H } from '../config.js'
import { Audio } from '../systems/Audio.js'
import { GROW } from '../data/taman.js'
import { txt, exitButton, closeMini } from '../ui/miniUi.js'

// MISI 9: Tumbuh Kembang Melodi. Seret blok ke menara dari bawah: Motif, Frasa, lalu Kalimat Lagu.
const BH = 28, TX = 108, TY0 = 168, STEP = 36


export class MiniGrowScene extends Phaser.Scene {
  constructor() { super('MiniGrow') }
  init(d) { this.parentKey = d.parent; this.practice = !!d.practice }

  create() {
    this.cameras.main.setBackgroundColor('#2d1f3d')
    this.cameras.main.fadeIn(300, 255, 255, 255)
    const g = this.add.graphics()
    g.fillStyle(0x3a2a4d).fillRect(0, 0, W, H)
    g.fillStyle(0x5b4570).fillRect(0, 0, W, 30)
    g.fillStyle(0xf594b5).fillRect(0, 28, W, 2)
    txt(this, W / 2, 5, 'TUMBUH KEMBANG MELODI', { color: '#fffaf0', stroke: '#3a2a4d' })
    this.info = txt(this, W / 2, 16, 'SERET BLOK KE MENARA, TUMBUH DARI BAWAH. TEKAN BLOK = DENGAR', { color: '#a8e8d3', stroke: '#3a2a4d' })
    exitButton(this, () => closeMini(this, null))

    this.placed = [false, false, false]
    this.clipH = null
    Audio.loadClips(GROW.map((b) => b.clip))
    this.events.once('shutdown', () => this.clipH?.stop())
    this.wrong = 0
    this.done = false
    // menara
    const sg = this.add.graphics()
    sg.fillStyle(0x6b5a8a).fillRect(20, TY0 + BH / 2 + 2, 176, 4)
    GROW.forEach((b, i) => {
      const y = TY0 - i * STEP
      sg.lineStyle(1, 0x8c76b8).strokeRect(TX - b.w / 2, y - BH / 2, b.w, BH)
      sg.fillStyle(0x4a3860).fillRect(TX - b.w / 2 + 1, y - BH / 2 + 1, b.w - 2, BH - 2)
      txt(this, 12, y - 4, String(i + 1), { color: '#c9b6f0', stroke: '#3a2a4d', align: 0 })
    })
    // blok acak di kolam kanan
    const order = [0, 1, 2]
    do { Phaser.Utils.Array.Shuffle(order) } while (order.every((v, i) => v === i))
    this.blocks = order.map((gi, pi) => {
      const b = GROW[gi]
      const home = { x: 300, y: 58 + pi * 40 }
      const c = this.add.container(home.x, home.y).setDepth(10)
      const bg = this.add.rectangle(0, 0, b.w, BH, 0xfffaf0).setStrokeStyle(2, 0x3a2a4d)
      const gr = this.add.graphics()
      gr.fillStyle(0xf594b5)
      const nw = (b.w - 8) / b.notes.length
      b.notes.forEach((n, k) => gr.fillRect(-b.w / 2 + 4 + k * nw, 8 - n * 2.2, Math.max(2, nw - 1), 2))
      const t = txt(this, 0, -12, b.name, { color: '#3a2a4d', stroke: '', depth: 1 }).setOrigin(0.5, 0)
      c.add([bg, gr, t]); c.setSize(b.w, BH)
      c.gi = gi; c.home = home; c.bg = bg
      bg.setInteractive({ draggable: true, useHandCursor: true })
      this.input.setDraggable(bg)
      bg.on('dragstart', () => { if (this.done || c.locked) return; c.setDepth(20); this.msg.setText(b.desc); this.hear(gi) })
      bg.on('drag', (p) => { if (this.done || c.locked) return; c.setPosition(p.x, p.y) })
      bg.on('dragend', () => { if (!this.done && !c.locked) this.drop(c) })
      return c
    })
    this.msg = txt(this, 14, 197, 'Mulailah dari ide musik yang paling kecil.', { color: '#fff7b8', stroke: '#3a2a4d', align: 0, depth: 6 })
  }

  // dengarkan satu blok (menghentikan yang sebelumnya)
  hear(gi) { this.clipH?.stop(); this.clipH = Audio.clip(GROW[gi].clip, { vol: 0.9 }) }

  drop(c) {
    // slot terdekat
    let best = -1, bd = 40
    for (let i = 0; i < 3; i++) { const d = Phaser.Math.Distance.Between(c.x, c.y, TX, TY0 - i * STEP); if (d < bd) { bd = d; best = i } }
    c.setDepth(10)
    if (best === c.gi && (best === 0 || this.placed[best - 1])) {
      c.locked = true; this.placed[best] = true
      this.tweens.add({ targets: c, x: TX, y: TY0 - best * STEP, duration: 150 })
      c.bg.setFillStyle(0xa8e8d3)
      Audio.ok(); this.hear(best)
      this.msg.setText(GROW[best].desc)
      if (this.placed.every(Boolean)) this.win()
    } else {
      if (best >= 0) {
        this.wrong += 1
        Audio.bad()
        this.msg.setText(best === c.gi ? 'Tumbuhlah bertahap: isi slot di bawahnya dulu.' : 'Belum pas: ukuran dan urutan blok menentukan tempatnya.')
      }
      this.tweens.add({ targets: c, x: c.home.x, y: c.home.y, duration: 220 })
    }
  }

  win() {
    this.done = true
    const score = Math.max(60, 100 - this.wrong * 15)
    this.info.setText('MELODIMU TUMBUH!')
    this.time.delayedCall(9800, () => closeMini(this, { score }))
  }
}
