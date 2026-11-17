import { GAME_W as W, GAME_H as H } from '../config.js'
import { Audio } from '../systems/Audio.js'
import { Storage } from '../systems/Storage.js'
import { SHOW_CATS, TAGS, judge } from '../data/show.js'
import { txt, exitButton, closeMini } from '../ui/miniUi.js'

// MISI 11: Pagelaran Impian. Pilih panggung, musik, penampilan, dan lirik, lalu tampilkan.
const SW = 236, SH = 112                       // ukuran pratinjau panggung
const SX = 8, SY = 30
const PX = 252, RY = 30, RS = 29               // panel pilihan di kanan
const FLOOR = 100                              // garis kaki penampil (koordinat panggung)

export class MiniShowScene extends Phaser.Scene {
  constructor() { super('MiniShow') }
  init(d) { this.parentKey = d.parent; this.practice = !!d.practice }

  create() {
    this.cameras.main.setBackgroundColor('#2d1f3d')
    this.cameras.main.fadeIn(300, 255, 255, 255)
    const g = this.add.graphics()
    g.fillStyle(0x3a2a4d).fillRect(0, 0, W, H)
    g.fillStyle(0x7561ad).fillRect(0, 0, W, 26)
    g.fillStyle(0xf594b5).fillRect(0, 24, W, 2)
    txt(this, W / 2, 4, 'PAGELARAN IMPIAN', { color: '#fffaf0', stroke: '#3a2a4d' })
    this.info = txt(this, W / 2, 14, 'RANCANG PAGELARANMU DENGAN PANAH < >, LALU TAMPILKAN', { color: '#fffaf0', stroke: '#3a2a4d' })
    this.ui = this.add.container(0, 0)
    this.exitBtn = exitButton(this, () => this.leave(null))

    this.choice = SHOW_CATS.map((c) => Phaser.Math.Between(0, c.opts.length - 1))
    this.phase = 'design'
    this.clipH = null
    this.performers = []
    this.tweenList = []

    // pratinjau panggung (container agar bisa diperbesar saat tampil)
    this.stageC = this.add.container(SX, SY).setDepth(2)
    this.bg = this.add.graphics()
    this.lights = this.add.graphics()
    this.stageC.add([this.bg, this.lights])
    this.maskG = this.make.graphics().fillRect(SX, SY, SW, SH)
    this.frame = this.add.graphics().setDepth(3)
    this.frame.lineStyle(2, 0x3a2a4d).strokeRect(SX - 1, SY - 1, SW + 2, SH + 2)

    this.rows = SHOW_CATS.map((c, i) => this.makeRow(c, i))
    this.desc = txt(this, 8, 148, '', { color: '#fff7b8', stroke: '#3a2a4d', align: 0, depth: 6 })
    this.desc.setWordWrapWidth(W - 16)
    this.btnHear = this.button(70, 201, 116, 'DENGAR MUSIK', 0x7561ad, () => this.toggleHear())
    this.btnShow = this.button(296, 201, 144, 'TAMPILKAN!', 0xc96890, () => this.startShow())
    this.ui.add([this.desc, ...this.rows.flatMap((r) => r.objs), this.btnHear.r, this.btnHear.t, this.btnShow.r, this.btnShow.t])

    Audio.loadClips(SHOW_CATS[1].opts.map((o) => o.clip))
    this.drawStage(); this.buildPerformers()
    this.rows.forEach((_, i) => this.refreshRow(i))
    this.desc.setText('Pilih tiap unsur. Titik warna menunjukkan nuansanya: semakin senada, semakin padu konsepmu.')
    this.events.once('shutdown', () => { this.clipH?.stop(); this.tweenList.forEach((t) => t.remove()) })
  }

  button(cx, cy, w, label, color, onClick) {
    const r = this.add.rectangle(cx, cy, w, 18, color).setStrokeStyle(2, 0x3a2a4d).setDepth(5).setInteractive({ useHandCursor: true })
    const t = txt(this, cx, cy - 5, label, { color: '#fffaf0', stroke: '#3a2a4d', depth: 6 })
    const b = { r, t }
    r.on('pointerdown', () => { if (this.phase === 'design') { Audio.click(); onClick() } })
    return b
  }

  makeRow(cat, i) {
    const y = RY + i * RS
    const objs = []
    objs.push(txt(this, PX, y, cat.label, { color: '#ffd467', stroke: '#3a2a4d', align: 0, depth: 4 }))
    const arrow = (x, dir) => {
      const r = this.add.rectangle(x + 6, y + 18, 12, 16, 0xfffaf0).setStrokeStyle(2, 0x3a2a4d).setDepth(4).setInteractive({ useHandCursor: true })
      const gr = this.add.graphics().setDepth(5).fillStyle(0x7561ad)
      if (dir < 0) gr.fillTriangle(x + 8, y + 12, x + 8, y + 24, x + 3, y + 18)
      else gr.fillTriangle(x + 4, y + 12, x + 4, y + 24, x + 9, y + 18)
      r.on('pointerdown', () => { if (this.phase === 'design') this.step(i, dir) })
      r.on('pointerover', () => r.setFillStyle(0xe2d4f7)); r.on('pointerout', () => r.setFillStyle(0xfffaf0))
      objs.push(r, gr)
    }
    arrow(PX, -1); arrow(PX + 112, 1)
    const box = this.add.rectangle(PX + 14 + 48, y + 18, 96, 16, 0xfffaf0).setStrokeStyle(2, 0x3a2a4d).setDepth(4)
    const dot = this.add.rectangle(PX + 14 + 90, y + 18, 6, 6, 0xffffff).setDepth(5)
    const name = txt(this, PX + 18, y + 14, '', { color: '#3a2a4d', stroke: null, align: 0, depth: 5 })
    objs.push(box, dot, name)
    return { y, box, dot, name, objs }
  }

  refreshRow(i) {
    const r = this.rows[i], o = SHOW_CATS[i].opts[this.choice[i]]
    r.name.setText(o.name.toUpperCase()).setScale(1)
    if (r.name.width > 68) r.name.setScale(68 / r.name.width)
    r.dot.setFillStyle(TAGS[o.tag].color)
    r.box.setFillStyle(0xfffaf0)
  }

  step(i, dir) {
    const n = SHOW_CATS[i].opts.length
    this.choice[i] = (this.choice[i] + dir + n) % n
    this.refreshRow(i)
    Audio.sfx('interact')
    const o = SHOW_CATS[i].opts[this.choice[i]]
    this.desc.setText(i === 3 ? `${o.ket}\n"${o.lines[0]} ${o.lines[1]}"` : o.ket)
    if (i === 0) this.drawStage()
    if (i === 2) this.buildPerformers()
    if (i === 1 && this.clipH) this.playPreview()   // ganti musik saat sedang didengarkan
  }

  // ---------- musik ----------
  playPreview() {
    this.clipH?.stop()
    this.clipH = Audio.clip(SHOW_CATS[1].opts[this.choice[1]].clip, { loop: true, vol: 0.9 })
    this.btnHear.t.setText('HENTIKAN')
  }
  toggleHear() {
    if (this.clipH) { this.clipH.stop(); this.clipH = null; this.btnHear.t.setText('DENGAR MUSIK'); return }
    this.playPreview()
  }

  // ---------- panggung ----------
  drawStage() {
    const g = this.bg
    g.clear()
    const id = SHOW_CATS[0].opts[this.choice[0]].id
    const R = (c, x, y, w, h, a = 1) => g.fillStyle(c, a).fillRect(x, y, w, h)
    if (id === 'taman') {
      R(0xf6a9c1, 0, 0, SW, 22); R(0xf9c9b6, 0, 22, SW, 20); R(0xffe0b0, 0, 42, SW, 22)
      g.fillStyle(0xfff3b0).fillCircle(188, 30, 12)
      R(0x8fc99a, 0, 62, SW, 22); g.fillStyle(0x7ab88a).fillCircle(40, 64, 30).fillCircle(190, 66, 36)
      R(0x6fbf73, 0, 84, SW, SH - 84)
      for (const [x, s] of [[16, 1], [214, 1.1]]) { R(0x7a5a46, x - 2, 56, 4, 32); g.fillStyle(0x4e9a64).fillCircle(x, 50, 14 * s).fillCircle(x - 8, 58, 9).fillCircle(x + 8, 58, 9) }
      R(0xb98b5e, 36, 88, 164, 14); R(0x9a7048, 36, 100, 164, 3)
      for (let k = 0; k < 12; k++) { const x = 8 + k * 20, y = 6 + Math.sin(k / 11 * Math.PI) * 10; g.fillStyle(0xffe27a).fillCircle(x, y + 6, 2) }
    } else if (id === 'aula') {
      R(0x4a2038, 0, 0, SW, SH)
      R(0x6a2c4c, 40, 12, 156, 74)
      R(0xa57248, 0, 86, SW, SH - 86); for (let k = 0; k < 8; k++) R(0x8a5c38, 0, 88 + k * 3, SW, 1)
      for (const [x0, dir] of [[0, 1], [SW - 46, 1]]) { R(0x9d2f4f, x0, 0, 46, 92); for (let k = 0; k < 6; k++) R(0x7c2340, x0 + 4 + k * 7, 0, 2, 92) }
      R(0xc94f6e, 0, 0, SW, 12); R(0xe0b25a, 0, 12, SW, 2)
      g.fillStyle(0xe0b25a).fillRect(117, 10, 2, 8)
      for (let k = -2; k <= 2; k++) { g.fillStyle(0xfff3b0).fillCircle(118 + k * 8, 24 - Math.abs(k), 2) }
      R(0xe0b25a, 108, 20, 20, 1)
    } else if (id === 'pendopo') {
      R(0xd8b27a, 0, 18, SW, 70)
      for (let y = 22; y < 84; y += 10) for (let x = (y / 10) % 2 ? 6 : 0; x + 12 <= SW; x += 12) { g.fillStyle(0xb78852).fillTriangle(x + 6, y, x + 12, y + 5, x + 6, y + 10).fillTriangle(x + 6, y, x, y + 5, x + 6, y + 10) }
      g.fillStyle(0x6b3f2a).fillTriangle(0, 18, SW, 18, SW - 14, 0).fillTriangle(0, 18, 14, 0, SW - 14, 0)
      R(0xe0b25a, 0, 17, SW, 3)
      for (const x of [30, 82, 150, 202]) { R(0x8a5a3b, x, 20, 6, 70); R(0x6b3f2a, x - 1, 86, 8, 4) }
      R(0xb98b5e, 0, 88, SW, SH - 88); R(0x8a3b3b, 50, 92, 136, 16); for (let x = 54; x < 184; x += 12) { g.fillStyle(0xe0b25a).fillTriangle(x, 100, x + 6, 95, x + 12, 100).fillTriangle(x, 100, x + 6, 105, x + 12, 100) }
      for (const x of [60, 118, 176]) { R(0x6b3f2a, x, 20, 1, 8); g.fillStyle(0xffd467).fillCircle(x, 31, 4); g.fillStyle(0xfff3b0).fillCircle(x, 30, 2) }
    } else {
      R(0x1d1535, 0, 0, SW, SH)
      R(0x2a1f4d, 28, 10, 180, 62); g.lineStyle(1, 0x3fb8c9, 0.7)
      for (let x = 28; x <= 208; x += 12) g.lineBetween(x, 10, x, 72)
      g.lineStyle(1, 0xff4fd8, 0.6); for (let y = 10; y <= 72; y += 12) g.lineBetween(28, y, 208, y)
      R(0x8d8aa8, 0, 3, SW, 3)
      R(0x2b2150, 0, 86, SW, SH - 86); R(0xff4fd8, 0, 86, SW, 2); R(0x3fb8c9, 0, 90, SW, 1)
      for (let k = 0; k < 9; k++) { g.fillStyle(k % 2 ? 0xff4fd8 : 0x3fb8c9).fillCircle(14 + k * 26, 9, 2) }
    }
  }

  // ---------- penampil ----------
  buildPerformers() {
    this.performers.forEach((p) => p.destroy()); this.performers = []
    this.tweenList.forEach((t) => t.remove()); this.tweenList = []
    const id = SHOW_CATS[2].opts[this.choice[2]].id
    const prof = Storage.getProfile() || {}
    const add = (key, x, y, sc = 2, frame, bob = true) => {
      const s = this.add.image(x, y, key, frame).setOrigin(0.5, 1).setScale(sc).setDepth(y)
      this.stageC.add(s); this.performers.push(s)
      if (bob) this.tweenList.push(this.tweens.add({ targets: s, y: y - 1.5, yoyo: true, repeat: -1, duration: 280 + (this.performers.length % 3) * 40, delay: this.performers.length * 70, paused: true }))
      return s
    }
    const me = () => add(`walk_${prof.avatar || 'putra_1'}`, id === 'duet' ? 100 : id === 'ansambel' ? 150 : 118, FLOOR, 2, 0)
    if (id === 'solo') { add('mic_stand', 100, FLOOR, 2, undefined, false); me() }
    else if (id === 'duet') { me(); add('npc_pujangga', 138, FLOOR, 2); add('ukulele', 150, FLOOR - 2, 1.5, undefined, false) }
    else if (id === 'band') {
      add('drum_kit', 118, FLOOR - 18, 1.6, undefined, false)
      add('npc_virtuoso', 56, FLOOR, 2); add('synth', 76, FLOOR - 2, 1.6, undefined, false)
      add('npc_detektif_nada', 186, FLOOR, 2); add('gitar_elektrik', 168, FLOOR, 1.4, undefined, false)
      me()
    } else {
      add('gong', 34, FLOOR, 1.6, undefined, false); add('gender', 78, FLOOR, 1.6, undefined, false)
      add('npc_maestro_minang', 110, FLOOR, 2); add('kenong', 196, FLOOR, 1.6, undefined, false)
      me()
    }
    this.stageC.sort('depth')
  }

  // ---------- tampil ----------
  startShow() {
    this.clipH?.stop(); this.clipH = null
    this.phase = 'show'
    const music = SHOW_CATS[1].opts[this.choice[1]], lyric = SHOW_CATS[3].opts[this.choice[3]]
    this.ui.setVisible(false); this.rows.forEach((r) => r.objs.forEach((o) => o.setVisible(false)))
    this.desc.setVisible(false)
    this.info.setText('PAGELARANMU DIMULAI...')
    // perbesar panggung
    this.tweens.add({ targets: this.stageC, x: 15, y: 26, scale: 1.5, duration: 600, ease: 'Cubic.easeInOut' })
    this.frame.setVisible(false)
    this.tweenList.forEach((t) => t.resume())
    // penonton
    this.crowd = this.add.graphics(); this.stageC.add(this.crowd)
    this.band = this.add.rectangle(W / 2, 198, W, 38, 0x3a2a4d, 0.78).setDepth(10)
    this.line = txt(this, W / 2, 190, '', { color: '#fffaf0', stroke: '#3a2a4d', depth: 11 })
    this.line.setWordWrapWidth(W - 24)
    this.dur = music.dur
    this.t0 = this.time.now
    this.curLine = -1
    this.lyricLines = lyric.lines
    this.clipH = Audio.clip(music.clip, { vol: 0.95, onend: () => this.endShow() })
    this.time.delayedCall((music.dur + 1.5) * 1000, () => this.endShow())
    this.time.addEvent({ delay: 380, loop: true, callback: () => this.spark() })
  }

  spark() {
    if (this.phase !== 'show' && this.phase !== 'end') return
    const s = this.add.image(Phaser.Math.Between(10, SW - 10), SH - 6, 'star_note').setScale(1.4).setDepth(60).setTint(Phaser.Utils.Array.GetRandom([0xff9ec7, 0xffd467, 0xa8e8d3]))
    this.stageC.add(s)
    this.tweens.add({ targets: s, y: SH - 40 - Math.random() * 30, alpha: 0, duration: 1200, onComplete: () => s.destroy() })
  }

  endShow() {
    if (this.phase !== 'show') return
    this.phase = 'end'
    this.clipH?.stop(); this.clipH = null
    Audio.applause(3.2)
    const res = judge(this.choice)
    this.result = res
    this.line.setText('')
    this.info.setText(res.title + '!')
    const panel = this.add.rectangle(W / 2, 106, 300, 134, 0x3a2a4d, 0.95).setStrokeStyle(2, 0xf594b5).setDepth(40)
    const tags = SHOW_CATS.map((c, i) => c.opts[this.choice[i]])
    txt(this, W / 2, 48, res.title, { color: '#ffd467', stroke: '#3a2a4d', depth: 41 })
    txt(this, W / 2, 64, tags.map((o) => o.name).join(' · '), { color: '#a8e8d3', stroke: null, depth: 41 }).setWordWrapWidth(280)
    txt(this, W / 2, 86, res.text, { color: '#fffaf0', stroke: null, depth: 41 }).setWordWrapWidth(280)
    txt(this, W / 2, 128, `SKOR ${res.score}`, { color: '#fff7b8', stroke: '#3a2a4d', depth: 41 })
    txt(this, W / 2, 146, 'KETUK UNTUK SELESAI', { color: '#c9b6f0', stroke: null, depth: 41 })
    panel.setInteractive()
    this.time.delayedCall(1200, () => panel.once('pointerdown', () => closeMini(this, { score: res.score })))
    this.input.keyboard?.once('keydown-ENTER', () => closeMini(this, { score: res.score }))
    Audio.sfx('fanfare')
  }

  leave(r) { this.clipH?.stop(); closeMini(this, r) }

  update(time) {
    const L = this.lights
    L.clear()
    const id = SHOW_CATS[0].opts[this.choice[0]].id
    const t = time / 1000, show = this.phase !== 'design'
    const col = { pendopo: 0xffd467, neon: 0xff4fd8, aula: 0xfff3b0, taman: 0xfff3b0 }[id]
    const sweep = Math.sin(t * (show ? 1.6 : 0.6))
    for (const [x0, k] of [[70, 1], [118, 0], [166, -1]]) {
      const cx = 118 + (x0 - 118) * 0.2 + sweep * 28 * (k || 0.6)
      L.fillStyle(col, show ? 0.16 : 0.09).fillTriangle(x0, 0, cx - 22, FLOOR + 6, cx + 22, FLOOR + 6)
    }
    if (id === 'neon' && show) { for (let k = 0; k < 9; k++) { L.fillStyle(k % 2 ? 0xff4fd8 : 0x3fb8c9, 0.5 + 0.5 * Math.sin(t * 5 + k)).fillCircle(14 + k * 26, 9, 2.5) } }
    if (this.phase === 'show') {
      const el = (this.time.now - this.t0) / 1000
      const idx = Math.min(3, Math.floor(el / (this.dur / 4)))
      if (idx !== this.curLine) { this.curLine = idx; this.lineStart = el; this.full = this.lyricLines[idx] }
      const typed = Math.min(this.full.length, Math.floor((el - this.lineStart) * 16))
      this.line.setText(this.full.slice(0, typed))
      // penonton bergoyang
      const c = this.crowd; c.clear()
      for (let k = 0; k < 18; k++) { const x = 6 + k * 13, y = SH - 3 + Math.sin(t * 3 + k) * 1.2; c.fillStyle(0x2a1f3d).fillCircle(x, y, 5).fillRect(x - 5, y, 10, 6) }
    }
  }
}
