// Ruang Kedap Apresiasi (peta 320x192, kedap.png)
export const KEDAP = {
  w: 320, h: 192, spawn: { x: 160, y: 156 },
  colliders: [[0, 0, 320, 52], [0, 0, 8, 192], [312, 0, 8, 192], [0, 184, 144, 8], [176, 184, 144, 8], [194, 60, 96, 40], [16, 172, 16, 10], [288, 172, 16, 10], [16, 62, 16, 10]],
  exit: { x: 160, y: 180 }, console: { x: 240, y: 112 }, mirror: { x: 160, y: 60 },
}
export const LORONG = {
  w: 320, h: 192, spawn: { x: 160, y: 156 },
  colliders: [[0, 0, 320, 52], [0, 0, 8, 192], [312, 0, 8, 192], [0, 184, 144, 8], [176, 184, 144, 8], [26, 70, 30, 30], [106, 70, 30, 30], [186, 70, 30, 30], [266, 70, 30, 30], [16, 172, 16, 10], [288, 172, 16, 10]],
  exit: { x: 160, y: 180 }, stations: [{ x: 41, y: 108 }, { x: 121, y: 108 }, { x: 201, y: 108 }, { x: 281, y: 108 }],
}
export const PENYIMAK = {
  id: 'penyimak', key: 'npc_penyimak', name: 'Penyimak Hening', x: 100, y: 120, quest: true,
  mark: (t) => !t.talk_penyimak || !t.calibrate,
  lines: (t) => {
    if (!t.talk_penyimak) return [
      'Ssst. Di ruang ini, dinding menelan segala gema, dan yang tersisa hanyalah telingamu.',
      'Kebanyakan orang mendengar secara pasif: bunyi lewat begitu saja, seperti angin lewat jendela. Apresiasi mengubahnya menjadi perseptif: kau menyadari nada, irama, melodi, dan harmoni.',
      'Di meja osiloskop ada lagu yang sumbang. Geser empat slider hingga gelombangnya mulus dan telingamu merasa lega. Jangan hanya melihat angka, dengarkan.',
    ]
    if (!t.calibrate) return ['Meja osiloskop ada di sisi kanan. Dengarkan lagunya dan geser slider pelan-pelan. Gelombang yang mulus adalah tanda telinga yang sudah menemukan jalan.']
    return ['Lihat, gelombangmu kini mulus seperti air tenang. Itulah bedanya mendengar dan menyimak.', 'Lorong Waktu di sebelah menunggu bila kau ingin tahu dari mana semua bunyi ini datang.']
  },
  onTalked: (scene, t) => { if (!t.talk_penyimak) scene.completeTask('talk_penyimak') },
}
