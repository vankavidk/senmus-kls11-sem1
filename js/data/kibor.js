// Panggung Latihan Kibor (peta 320x192, kibor.png)
export const KIBOR = {
  w: 320, h: 192, spawn: { x: 160, y: 156 },
  colliders: [[0, 0, 320, 52], [0, 0, 8, 192], [312, 0, 8, 192], [0, 184, 144, 8], [176, 184, 144, 8], [132, 56, 62, 38], [198, 76, 12, 8], [16, 172, 16, 10], [288, 172, 16, 10]],
  exit: { x: 160, y: 180 }, piano: { x: 160, y: 104 }, metronome: { x: 204, y: 92 },
}

// Tuts raksasa di lantai: 5 tuts = 5 jari (1 jempol ... 5 kelingking), posisi C-D-E-F-G.
export const KEYS = {
  y0: 116, h: 52, w: 44, x0: 40, step: 48,
  freq: [261.6, 293.7, 329.6, 349.2, 392],
  fingers: ['Jempol', 'Telunjuk', 'Jari tengah', 'Jari manis', 'Kelingking'],
}
export const PATTERNS = [
  { name: 'Tangga Naik', seq: [1, 2, 3, 4, 5] },
  { name: 'Tangga Turun', seq: [5, 4, 3, 2, 1] },
  { name: 'Lagu Pendek', seq: [1, 3, 5, 3, 1] },
]

// Misi 6: sendi pada avatar. fix = sendi yang perlu diatur; tip = penjelasan saat benar.
export const JOINTS = [
  { id: 'bahu', name: 'Bahu', fix: true, tip: 'Bahu turun dan rileks, jangan naik ke arah telinga.' },
  { id: 'siku', name: 'Siku', fix: true, tip: 'Siku sejajar tuts, lengan bawah hampir datar.' },
  { id: 'tangan', name: 'Pergelangan', fix: true, tip: 'Pergelangan lurus, tidak patah ke bawah.' },
  { id: 'punggung', name: 'Punggung', fix: true, tip: 'Punggung tegak, duduk di separuh depan bangku.' },
  { id: 'lutut', name: 'Lutut', fix: false, tip: 'Lutut sudah baik: tertekuk sekitar 90 derajat, bukan sumber ketegangan.' },
  { id: 'kaki', name: 'Telapak kaki', fix: false, tip: 'Telapak kaki sudah menapak lantai dengan stabil.' },
]

export const VIRTUOSO_INDOOR = {
  id: 'virtuoso2', key: 'npc_virtuoso', name: 'Sang Virtuoso', x: 72, y: 96, quest: true,
  mark: (t) => !t.talk_virtuoso || !t.posture || !t.keys,
  lines: (t) => {
    if (!t.talk_virtuoso) return [
      'Jari yang tegang tak pernah melahirkan nada yang lapang. Musik dimulai dari tubuh, bukan dari tuts.',
      'Bahu naik, siku terkunci, pergelangan patah, punggung membungkuk: empat jalan pintas menuju cedera dan bunyi yang kaku.',
      'Duduklah di depan piano besar itu dan periksa avatar latihan. Temukan sendi yang perlu diatur, tapi hati-hati: tidak semua sendi bermasalah.',
    ]
    if (!t.posture) return ['Piano besar menunggumu. Cari empat sendi yang perlu diatur. Dua lainnya sudah baik, jangan diubah.']
    if (!t.keys) return [
      'Punggung jujur, jari pun menjawab. Sekarang kenali jarimu di atas tuts.',
      'Lima jari bernomor: 1 jempol, 2 telunjuk, 3 jari tengah, 4 jari manis, 5 kelingking. Di lantai ada lima tuts raksasa dengan nomor yang sama.',
      'Hampiri metronom di sisi kanan piano, lalu injak tuts sesuai pola. Salah injak, polanya mulai dari awal.',
    ]
    return ['Jemarimu kini hafal jalannya. Pelan dan rileks, begitulah virtuoso dibuat.', 'Taman Kaca Karya di seberang menunggu: di sana lagu tumbuh dari kata.']
  },
  onTalked: (scene, t) => { if (!t.talk_virtuoso) scene.completeTask('talk_virtuoso') },
}
