import { KEDAP, PENYIMAK } from '../data/kedap.js'
import { WorldScene } from './WorldScene.js'

// Ruang Kedap Apresiasi: Penyimak Hening, Cermin Besar, meja osiloskop (Misi 5).
export class KedapScene extends WorldScene {
  constructor() { super('Kedap') }

  layout() {
    const K = KEDAP
    return {
      film: 'kedap', mapKey: 'kedap', w: K.w, h: K.h, bg: '#3a2a4d', colliders: K.colliders, spawn: K.spawn, particles: false, npcs: [PENYIMAK],
      spots: [
        { ...K.exit, range: 14, label: 'Keluar ke Alun-alun', labelDy: 8, run: () => this.goTo('Game', { spawn: { x: 292, y: 100 }, fromInterior: true }) },
        { ...K.mirror, range: 22, label: 'Cermin Besar', labelDy: 8, run: () => this.hud.openDialog('Cermin Besar', ['Dalam hening, kau melihat dirimu sedang mendengarkan.', 'Mendengar adalah peristiwa telinga. Menyimak adalah peristiwa jiwa.'], () => {}) },
        { ...K.console, range: 30, label: 'Meja Osiloskop', labelDy: 34, run: () => this.touchConsole() },
      ],
    }
  }

  touchConsole() {
    const t = this.tasks()
    if (!t.talk_penyimak) { this.hud.toast('Bicaralah dengan Penyimak Hening dulu.', 2600); return }
    this.launchMini('MiniCalibrate', { practice: !!t.calibrate }, (r) => this.finishMission(5, 'calibrate', 350, r))
  }
}
