import { LORONG } from '../data/kedap.js'
import { ERAS } from '../data/era.js'
import { Audio } from '../systems/Audio.js'
import { WorldScene } from './WorldScene.js'

// Lorong Waktu Evolusi: 4 piringan hitam (Tradisi, Keroncong, Pop-Rock, Elektronik). Tanpa misi bernilai; +25 IP per era.
export class LorongScene extends WorldScene {
  constructor() { super('Lorong') }

  layout() {
    const L = LORONG
    return {
      film: 'lorong', mapKey: 'lorong', w: L.w, h: L.h, bg: '#3a2a4d', colliders: L.colliders, spawn: L.spawn, particles: false, npcs: [],
      spots: [
        { ...L.exit, range: 14, label: 'Keluar ke Alun-alun', labelDy: 8, run: () => this.goTo('Game', { spawn: { x: 236, y: 100 }, fromInterior: true }) },
        ...L.stations.map((p, i) => ({ ...p, range: 24, label: ERAS[i].name, labelDy: 40, run: () => this.playEra(i) })),
      ],
    }
  }

  playEra(i) {
    Audio.era(i)
    const e = ERAS[i]
    this.hud.openDialog(e.name, e.lines, () => this.completeTask(`era_${i}`))
  }
}
