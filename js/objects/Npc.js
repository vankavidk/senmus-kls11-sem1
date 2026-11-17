// NPC statis dengan animasi idle (napas kecil), tanda quest "!" dan hitbox kaki.
export class Npc extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, def) {
    super(scene, def.x, def.y, def.key)
    this.def = def
    scene.add.existing(this)
    scene.physics.add.existing(this, true)
    this.setOrigin(0.5, 1)
    this.body.setSize(8, 5).setOffset(3, 17)
    this.body.updateFromGameObject()
    this.setDepth(def.y)

    // napas lembut: ujung kepala naik-turun 1px
    scene.tweens.add({ targets: this, scaleY: 1.03, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: Math.random() * 600 })

    if (def.quest || def.mark) {
      this.mark = scene.add.image(def.x, def.y - 28, 'quest_exclaim').setDepth(99998)
      scene.tweens.add({ targets: this.mark, y: this.mark.y - 2, duration: 520, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' })
    }
  }
  hideMark() { this.mark?.setVisible(false) }
}
