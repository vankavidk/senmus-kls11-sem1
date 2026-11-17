import { AVATARS } from '../data/avatars.js'
import { NPCS } from '../data/npcs.js'
import { FRAME, GAME_W, GAME_H } from '../config.js'

// Memuat semua aset, membuat animasi jalan untuk 12 avatar, lalu masuk Splash.
export class BootScene extends Phaser.Scene {
  constructor() { super('Boot') }

  preload() {
    const bar = this.add.rectangle(GAME_W / 2 - 60, GAME_H / 2, 0, 6, 0xf594b5).setOrigin(0, 0.5)
    this.add.rectangle(GAME_W / 2, GAME_H / 2, 124, 10).setStrokeStyle(2, 0x3a2a4d)
    this.add.text(GAME_W / 2, GAME_H / 2 - 16, 'MEMUAT...', { fontFamily: 'Silkscreen', fontSize: '8px', color: '#3a2a4d' }).setOrigin(0.5)
    this.load.on('progress', (v) => { bar.width = 120 * v })

    this.load.image('world', 'assets/img/world.png')
    this.load.image('splash', 'assets/img/splash.png')
    this.load.image('logo', 'assets/img/ui_logo.png')
    this.load.image('ui_joy_base', 'assets/img/ui_joy_base.png')
    this.load.image('ui_joy_knob', 'assets/img/ui_joy_knob.png')
    this.load.image('ui_btn_interaksi', 'assets/img/ui_btn_interaksi.png')
    this.load.image('quest_exclaim', 'assets/img/quest_exclaim.png')
    this.load.image('quest_done', 'assets/img/quest_done.png')
    this.load.image('galeri', 'assets/img/galeri.png')
    this.load.image('lab', 'assets/img/lab.png')
    this.load.image('kedap', 'assets/img/kedap.png')
    this.load.image('lorong', 'assets/img/lorong.png')
    this.load.image('kibor', 'assets/img/kibor.png')
    this.load.image('taman', 'assets/img/taman.png')
    this.load.image('aula', 'assets/img/aula.png')
    this.load.image('mic_stand', 'assets/img/mic_stand.png')
    this.load.image('amp', 'assets/img/amp.png')
    for (const k of ['headphones', 'oscilloscope', 'turntable', 'piano_grand', 'speaker', 'monitor_dna', 'star_note', 'book', 'shelf_vinyl']) this.load.image(k, `assets/img/${k}.png`)
    this.load.image('npc_penyimak', 'assets/img/npc_penyimak.png')
    for (const k of ['ukulele', 'tamborin', 'bass_elektrik', 'drum_kit', 'sampe', 'gitar_akustik', 'gitar_elektrik', 'drum_machine', 'synth']) this.load.image(k, `assets/img/${k}.png`)
    for (const k of ['gong', 'kempul', 'kenong', 'gender', 'cengceng', 'saluang', 'pedestal']) this.load.image(k, `assets/img/${k}.png`)
    for (const n of NPCS) this.load.image(n.key, `assets/img/${n.key}.png`)
    for (const a of AVATARS) {
      this.load.spritesheet(`walk_${a.id}`, `assets/sheets/walk_${a.id}.png`, { frameWidth: FRAME.w, frameHeight: FRAME.h })
    }
  }

  create() {
    for (const a of AVATARS) {
      const k = `walk_${a.id}`
      const mk = (dir, frames) => this.anims.create({ key: `${a.id}_walk_${dir}`, frames: this.anims.generateFrameNumbers(k, { frames }), frameRate: 10, repeat: -1 })
      mk('down', [1, 0, 2, 0]); mk('up', [4, 3, 5, 3]); mk('left', [7, 6, 8, 6])
    }
    // kunang-kunang emas (partikel 2x2)
    const g = this.make.graphics({ x: 0, y: 0, add: false })
    g.fillStyle(0xfff7b8, 1).fillRect(0, 0, 2, 2)
    g.generateTexture('spark', 2, 2)
    g.destroy()
    this.scene.start('Splash')
  }
}
