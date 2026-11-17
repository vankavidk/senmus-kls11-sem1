import { AULA, MANAGER_INDOOR } from '../data/aula.js'
import { Storage } from '../systems/Storage.js'
import { showNotebook } from '../ui/Notebook.js'
import { WorldScene } from './WorldScene.js'

// Aula Pagelaran Agung: House Manager dan panel panggung (Misi 10, final).
export class AulaScene extends WorldScene {
  constructor() { super('Aula') }

  layout() {
    const K = AULA
    return {
      film: 'aula', mapKey: 'aula', w: K.w, h: K.h, bg: '#3a2a4d', colliders: K.colliders, spawn: K.spawn, particles: false, npcs: [MANAGER_INDOOR],
      spots: [
        { ...K.exit, range: 14, label: 'Keluar ke Alun-alun', labelDy: 8, run: () => this.goTo('Game', { spawn: { x: 240, y: 226 }, fromInterior: true }) },
        { ...K.panel, range: 22, label: 'Panel Panggung', labelDy: 18, run: () => this.touchPanel() },
        { ...K.desk, range: 22, label: 'Meja Perancang Pagelaran', labelDy: 20, run: () => this.touchDesk() },
      ],
    }
  }

  touchPanel() {
    const t = this.tasks()
    if (!t.talk_manager) { this.hud.toast('Bicaralah dengan House Manager dulu.', 2600); return }
    const m = Storage.getProgress().missions
    const left = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((i) => !m[i])
    if (left.length) { this.hud.toast(`Selesaikan dulu misi ${left.join(', ')}.`, 3200); return }
    this.launchMini('MiniStage', { practice: !!t.stage }, (r) => {
      this.finishMission(10, 'stage', 500, r)
      if (r && !t.talk_show) this.time.delayedCall(4600, () => this.hud.toast('Satu misi terakhir menunggu.\nTemui House Manager lagi.', 3600))
    })
  }

  afterCreate() {
    const { x, y } = AULA.desk
    const glow = this.add.circle(x, y - 6, 15, 0xfff7b8, 0.25).setDepth(y - 1)
    this.tweens.add({ targets: glow, alpha: 0.06, scale: 1.4, yoyo: true, repeat: -1, duration: 900 })
    const g = this.add.graphics().setDepth(y)
    g.fillStyle(0x3a2a4d).fillRect(x - 13, y - 8, 26, 8).fillStyle(0xb98b5e).fillRect(x - 12, y - 9, 24, 7).fillStyle(0xfffaf0).fillRect(x - 8, y - 12, 9, 5).fillStyle(0xf594b5).fillRect(x + 2, y - 12, 7, 4)
    this.add.image(x + 1, y - 18, 'star_note').setScale(1.6).setDepth(y + 1)
  }

  touchDesk() {
    const t = this.tasks()
    if (!t.stage) { this.hud.toast('Selesaikan dulu panel panggung (Misi 10).', 2800); return }
    if (!t.talk_show) { this.hud.toast('Bicaralah dengan House Manager dulu.', 2600); return }
    this.launchMini('MiniShow', { practice: !!t.show }, (r) => {
      this.finishMission(11, 'show', 450, r)
      if (r && !t.show) this.time.delayedCall(3200, () => showNotebook(true))
    })
  }
}
