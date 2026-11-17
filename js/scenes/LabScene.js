import { LAB } from '../data/lab.js'
import { DETEKTIF_INDOOR } from '../data/npcs.js'
import { WorldScene } from './WorldScene.js'

// Interior Lab DNA Genre: Detektif Nada, karpet genre (Misi 3), Mixing Desk (Misi 4).
export class LabScene extends WorldScene {
  constructor() { super('Lab') }

  layout() {
    const L = LAB
    return {
      film: 'lab', mapKey: 'lab', w: L.w, h: L.h, bg: '#5b4570', colliders: L.colliders, spawn: L.spawn, particles: false,
      npcs: [DETEKTIF_INDOOR],
      spots: [
        { ...L.exit, range: 14, label: 'Keluar ke Alun-alun', labelDy: 8, run: () => this.goTo('Game', { spawn: { x: 142, y: 100 }, fromInterior: true }) },
        { ...L.genre, range: 34, label: 'Karpet Genre', labelDy: 8, run: () => this.touchGenre() },
        { ...L.mixing, range: 30, label: 'Mixing Desk', labelDy: 34, run: () => this.touchMixing() },
      ],
    }
  }

  touchGenre() {
    const t = this.tasks()
    if (!t.talk_detektif) { this.hud.toast('Bicaralah dengan Detektif Nada dulu.', 2600); return }
    this.launchMini('MiniGenre', { practice: !!t.sort_genre }, (r) => this.finishMission(3, 'sort_genre', 350, r))
  }

  touchMixing() {
    const t = this.tasks()
    if (!t.talk_ramuan) { this.hud.toast(t.sort_genre ? 'Dengarkan teka-teki Detektif Nada dulu.' : 'Selesaikan misi Genre dulu,\nlalu temui Detektif Nada.', 2800); return }
    this.launchMini('MiniMix', { practice: !!t.mix_ramuan }, (r) => this.finishMission(4, 'mix_ramuan', 400, r))
  }
}
