import { GAME_W as W, GAME_H as H } from '../config.js'
import { Audio } from '../systems/Audio.js'
import { GENRE_ITEMS, GENRES } from '../data/genre.js'
import { txt, exitButton, closeMini } from '../ui/miniUi.js'

// MISI 3: Detektif DNA Genre. Seret instrumen ke karpet Pop (menengah, rileks) atau Rock (menghentak, agresif).
// Ketuk/seret instrumen untuk mendengar bunyinya: telinga, bukan rupa, yang menjadi petunjuk.
const CARPET = {
  pop: { x: 10, y: 56, w: 112, h: 118, fill: 0xffb9d1, edge: 0xc96890, inner: 0xffdce8 },
  rock: { x: 262, y: 56, w: 112, h: 118, fill: 0x7561ad, edge: 0x3a2a4d, inner: 0x9d86cf },
}
const SPOTS = [[150, 112], [192, 112], [234, 112], [150, 166], [192, 166], [234, 166]]

export class MiniGenreScene extends Phaser.Scene {
  constructor() { super('MiniGenre') }
  init(d) { this.parentKey = d.parent; this.practice = !!d.practice }

  create() {
    this.cameras.main.setBackgroundColor('#e2d4f7')
    this.cameras.main.fadeIn(300, 255, 255, 255)
    const g = this.add.graphics()
    for (let y = 44; y < H; y += 16) for (let x = 0; x < W; x += 16) { g.fillStyle(((x + y) / 16) % 2 ? 0xfffaf0 : 0xe2d4f7).fillRect(x, y, 16, 16) }
    g.fillStyle(0x9d86cf).fillRect(0, 0, W, 44)
    g.fillStyle(0xf594b5).fillRect(0, 42, W, 2)
    for (const k of ['pop', 'rock']) {
      const c = CARPET[k]
      g.fillStyle(c.edge).fillRect(c.x - 3, c.y - 3, c.w + 6, c.h + 6)
      g.fillStyle(c.fill).fillRect(c.x, c.y, c.w, c.h)
      g.fillStyle(c.inner).fillRect(c.x + 5, c.y + 5, c.w - 10, c.h - 10)
      txt(this, c.x + c.w / 2, c.y + 8, GENRES[k].label, { size: 16, color: k === 'pop' ? '#c96890' : '#fffaf0', stroke: k === 'pop' ? '#fffaf0' : '#3a2a4d' })
      txt(this, c.x + c.w / 2, c.y + 30, GENRES[k].sub.toUpperCase(), { size: 8, color: k === 'pop' ? '#c96890' : '#fffaf0', stroke: null })
    }
    txt(this, W / 2, 6, 'DETEKTIF DNA GENRE', { color: '#fffaf0', stroke: '#3a2a4d' })
    this.info = txt(this, W / 2, 20, 'KETUK = DENGAR · SERET KE KARPET YANG TEPAT', { color: '#fffaf0', stroke: '#3a2a4d' })
    this.msg = txt(this, W / 2, H - 28, '', { color: '#7561ad' })
    this.count = txt(this, 8, 6, '0 / 6', { align: 0, color: '#ffd467', stroke: '#3a2a4d' })
    exitButton(this, () => closeMini(this, null))

    this.errors = 0
    this.placed = { pop: 0, rock: 0 }
    this.total = 0
    this.locked = false
    const order = Phaser.Utils.Array.Shuffle([...GENRE_ITEMS])
    const spots = Phaser.Utils.Array.Shuffle([...SPOTS])
    this.sprites = order.map((it, i) => this.makeItem(it, spots[i][0], spots[i][1]))
    this.input.dragDistanceThreshold = 3
  }

  makeItem(it, x, y) {
    const s = this.add.image(x, y, it.key).setOrigin(0.5, 1).setScale(it.scale).setDepth(5)
    s.setInteractive({ draggable: true, useHandCursor: true })
    this.input.setDraggable(s)
    s.home = { x, y }
    s.on('pointerdown', () => { if (!this.locked) Audio.play(it.sound) })
    s.on('dragstart', () => { s.setDepth(30); this.msg.setText(it.name.toUpperCase()) })
    s.on('drag', (_p, dx, dy) => { s.setPosition(dx, dy) })
    s.on('dragend', () => this.drop(s, it))
    return s
  }

  zoneAt(x, y) {
    for (const k of ['pop', 'rock']) {
      const c = CARPET[k]
      if (x > c.x && x < c.x + c.w && y > c.y && y < c.y + c.h + 10) return k
    }
    return null
  }

  drop(s, it) {
    const zone = this.zoneAt(s.x, s.y - 6)
    if (!zone) { this.back(s); return }
    if (zone === it.genre) {
      const c = CARPET[zone], n = this.placed[zone]++
      const tx = c.x + 22 + n * 34, ty = c.y + c.h - 10
      s.disableInteractive()
      this.tweens.add({ targets: s, x: tx, y: ty, duration: 160, ease: 'Back.easeOut' })
      s.setDepth(10)
      Audio.ok()
      this.total += 1
      this.count.setText(`${this.total} / 6`)
      this.msg.setText(it.ket)
      if (this.total >= 6) this.win()
    } else {
      this.errors += 1
      Audio.bad()
      this.cameras.main.shake(140, 0.003)
      this.msg.setText(it.genre === 'rock' ? 'Dengar lagi: terlalu keras & menghentak untuk karpet itu.' : 'Dengar lagi: terlalu lembut & rileks untuk karpet itu.')
      this.back(s)
    }
  }

  back(s) { this.tweens.add({ targets: s, x: s.home.x, y: s.home.y, duration: 220, ease: 'Cubic.easeOut', onComplete: () => s.setDepth(5) }) }

  win() {
    this.locked = true
    this.score = Math.max(50, 100 - this.errors * 10)
    this.info.setText('SEMUA INSTRUMEN SUDAH PULANG!')
    Audio.win()
    this.time.delayedCall(2200, () => closeMini(this, { score: this.score }))
  }
}
