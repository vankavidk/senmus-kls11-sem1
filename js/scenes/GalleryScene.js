import { GALERI } from '../data/galeri.js'
import { MAESTRO_INDOOR } from '../data/npcs.js'
import { WorldScene } from './WorldScene.js'

// Interior Galeri Etnik: Maestro Minang, penyangga Saluang (Misi 1), panggung Gamelan (Misi 2).
export class GalleryScene extends WorldScene {
  constructor() { super('Gallery') }

  layout() {
    const G = GALERI
    return {
      film: 'galeri', mapKey: 'galeri', w: G.w, h: G.h, bg: '#3a2a4d', colliders: G.colliders, spawn: G.spawn, particles: false,
      npcs: [MAESTRO_INDOOR],
      spots: [
        { ...G.exit, range: 14, label: 'Keluar ke Alun-alun', labelDy: 8, run: () => this.goTo('Game', { spawn: { x: 92, y: 100 }, fromInterior: true }) },
        { ...G.pedestal, range: 26, label: 'Saluang', labelDy: 38, run: () => this.touchSaluang() },
        { ...G.gamelan, range: 30, label: 'Panggung Gamelan', labelDy: 8, run: () => this.touchGamelan() },
      ],
    }
  }

  afterCreate() {
    // beberapa kunang-kunang emas di sekitar saluang
    this.add.particles(0, 0, 'spark', {
      x: { min: 214, max: 258 }, y: { min: 70, max: 106 }, lifespan: 2600, speedY: { min: -10, max: -3 }, frequency: 260,
      alpha: { start: 0, end: 0, ease: (t) => Math.sin(t * Math.PI) }, scale: { min: 1, max: 1.5 },
    }).setDepth(90000)
  }

  touchSaluang() {
    const t = this.tasks()
    if (!t.meet_minang) this.completeTask('meet_minang', 0)
    if (!t.touch_saluang) this.completeTask('touch_saluang')
    const practice = !!t.hold_breath
    this.launchMini('MiniSaluang', { practice }, (r) => this.finishMission(1, 'hold_breath', 300, r))
  }

  touchGamelan() {
    const t = this.tasks()
    if (!t.talk_gamelan) { this.hud.toast(t.hold_breath ? 'Bicaralah dengan Maestro Minang dulu.' : 'Selesaikan misi Saluang dulu,\nlalu temui Maestro.', 2800); return }
    this.launchMini('MiniGamelan', { practice: !!t.order_gamelan }, (r) => this.finishMission(2, 'order_gamelan', 300, r))
  }
}
