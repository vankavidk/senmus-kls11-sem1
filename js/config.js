// Konstanta global game. Resolusi logis 384x216 (16:9) = 2x splash 192x108.
export const GAME_W = 384
export const GAME_H = 216
export const WORLD = { w: 352, h: 256 }
export const PLAYER_SPEED = 66
export const FRAME = { w: 14, h: 23 }
export const STORAGE_KEY = 'melodyAcademy.v1'

export const CLASS_LIST = (() => {
  const out = []
  for (const tingkat of ['X', 'XI', 'XII']) {
    for (let i = 1; i <= 5; i++) out.push(`${tingkat} MIPA ${i}`)
    for (let i = 1; i <= 4; i++) out.push(`${tingkat} IPS ${i}`)
    out.push(`${tingkat} Bahasa`, `${tingkat} Seni Budaya`)
  }
  return out
})()
