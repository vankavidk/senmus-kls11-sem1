// Data dunia "Akademi Melodi Eunoia". Koordinat piksel dunia (peta 352x256), sesuai alun_bg.png.
export const SPAWN = { x: 176, y: 160 }

// [x, y, w, h] area yang tidak bisa ditembus
const bld = (bx, by) => [bx + 1, by + 8, 46, 36]
const tree = (x, y) => [x + 9, y + 23, 8, 6]
const bush = (x, y) => [x + 1, y + 4, 12, 7]
const rock = (x, y) => [x + 1, y + 3, 10, 5]

export const COLLIDERS = [
  [0, 0, 352, 14], [0, 242, 352, 14],                       // pagar tanaman atas & bawah
  bld(56, 40), bld(108, 40), bld(200, 40), bld(256, 40),    // bangunan atas
  bld(56, 164), bld(108, 164), bld(200, 164),               // bangunan bawah
  [20, 62, 20, 20],                                         // beringin
  [158, 108, 36, 20],                                       // air mancur
  [139, 115, 6, 5], [207, 115, 6, 5],                       // tiang lampu
  [140, 125, 20, 8], [192, 125, 20, 8],                     // bangku
  tree(312, 38), tree(328, 62), tree(6, 150), tree(4, 190), tree(300, 160), tree(320, 190), tree(258, 168),
  bush(104, 70), bush(252, 72), bush(306, 76), bush(46, 190), bush(152, 196), bush(250, 190),
  rock(24, 124), rock(284, 140),
]

// Pintu lokasi: titik interaksi di depan pintu (x,y = titik kaki pemain).
const door = (id, name, bx, by) => ({ id, name, x: bx + 24, y: by + 54 })
export const DOORS = [
  door('galeri', 'Galeri Etnik Nusantara', 56, 40),
  door('lab', 'Lab DNA Genre', 108, 40),
  door('lorong', 'Lorong Waktu Evolusi', 200, 40),
  door('kedap', 'Ruang Kedap Apresiasi', 256, 40),
  door('taman', 'Taman Kaca Karya', 56, 164),
  door('kibor', 'Panggung Latihan Kibor', 108, 164),
  door('aula', 'Aula Pagelaran Agung', 200, 164),
]

// Daftar 10 misi untuk Buku Rapor (status diisi dari Storage)
export const MISSIONS = [
  { id: 1, title: 'Misteri Napas Tak Terputus', place: 'Galeri Etnik' },
  { id: 2, title: 'Dinamika Gamelan', place: 'Galeri Etnik' },
  { id: 3, title: 'Detektif DNA Genre', place: 'Lab DNA Genre' },
  { id: 4, title: 'Ramuan Modern Etnik', place: 'Lab DNA Genre' },
  { id: 5, title: 'Kalibrasi Apresiasi', place: 'Ruang Kedap Apresiasi' },
  { id: 6, title: 'Postur Sang Maestro', place: 'Panggung Kibor' },
  { id: 7, title: 'Puzzle Tuts Raksasa', place: 'Panggung Kibor' },
  { id: 8, title: 'Merangkai Jalur Pujangga', place: 'Taman Kaca' },
  { id: 9, title: 'Tumbuh Kembang Melodi', place: 'Taman Kaca' },
  { id: 10, title: 'Manajemen Pagelaran Agung', place: 'Aula Pagelaran' },
]
