import { TAMAN, LYRIC, GROW_FREQ, PUJANGGA_INDOOR } from '../data/taman.js'
import { Audio } from '../systems/Audio.js'
import { WorldScene } from './WorldScene.js'

// Taman Kaca Karya: Pujangga Taman, 8 kata bercahaya (Misi 8), pot kaca untuk menumbuhkan melodi (Misi 9).
export class TamanScene extends WorldScene {
  constructor() { super('Taman') }

  layout() {
    const K = TAMAN
    return {
      film: 'taman', mapKey: 'taman', w: K.w, h: K.h, bg: '#3a2a4d', colliders: K.colliders, spawn: K.spawn, particles: false, npcs: [PUJANGGA_INDOOR],
      spots: [
        { ...K.exit, range: 14, label: 'Keluar ke Alun-alun', labelDy: 8, run: () => this.goTo('Game', { spawn: { x: 96, y: 226 }, fromInterior: true }) },
        { ...K.pot, range: 22, label: 'Pot Kaca Melodi', labelDy: 34, run: () => this.touchPot() },
      ],
    }
  }

  afterCreate() {
    this.words = []
    this.banner = this.add.text(192, 32, '', { fontFamily: 'Silkscreen', fontSize: '8px', color: '#fff7b8', backgroundColor: '#3a2a4dcc', padding: { x: 6, y: 3 }, align: 'center' })
      .setOrigin(0.5, 0).setDepth(100010).setVisible(false)
    this.uiAdd(this.banner, 192, 32)
    const t = this.tasks()
    if (t.talk_pujangga && !t.collect_words) this.spawnWords()
  }

  spawnWords() {
    this.words.forEach((w) => w.destroy())
    this.words = []
    const got = this.game.registry.get('lyricGot') || []
    LYRIC.words.forEach((word, i) => {
      if (got.includes(i)) return
      const p = LYRIC.spots[i]
      const glow = this.add.circle(0, 0, 11, 0xfff7b8, 0.35)
      const label = this.add.text(0, 0, word, { fontFamily: 'Silkscreen', fontSize: '8px', color: '#7561ad', stroke: '#fffaf0', strokeThickness: 3 }).setOrigin(0.5)
      const c = this.add.container(p.x, p.y - 8, [glow, label]).setDepth(p.y + 40)
      c.idx = i
      this.tweens.add({ targets: c, y: c.y - 4, yoyo: true, repeat: -1, duration: 900 + i * 90, ease: 'Sine.inOut' })
      this.tweens.add({ targets: glow, alpha: 0.9, scale: 1.25, yoyo: true, repeat: -1, duration: 700 })
      this.words.push(c)
    })
    this.updateBanner()
  }

  updateBanner() {
    const got = (this.game.registry.get('lyricGot') || []).length
    this.banner.setText(`KATA BERCAHAYA ${got}/8`).setVisible(this.words.length > 0)
  }

  collect(c) {
    const got = this.game.registry.get('lyricGot') || []
    got.push(c.idx)
    this.game.registry.set('lyricGot', got)
    Audio.note(GROW_FREQ[c.idx % 8], 0.4, 'triangle', 0.3)
    this.words = this.words.filter((w) => w !== c)
    this.tweens.add({ targets: c, y: c.y - 16, alpha: 0, duration: 400, onComplete: () => c.destroy() })
    this.updateBanner()
    if (got.length >= LYRIC.words.length) {
      this.game.registry.set('lyricGot', [])
      this.banner.setVisible(false)
      this.completeTask('collect_words', 25)
      this.time.delayedCall(1200, () => this.openLyrics())
    }
  }

  openLyrics() {
    const t = this.tasks()
    this.launchMini('MiniLyric', { practice: !!t.lyrics }, (r) => this.finishMission(8, 'lyrics', 350, r))
  }

  touchPot() {
    const t = this.tasks()
    if (!t.lyrics) { this.hud.toast(t.collect_words ? 'Susun syair dulu: bicaralah dengan Pujangga.' : 'Selesaikan syair bersama Pujangga dulu.', 2600); return }
    this.launchMini('MiniGrow', { practice: !!t.grow }, (r) => this.finishMission(9, 'grow', 350, r))
  }

  update(t, d) {
    super.update(t, d)
    if (!this.words.length || this.locked()) return
    for (const w of this.words) {
      const p = LYRIC.spots[w.idx]
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, p.x, p.y) < 13) { this.collect(w); break }
    }
  }
}
