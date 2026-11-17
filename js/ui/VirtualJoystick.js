import { GAME_W, GAME_H } from '../config.js'

// Joystick virtual: kiri-bawah. Sentuh di area kiri layar mana pun, geser relatif titik sentuh awal.
export class VirtualJoystick {
  constructor(scene) {
    this.scene = scene
    this.vector = new Phaser.Math.Vector2(0, 0)
    this.pointer = null
    this.radius = 26
    this.home = { x: 52, y: GAME_H - 52 }
    this.origin = { ...this.home }

    this.basePos = { ...this.home }; this.knobPos = { ...this.home }
    this.base = scene.add.image(0, 0, 'ui_joy_base').setScrollFactor(0).setDepth(100000).setAlpha(0.7)
    this.knob = scene.add.image(0, 0, 'ui_joy_knob').setScrollFactor(0).setDepth(100001).setAlpha(0.9)
    this.render()

    scene.input.addPointer(2)
    scene.input.on('pointerdown', (p) => {
      if (this.pointer || p.x > GAME_W * 0.46 || p.y < GAME_H * 0.3) return
      this.pointer = p
      this.origin = { x: p.x, y: p.y }
      this.basePos = { x: p.x, y: p.y }; this.base.setAlpha(0.95); this.render()
      this.update(p)
    })
    scene.input.on('pointermove', (p) => { if (p === this.pointer) this.update(p) })
    const release = (p) => { if (p === this.pointer) this.reset() }
    scene.input.on('pointerup', release)
    scene.input.on('pointerupoutside', release)
  }

  // zoom kamera mengubah ukuran layar objek scrollFactor 0, jadi posisi/skala dihitung ulang lewat scene.uiPlace
  render() {
    this.scene.uiPlace(this.base, this.basePos.x, this.basePos.y, 1.5)
    this.scene.uiPlace(this.knob, this.knobPos.x, this.knobPos.y, 1.5)
  }

  update(p) {
    const dx = p.x - this.origin.x, dy = p.y - this.origin.y
    const d = Math.min(Math.hypot(dx, dy), this.radius)
    const a = Math.atan2(dy, dx)
    this.knobPos = { x: this.origin.x + Math.cos(a) * d, y: this.origin.y + Math.sin(a) * d }; this.render()
    const m = d / this.radius
    this.vector.set(m < 0.2 ? 0 : Math.cos(a) * m, m < 0.2 ? 0 : Math.sin(a) * m)
  }

  reset() {
    this.pointer = null
    this.vector.set(0, 0)
    this.origin = { ...this.home }
    this.basePos = { ...this.home }; this.knobPos = { ...this.home }; this.base.setAlpha(0.7); this.render()
  }
}
