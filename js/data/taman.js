// Taman Kaca Karya (peta 320x192, taman.png)
export const TAMAN = {
  w: 320, h: 192, spawn: { x: 160, y: 160 },
  colliders: [[0, 0, 320, 52], [0, 0, 8, 192], [312, 0, 8, 192], [0, 184, 144, 8], [176, 184, 144, 8], [124, 94, 72, 22], [24, 66, 28, 12], [270, 66, 28, 12], [24, 156, 28, 12], [270, 156, 28, 12], [248, 108, 26, 14]],
  exit: { x: 160, y: 180 }, pot: { x: 262, y: 128 },
}

// Misi 8: kalimat syair dan 8 kata bercahaya (posisi kaki; urutan posisi = urutan acak untuk pemain)
export const LYRIC = {
  words: ['Melodi', 'lahir', 'dari', 'sunyi', 'lalu', 'mekar', 'jadi', 'lagu'],
  clue: 'Lagu bermula dari hening, lalu bertumbuh.',
  spots: [{ x: 38, y: 118 }, { x: 102, y: 86 }, { x: 150, y: 70 }, { x: 214, y: 76 }, { x: 288, y: 100 }, { x: 290, y: 140 }, { x: 214, y: 144 }, { x: 100, y: 144 }],
}

// Misi 9: tiga blok melodi. notes = indeks tangga nada C (0=C ... 7=C tinggi)
export const GROW_FREQ = [261.6, 293.7, 329.6, 349.2, 392, 440, 493.9, 523.3]
// Motif (E G A G) -> Frasa (motif + jawaban) -> Kalimat lagu (frasa + kontras + penutup di C). Audio: assets/audio/clips/grow_*.mp3
export const GROW = [
  { id: 'motif', name: 'MOTIF', w: 36, clip: 'grow_motif', notes: [2, 4, 5, 4], desc: 'Motif: ide musik terkecil, hanya beberapa nada. Ini bibit lagunya.' },
  { id: 'frasa', name: 'FRASA', w: 72, clip: 'grow_frasa', notes: [2, 4, 5, 4, 2, 4, 3, 2], desc: 'Frasa: motif disambung jawabannya, seperti pertanyaan dan jawaban.' },
  { id: 'kalimat', name: 'KALIMAT LAGU', w: 140, clip: 'grow_kalimat', notes: [2, 4, 5, 4, 2, 4, 3, 2, 5, 7, 6, 5, 4, 3, 1, 0], desc: 'Kalimat lagu: frasa, kontras yang menanjak, lalu penutup yang tuntas di nada C.' },
]

export const PUJANGGA_INDOOR = {
  id: 'pujangga2', key: 'npc_pujangga', name: 'Pujangga Taman', x: 60, y: 100, quest: true,
  mark: (t) => !t.talk_pujangga || !t.lyrics || !t.grow,
  lines: (t) => {
    if (!t.talk_pujangga) return [
      'Kata-kata di taman ini berbunga lalu terbang. Aku menulis satu baris syair, tapi angin menyebar kata-katanya ke seluruh kaca.',
      'Syairku tentang melodi: ia lahir dari sunyi, lalu mekar menjadi lagu. Delapan kata bercahaya, tangkaplah satu per satu dengan berjalan menyentuhnya.',
      'Bila semuanya sudah di tanganmu, susunlah menjadi baris yang utuh. Syair punya jalur: awal, tumbuh, dan tuntas.',
    ]
    if (!t.collect_words) return ['Delapan kata bercahaya masih melayang di taman. Berjalanlah menyentuhnya, jangan biarkan angin membawanya pergi.']
    if (!t.lyrics) return ['Semua kata sudah kau genggam. Susunlah: lagu bermula dari hening, lalu bertumbuh.']
    if (!t.grow) return [
      'Syairmu indah. Sekarang dengarkan bagaimana melodi tumbuh.',
      'Dari satu motif kecil, lahir frasa. Dari frasa-frasa, lahir kalimat lagu yang utuh. Seperti biji, tunas, lalu pohon.',
      'Hampiri pot kaca di sisi kanan taman. Susun tiga blok dari yang terkecil.',
    ]
    return ['Dari motif sekecil biji, kau menumbuhkan satu lagu. Itulah mencipta.', 'Aula Pagelaran Agung menunggu. Di sana semua yang kau pelajari diuji di atas panggung.']
  },
  onTalked: (scene, t) => {
    if (!t.talk_pujangga) { scene.completeTask('talk_pujangga'); scene.spawnWords() }
    else if (t.collect_words && !t.lyrics) scene.openLyrics()
  },
}
