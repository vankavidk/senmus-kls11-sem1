import { WORLD } from '../config.js'
import { COLLIDERS, DOORS, SPAWN } from '../data/world.js'
import { NPCS } from '../data/npcs.js'
import { WorldScene } from './WorldScene.js'

const ROOMS = { galeri: 'Gallery', lab: 'Lab', lorong: 'Lorong', kedap: 'Kedap', kibor: 'Kibor', taman: 'Taman', aula: 'Aula' }

// Alun-alun Simfoni (peta luar). Pintu Galeri Etnik membuka interior; lokasi lain hadir di tahap berikutnya.
export class GameScene extends WorldScene {
  constructor() { super('Game') }

  layout() {
    const spots = DOORS.map((d) => ({
      id: d.id, x: d.x, y: d.y, range: 14, label: ROOMS[d.id] ? `Masuk ${d.name}` : d.name, labelDy: 34,
      run: () => {
        if (ROOMS[d.id]) this.goTo(ROOMS[d.id], {})
        else this.hud.toast(`${d.name}\nhadir di tahap berikutnya`, 2400)
      },
    }))
    return { mapKey: 'world', w: WORLD.w, h: WORLD.h, bg: '#9bdb9b', colliders: COLLIDERS, spawn: SPAWN, npcs: NPCS, spots, particles: true }
  }

  afterCreate() {
    if (this.enterData.fromInterior === undefined && !this.enterData.spawn) {
      this.time.delayedCall(700, () => this.hud.toast(`Selamat datang, ${this.profile.name}!\nTemui Maestro Minang di depan Galeri Etnik.`, 3600))
    }
  }
}
