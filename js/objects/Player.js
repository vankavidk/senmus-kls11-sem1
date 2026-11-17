import { PLAYER_SPEED } from '../config.js'

// Pemain: sprite 14x23, origin di titik kaki. Hitbox kecil di kaki agar terasa alami di sekitar objek.
export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, avatarId, name) {
    super(scene, x, y, `walk_${avatarId}`, 0)
    this.avatarId = avatarId
    this.facing = 'down'
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setOrigin(0.5, 1)
    this.body.setSize(8, 5).setOffset(3, 17)
    this.setCollideWorldBounds(true)

    this.label = scene.add.text(x, y, name, {
      fontFamily: 'Silkscreen', fontSize: '8px', color: '#fffaf0', stroke: '#3a2a4d', strokeThickness: 3,
    }).setOrigin(0.5, 1).setDepth(99999)
  }

  // dx, dy: arah (-1..1). Mengembalikan true jika bergerak.
  move(dx, dy) {
    const len = Math.hypot(dx, dy)
    if (len < 0.15) {
      this.setVelocity(0, 0)
      this.anims.stop()
      this.setFrame(this.idleFrame())
      return false
    }
    const nx = dx / Math.max(len, 1), ny = dy / Math.max(len, 1)
    this.setVelocity(nx * PLAYER_SPEED, ny * PLAYER_SPEED)
    if (Math.abs(dx) > Math.abs(dy)) this.facing = dx < 0 ? 'left' : 'right'
    else this.facing = dy < 0 ? 'up' : 'down'
    const dir = this.facing === 'right' ? 'left' : this.facing
    this.setFlipX(this.facing === 'right')
    this.anims.play(`${this.avatarId}_walk_${dir}`, true)
    return true
  }

  idleFrame() {
    const base = { down: 0, up: 3, left: 6, right: 6 }[this.facing]
    this.setFlipX(this.facing === 'right')
    return base
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)
    this.setDepth(this.y)
    this.label.setPosition(Math.round(this.x), Math.round(this.y - 24))
  }

  destroy(fromScene) { this.label?.destroy(); super.destroy(fromScene) }
}
