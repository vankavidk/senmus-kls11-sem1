import { GAME_W as W, GAME_H as H } from '../config.js'
import { Audio } from '../systems/Audio.js'
import { LYRIC } from '../data/taman.js'
import { txt, exitButton, closeMini } from '../ui/miniUi.js'

// MISI 8: Merangkai Jalur Pujangga. Susun 8 kata yang sudah dikumpulkan menjadi baris syair yang utuh.
const CW = 84, CH = 22, GAP = 6
const X0 = (W - (4 * CW + 3 * GAP)) / 2
const slotPos = (i) => ({ x: X0 + (i % 4) * (CW + GAP) + CW / 2, y: 62 + Math.floor(i / 4) * (CH + 10) + CH / 2 })
const poolPos = (i) => ({ x: X0 + (i % 4) * (CW + GAP) + CW / 2, y: 138 + Math.floor(i / 4) * (CH + 8) + CH / 2 })

export class MiniLyricScene extends Phaser.Scene {
  constructor() { super('MiniLyric') }
  init(d) { this.parentKey = d.parent; this.practice = !!d.practice }

  create() {
    this.cameras.main.setBackgroundColor('#2d1f3d')
    this.cameras.main.fadeIn(300, 255, 255, 255)
    const g = this.add.graphics()
    g.fillStyle(0x3a2a4d).fillRect(0, 0, W, H)
    g.fillStyle(0x5b4570).fillRect(0, 0, W, 30)
    g.fillStyle(0xf594b5).fillRect(0, 28, W, 2)
    txt(this, W / 2, 5, 'MERANGKAI JALUR PUJANGGA', { color: '#fffaf0', stroke: '#3a2a4d' })
    this.info = txt(this, W / 2, 16, 'KETUK KATA UNTUK MENYUSUN SYAIR (KETUK LAGI UNTUK MELEPAS)', { color: '#a8e8d3', stroke: '#3a2a4d' })
    exitButton(this, () => closeMini(this, null))
    txt(this, W / 2, 36, `"${LYRIC.clue}"`, { color: '#fff7b8', stroke: '#3a2a4d' })

    this.slots = Array(8).fill(-1)
    this.locked = Array(8).fill(false)
    this.wrong = 0
    this.done = false
    this.busy = false
    const sg = this.add.graphics()
    for (let i = 0; i < 8; i++) { const p = slotPos(i); sg.lineStyle(1, 0x8c76b8).strokeRect(p.x - CW / 2, p.y - CH / 2, CW, CH); sg.fillStyle(0x4a3860).fillRect(p.x - CW / 2 + 1, p.y - CH / 2 + 1, CW - 2, CH - 2) }
    txt(this, W / 2, 120, 'KATA YANG TERKUMPUL', { color: '#c9b6f0', stroke: '#3a2a4d' })

    // acak urutan kata di kolam
    const order = LYRIC.words.map((_, i) => i)
    do { Phaser.Utils.Array.Shuffle(order) } while (order.every((v, i) => v === i))
    this.chips = order.map((wi, pi) => {
      const p = poolPos(pi)
      const bg = this.add.rectangle(0, 0, CW - 2, CH - 2, 0xfffaf0).setStrokeStyle(2, 0x3a2a4d)
      const t = txt(this, 0, -4, LYRIC.words[wi], { color: '#3a2a4d', stroke: '', depth: 1 }).setOrigin(0.5, 0)
      const c = this.add.container(p.x, p.y, [bg, t]).setDepth(10)
      c.wi = wi; c.slot = -1; c.pool = pi; c.bg = bg
      bg.setInteractive({ useHandCursor: true })
      bg.on('pointerdown', () => this.tap(c))
      return c
    })
    this.msg = txt(this, 14, 197, 'Susun dari kiri ke kanan, baris atas dulu.', { color: '#fff7b8', stroke: '#3a2a4d', align: 0, depth: 6 })
  }

  place(c, p) { this.tweens.add({ targets: c, x: p.x, y: p.y, duration: 140 }) }

  tap(c) {
    if (this.done || this.busy || (c.slot >= 0 && this.locked[c.slot])) return
    Audio.click()
    if (c.slot >= 0) { this.slots[c.slot] = -1; c.slot = -1; this.place(c, poolPos(c.pool)); return }
    const i = this.slots.indexOf(-1)
    if (i < 0) return
    this.slots[i] = c.wi; c.slot = i
    this.place(c, slotPos(i))
    Audio.note(260 + i * 40, 0.15, 'triangle', 0.2)
    if (this.slots.every((v) => v >= 0)) this.time.delayedCall(250, () => this.check())
  }

  check() {
    const bad = this.slots.map((wi, i) => wi !== i)
    this.chips.forEach((c) => {
      if (c.slot < 0) return
      if (!bad[c.slot]) { this.locked[c.slot] = true; c.bg.setFillStyle(0xa8e8d3) } else c.bg.setFillStyle(0xf9a3b4)
    })
    if (bad.every((b) => !b)) return this.win()
    this.wrong += 1
    this.busy = true
    Audio.bad()
    this.msg.setText('Belum pada jalurnya. Awal, tumbuh, tuntas.')
    this.time.delayedCall(900, () => {
      this.chips.forEach((c) => { if (c.slot >= 0 && !this.locked[c.slot]) { this.slots[c.slot] = -1; c.slot = -1; c.bg.setFillStyle(0xfffaf0); this.place(c, poolPos(c.pool)) } })
      this.busy = false
    })
  }

  win() {
    this.done = true
    const score = Math.max(60, 100 - this.wrong * 10)
    this.info.setText('SYAIR UTUH!')
    this.msg.setText(LYRIC.words.join(' ') + '.')
    ;[0, 2, 4, 5, 7].forEach((n, i) => Audio.note([261.6, 329.6, 392, 440, 523.3][i], 0.4, 'triangle', 0.25, i * 0.12))
    this.time.delayedCall(2400, () => closeMini(this, { score }))
  }
}
