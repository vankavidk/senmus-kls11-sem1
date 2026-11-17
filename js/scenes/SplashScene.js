import { Audio } from '../systems/Audio.js'
import { GAME_W, GAME_H } from '../config.js'

export class SplashScene extends Phaser.Scene {
  constructor() { super('Splash') }

  create() {
    Audio.music('m_menu')
    this.add.image(GAME_W / 2, GAME_H / 2, 'splash').setScale(2)
    this.cameras.main.fadeIn(500, 255, 255, 255)

    // kunang-kunang emas melayang
    for (let i = 0; i < 26; i++) {
      const s = this.add.image(Phaser.Math.Between(0, GAME_W), Phaser.Math.Between(20, GAME_H - 20), 'spark').setAlpha(0)
      this.tweens.add({
        targets: s, alpha: { from: 0, to: 1 }, y: s.y - Phaser.Math.Between(10, 30), x: s.x + Phaser.Math.Between(-12, 12),
        duration: Phaser.Math.Between(1400, 2800), yoyo: true, repeat: -1, delay: Phaser.Math.Between(0, 2000), ease: 'Sine.easeInOut',
      })
    }

    const hint = this.add.text(GAME_W / 2, GAME_H - 10, 'KETUK LAYAR / TEKAN ENTER', {
      fontFamily: 'Silkscreen', fontSize: '8px', color: '#3a2a4d', stroke: '#fffaf0', strokeThickness: 3,
    }).setOrigin(0.5, 1)
    this.tweens.add({ targets: hint, alpha: 0.25, duration: 700, yoyo: true, repeat: -1 })

    let go = false
    const next = () => {
      if (go) return
      go = true
      this.cameras.main.fadeOut(350, 255, 255, 255)
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Menu'))
    }
    this.input.once('pointerdown', next)
    this.input.keyboard.once('keydown-ENTER', next)
    this.input.keyboard.once('keydown-SPACE', next)
  }
}
