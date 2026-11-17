import { GAME_W as W } from '../config.js'

export const txt = (scene, x, y, s, { size = 8, color = '#3a2a4d', stroke = '#fffaf0', align = 0.5, depth = 10 } = {}) =>
  scene.add.text(x, y, s, { fontFamily: 'Silkscreen', fontSize: `${size}px`, color, stroke, strokeThickness: stroke ? 3 : 0, align: align === 0.5 ? 'center' : 'left', wordWrap: { width: W - 24 } })
    .setOrigin(align, 0).setDepth(depth)

// Tombol kecil "KELUAR" kanan-atas. onClick dipanggil tanpa memicu tap game di bawahnya.
export function exitButton(scene, onClick) {
  const b = txt(scene, W - 8, 6, 'X KELUAR', { color: '#fffaf0', stroke: '#c96890', align: 1, depth: 50 })
  b.setInteractive({ useHandCursor: true })
  b.on('pointerdown', onClick)
  return b
}

// Selesai: kembalikan hasil ke scene induk lalu tutup mini-game.
export function closeMini(scene, result) {
  const parent = scene.scene.get(scene.parentKey)
  scene.scene.stop()
  scene.scene.resume(scene.parentKey)
  parent.events.emit('mini-result', result)
}
