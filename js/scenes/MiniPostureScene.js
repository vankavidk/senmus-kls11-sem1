import { GAME_W as W, GAME_H as H } from '../config.js'
import { Audio } from '../systems/Audio.js'
import { JOINTS } from '../data/kibor.js'
import { txt, exitButton, closeMini } from '../ui/miniUi.js'

// MISI 6: Postur Sang Maestro. Avatar duduk dengan postur buruk; klik sendi yang perlu diatur (4 dari 6).
const HIP = { x: 100, y: 168 }
const W0 = { x: 156, y: 146 } // pergelangan di atas tuts
const lerp = (a, b, t) => a + (b - a) * t
const pt = (x, y) => ({ x, y })

export class MiniPostureScene extends Phaser.Scene {
  constructor() { super('MiniPosture') }
  init(d) { this.parentKey = d.parent; this.practice = !!d.practice }

  create() {
    this.cameras.main.setBackgroundColor('#2d1f3d')
    this.cameras.main.fadeIn(300, 255, 255, 255)
    const g = this.add.graphics()
    g.fillStyle(0x3a2a4d).fillRect(0, 0, W, H)
    g.fillStyle(0x5b4570).fillRect(0, 0, W, 30)
    g.fillStyle(0xf594b5).fillRect(0, 28, W, 2)
    txt(this, W / 2, 5, 'POSTUR SANG MAESTRO', { color: '#fffaf0', stroke: '#3a2a4d' })
    this.info = txt(this, W / 2, 16, 'KLIK SENDI YANG PERLU DIATUR (4 DARI 6)', { color: '#a8e8d3', stroke: '#3a2a4d' })
    exitButton(this, () => closeMini(this, null))
    this.gfx = this.add.graphics().setDepth(2)
    this.msg = txt(this, 14, 197, 'Amati avatar: mana yang tegang?', { color: '#fff7b8', stroke: '#3a2a4d', align: 0, depth: 6 })
    this.count = txt(this, W - 14, 38, '0/4', { color: '#ffd467', stroke: '#3a2a4d', align: 1, depth: 6 })

    this.fixed = {}      // id -> true
    this.pose = { bahu: 0, siku: 0, tangan: 0, punggung: 0 }
    this.wrong = 0
    this.done = false
    this.t = 0
    this.dots = JOINTS.map((j) => {
      const c = this.add.circle(0, 0, 8, 0xffd467, 0.001).setDepth(5).setInteractive({ useHandCursor: true })
      c.on('pointerdown', () => this.pick(j))
      return c
    })
    this.labels = JOINTS.map((j) => txt(this, 0, 0, j.name.toUpperCase(), { color: '#fffaf0', stroke: '#3a2a4d', depth: 6 }).setVisible(false))
  }

  pick(j) {
    if (this.done || this.fixed[j.id]) return
    if (j.fix) {
      this.fixed[j.id] = true
      Audio.ok()
      this.msg.setText(j.tip)
      const n = Object.keys(this.fixed).length
      this.count.setText(`${n}/4`)
      if (n === 4) this.win()
    } else {
      this.wrong += 1
      Audio.bad()
      this.msg.setText(j.tip)
      this.cameras.main.shake(120, 0.004)
    }
  }

  win() {
    this.done = true
    const score = Math.max(60, 100 - this.wrong * 15)
    this.info.setText('POSTUR SEMPURNA!')
    this.msg.setText('Bahu rileks, siku sejajar, pergelangan lurus, punggung tegak.')
    Audio.win()
    this.time.delayedCall(2300, () => closeMini(this, { score }))
  }

  // posisi sendi dari pose (0 = salah, 1 = benar)
  joints() {
    const p = this.pose
    const lean = lerp(0.52, 0.03, p.punggung)
    const hipv = HIP
    let S = pt(hipv.x + Math.sin(lean) * 48, hipv.y - Math.cos(lean) * 48)
    S = pt(S.x, S.y - lerp(9, 0, p.bahu))
    const head = pt(S.x + lerp(14, 3, p.punggung), S.y - 17 + lerp(5, 0, p.bahu))
    const Ebad = pt(S.x + 2, S.y + 36), Egood = pt(S.x + 20, W0.y - 2)
    const E = pt(lerp(Ebad.x, Egood.x, p.siku), lerp(Ebad.y, Egood.y, p.siku))
    const ang = lerp(1.0, 0, p.tangan)
    const F = pt(W0.x + Math.cos(ang) * 13, W0.y + Math.sin(ang) * 13)
    const knee = pt(hipv.x + 34, hipv.y - 2)
    const foot = pt(knee.x, 189)
    return { S, head, E, F, knee, foot }
  }

  update(_, delta) {
    this.t += Math.min(delta, 50) / 1000
    for (const k of Object.keys(this.pose)) this.pose[k] += ((this.fixed[k] ? 1 : 0) - this.pose[k]) * 0.1
    const J = this.joints()
    this.draw(J)
    const pos = { bahu: J.S, siku: J.E, tangan: W0, punggung: pt((HIP.x + J.S.x) / 2, (HIP.y + J.S.y) / 2), lutut: J.knee, kaki: pt(J.foot.x + 6, J.foot.y - 2) }
    JOINTS.forEach((j, i) => {
      const p = pos[j.id]
      this.dots[i].setPosition(p.x, p.y)
      this.labels[i].setVisible(false)
    })
    this.drawMarkers(pos)
  }

  drawMarkers(pos) {
    const g = this.gfx
    JOINTS.forEach((j) => {
      const p = pos[j.id]
      const fx = this.fixed[j.id] && j.fix
      const r = 5 + (fx ? 0 : Math.sin(this.t * 5) * 1.2)
      g.lineStyle(2, fx ? 0x72c7ae : 0xffd467).strokeCircle(p.x, p.y, r)
      if (fx) { g.fillStyle(0x72c7ae).fillCircle(p.x, p.y, 2) }
    })
  }

  draw(J) {
    const g = this.gfx
    g.clear()
    // lantai & piano
    g.fillStyle(0x6b5a8a).fillRect(0, 190, W, 26)
    g.fillStyle(0x7561ad).fillRect(150, 96, 200, 50)
    g.fillStyle(0x5b4570).fillRect(150, 96, 200, 6)
    g.fillStyle(0x3a2a4d).fillRect(150, 144, 200, 6)
    g.fillStyle(0xfffaf0).fillRect(150, 148, 200, 12)
    g.fillStyle(0x3a2a4d)
    for (let x = 154; x < 348; x += 8) g.fillRect(x, 148, 1, 12)
    for (let x = 158; x < 344; x += 8) if (((x - 150) / 8) % 7 !== 3 && ((x - 150) / 8) % 7 !== 0) g.fillRect(x, 148, 5, 7)
    g.fillStyle(0xb98a5a).fillRect(150, 160, 200, 30)
    // bangku
    g.fillStyle(0xf594b5).fillRect(HIP.x - 22, HIP.y + 4, 44, 6)
    g.fillStyle(0x7a5a38).fillRect(HIP.x - 16, HIP.y + 10, 4, 24).fillRect(HIP.x + 12, HIP.y + 10, 4, 24)
    const L = (a, b, w, c) => { g.lineStyle(w, c); g.lineBetween(a.x, a.y, b.x, b.y) }
    const dot = (p, r, c) => g.fillStyle(c).fillCircle(p.x, p.y, r)
    const PANTS = 0x5b4570, SHIRT = 0x9b86d9, SKIN = 0xf2c9a5, HAIR = 0x43323f
    // kaki
    L(HIP, J.knee, 7, PANTS); L(J.knee, J.foot, 6, PANTS); dot(HIP, 3.5, PANTS); dot(J.knee, 3.2, PANTS)
    g.fillStyle(0x3a2a4d).fillRect(J.foot.x - 3, 187, 10, 4)
    // badan
    L(HIP, J.S, 11, SHIRT); dot(J.S, 5.5, SHIRT)
    // kepala
    L(J.S, J.head, 3, SKIN); dot(J.head, 9, SKIN)
    g.fillStyle(HAIR).fillCircle(J.head.x - 2, J.head.y - 3, 9).fillRect(J.head.x - 11, J.head.y - 3, 8, 9)
    g.fillStyle(SKIN).fillCircle(J.head.x + 3, J.head.y + 1, 7)
    g.fillStyle(0x3a2a4d).fillRect(J.head.x + 5, J.head.y - 1, 2, 3)
    // lengan
    L(J.S, J.E, 6, SHIRT); L(J.E, W0, 5, SKIN); L(W0, J.F, 4, SKIN)
    dot(J.E, 3.2, SHIRT); dot(W0, 2.6, SKIN)
  }
}
