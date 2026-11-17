import { GAME_W as W, GAME_H as H } from '../config.js'
import { Audio } from '../systems/Audio.js'
import { STAGE_ITEMS } from '../data/aula.js'
import { txt, exitButton, closeMini } from '../ui/miniUi.js'

// MISI 10: Manajemen Pagelaran Agung. Seret instrumen: akustik ke mikrofon, listrik/digital dikabel ke amplifier.
const MIC = { x: 96, y: 68 }, AMP = { x: 288, y: 68 }
const slotOf = (t, k) => ({ x: (t === 'mic' ? MIC.x : AMP.x) - 44 + k * 44, y: 112 })

export class MiniStageScene extends Phaser.Scene {
  constructor() { super('MiniStage') }
  init(d) { this.parentKey = d.parent; this.practice = !!d.practice }

  create() {
    this.cameras.main.setBackgroundColor('#2d1f3d')
    this.cameras.main.fadeIn(300, 255, 255, 255)
    const g = this.add.graphics()
    g.fillStyle(0x3a2a4d).fillRect(0, 0, W, H)
    g.fillStyle(0x5b4570).fillRect(0, 0, W, 30)
    g.fillStyle(0xf594b5).fillRect(0, 28, W, 2)
    g.fillStyle(0x4a3860).fillRect(0, 128, W, 88)
    txt(this, W / 2, 5, 'MANAJEMEN PAGELARAN AGUNG', { color: '#fffaf0', stroke: '#3a2a4d' })
    this.info = txt(this, W / 2, 16, 'AKUSTIK KE MIKROFON, LISTRIK/DIGITAL KE AMPLIFIER', { color: '#a8e8d3', stroke: '#3a2a4d' })
    exitButton(this, () => closeMini(this, null))

    this.add.image(MIC.x, MIC.y, 'mic_stand').setScale(3).setDepth(1)
    this.add.image(AMP.x, MIC.y, 'amp').setScale(3).setDepth(1)
    txt(this, MIC.x, 100 - 56, 'MIKROFON', { color: '#fff7b8', stroke: '#3a2a4d' })
    txt(this, AMP.x, 100 - 56, 'AMPLIFIER', { color: '#fff7b8', stroke: '#3a2a4d' })
    const zones = this.add.graphics()
    zones.lineStyle(1, 0x8c76b8)
    for (const t of ['mic', 'amp']) for (let k = 0; k < 3; k++) { const p = slotOf(t, k); zones.strokeRect(p.x - 18, p.y - 18, 36, 36) }
    this.cable = this.add.graphics().setDepth(2)

    this.count = { mic: 0, amp: 0 }
    this.cables = []
    this.wrong = 0
    this.done = false
    this.elapsed = 0
    const order = STAGE_ITEMS.map((_, i) => i)
    Phaser.Utils.Array.Shuffle(order)
    this.items = order.map((ii, pi) => {
      const def = STAGE_ITEMS[ii]
      const home = { x: 40 + pi * 61, y: 158 }
      const img = this.add.image(home.x, home.y, def.key)
      const s = Math.min(2.4, 36 / img.height, 52 / img.width)
      img.setScale(s).setDepth(10).setInteractive({ draggable: true, useHandCursor: true })
      img.def = def; img.home = home; img.s = s
      this.input.setDraggable(img)
      const label = txt(this, home.x, 178, def.name.toUpperCase().replace(' ', '\n'), { color: '#fffaf0', stroke: '#3a2a4d', depth: 5 })
      img.label = label
      img.on('dragstart', () => { if (!img.locked && !this.done) { img.setDepth(20); Audio.click() } })
      img.on('drag', (p) => { if (!img.locked && !this.done) img.setPosition(p.x, p.y) })
      img.on('dragend', () => { if (!img.locked && !this.done) this.drop(img) })
      return img
    })
    this.msg = txt(this, 14, 200, 'Bunyi langsung, atau lewat listrik?', { color: '#fff7b8', stroke: '#3a2a4d', align: 0, depth: 6 })
    this.sparks = this.add.graphics().setDepth(3)
  }

  drop(img) {
    const dm = Phaser.Math.Distance.Between(img.x, img.y, MIC.x, MIC.y), da = Phaser.Math.Distance.Between(img.x, img.y, AMP.x, MIC.y)
    img.setDepth(10)
    const target = dm < 60 ? 'mic' : da < 60 ? 'amp' : null
    if (!target) { this.back(img); return }
    const right = (img.def.ac && target === 'mic') || (!img.def.ac && target === 'amp')
    if (!right) {
      this.wrong += 1
      Audio.bad()
      this.msg.setText(img.def.ac ? `${img.def.name}: bunyi langsung, cukup mikrofon.` : `${img.def.name}: sinyal listrik, pakai kabel ke amp.`)
      this.back(img); return
    }
    const p = slotOf(target, this.count[target]++)
    img.locked = true
    this.tweens.add({ targets: img, x: p.x, y: p.y, duration: 160 })
    img.label.setVisible(false)
    Audio.ok()
    if (target === 'amp') this.cables.push({ img, p })
    this.msg.setText(target === 'mic' ? `${img.def.name}: ditangkap mikrofon.` : `${img.def.name}: kabel tersambung ke amp.`)
    if (this.items.every((i) => i.locked)) this.win()
  }

  back(img) { this.tweens.add({ targets: img, x: img.home.x, y: img.home.y, duration: 220 }) }

  win() {
    this.done = true
    const score = Math.max(60, 100 - this.wrong * 10 - Math.max(0, Math.floor((this.elapsed - 90) / 30)) * 5)
    this.info.setText('PANGGUNG SIAP! TIRAI TERBUKA!')
    this.msg.setText('Semua instrumen pada tempatnya.')
    ;[392, 523.3, 659.3, 784].forEach((f, i) => Audio.note(f, 0.5, 'triangle', 0.28, i * 0.12))
    this.time.delayedCall(2400, () => closeMini(this, { score }))
  }

  update(_, delta) {
    if (!this.done) this.elapsed += Math.min(delta, 50) / 1000
    const c = this.cable
    c.clear()
    c.lineStyle(2, 0xffd467)
    for (const { img } of this.cables) {
      c.beginPath(); c.moveTo(img.x, img.y - 6)
      const sx = AMP.x, sy = MIC.y + 26
      c.lineTo(img.x, img.y - 24); c.lineTo(sx, img.y - 24); c.lineTo(sx, sy)
      c.strokePath()
      c.fillStyle(0xffd467).fillRect(img.x - 2, img.y - 8, 4, 4)
    }
  }
}
