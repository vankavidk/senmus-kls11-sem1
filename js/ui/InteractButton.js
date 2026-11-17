import { GAME_W, GAME_H } from '../config.js'

// Tombol [INTERAKSI] ikon tangan bersinar di kanan-bawah (mobile).
export class InteractButton {
  constructor(scene, onPress) {
    this.scene = scene
    this.s = 1.5
    this.img = scene.add.image(0, 0, 'ui_btn_interaksi').setScrollFactor(0).setDepth(100000).setAlpha(0.8)
    this.render()
    this.img.setInteractive({ useHandCursor: true })
    this.img.on('pointerdown', () => { this.s = 1.35; this.render(); onPress() })
    const up = () => { this.s = 1.5; this.render() }
    this.img.on('pointerup', up)
    this.img.on('pointerout', up)
    this.glow = scene.tweens.add({ targets: this.img, alpha: 1, duration: 700, yoyo: true, repeat: -1, paused: true })
  }
  render() { this.scene.uiPlace(this.img, GAME_W - 40, GAME_H - 44, this.s) }
  setReady(on) { on ? this.glow.resume() : (this.glow.pause(), this.img.setAlpha(0.8)) }
}
