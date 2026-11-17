// Urutan misi aktif di panel kanan-atas. Tugas berstatus selesai bila id-nya ada di progress.tasks.
export const QUESTS = [
  { id: 'resonansi', title: 'Resonansi Nusantara', tasks: [
    ['film_galeri', 'Tonton Layar Materi'],
    ['kuis_galeri', 'Jawab Kuis Layar Materi'],
    ['meet_minang', 'Temui Maestro Minang'],
    ['touch_saluang', 'Sentuh instrumen Saluang'],
    ['hold_breath', 'Tahan ritme napas selama 10 detik'],
  ] },
  { id: 'gamelan', title: 'Dinamika Gamelan', tasks: [
    ['talk_gamelan', 'Dengarkan kisah Maestro tentang gamelan'],
    ['order_gamelan', 'Susun intensitas: Gong hingga Ceng-ceng'],
  ] },
  { id: 'genre', title: 'Detektif DNA Genre', tasks: [
    ['film_lab', 'Tonton Layar Materi'],
    ['kuis_lab', 'Jawab Kuis Layar Materi'],
    ['talk_detektif', 'Temui Detektif Nada'],
    ['sort_genre', 'Rapikan instrumen ke karpet Pop dan Rock'],
  ] },
  { id: 'ramuan', title: 'Ramuan Modern Etnik', tasks: [
    ['talk_ramuan', 'Dengarkan teka-teki Detektif Nada'],
    ['mix_ramuan', 'Racik Track 1-3 di Mixing Desk'],
  ] },
  { id: 'lorong', title: 'Menyusuri Waktu', tasks: [
    ['film_lorong', 'Tonton Layar Materi'],
    ['kuis_lorong', 'Jawab Kuis Layar Materi'],
    ['era_0', 'Dengar piringan Tradisi'],
    ['era_1', 'Dengar piringan Keroncong'],
    ['era_2', 'Dengar piringan Pop-Rock'],
    ['era_3', 'Dengar piringan Elektronik'],
  ] },
  { id: 'apresiasi', title: 'Kalibrasi Apresiasi', tasks: [
    ['film_kedap', 'Tonton Layar Materi'],
    ['kuis_kedap', 'Jawab Kuis Layar Materi'],
    ['talk_penyimak', 'Temui Penyimak Hening'],
    ['calibrate', 'Selaraskan 4 slider osiloskop'],
  ] },
  { id: 'postur', title: 'Postur Sang Maestro', tasks: [
    ['film_kibor', 'Tonton Layar Materi'],
    ['kuis_kibor', 'Jawab Kuis Layar Materi'],
    ['talk_virtuoso', 'Temui Sang Virtuoso di Panggung Kibor'],
    ['posture', 'Atur 4 sendi postur di depan piano'],
  ] },
  { id: 'tuts', title: 'Puzzle Tuts Raksasa', tasks: [
    ['keys', 'Injak tuts raksasa 1-5 sesuai pola'],
  ] },
  { id: 'syair', title: 'Jalur Pujangga', tasks: [
    ['film_taman', 'Tonton Layar Materi'],
    ['kuis_taman', 'Jawab Kuis Layar Materi'],
    ['talk_pujangga', 'Temui Pujangga Taman'],
    ['collect_words', 'Kumpulkan 8 kata bercahaya'],
    ['lyrics', 'Susun kata menjadi satu baris syair'],
  ] },
  { id: 'tumbuh', title: 'Tumbuh Kembang Melodi', tasks: [
    ['grow', 'Susun Motif, Frasa, Kalimat Lagu di pot kaca'],
  ] },
  { id: 'aula', title: 'Pagelaran Agung', tasks: [
    ['film_aula', 'Tonton Layar Materi'],
    ['kuis_aula', 'Jawab Kuis Layar Materi'],
    ['talk_manager', 'Temui House Manager di Aula'],
    ['stage', 'Atur mikrofon dan amplifier di panggung'],
  ] },
  { id: 'pagelaran', title: 'Pagelaran Impian', tasks: [
    ['talk_show', 'Temui House Manager lagi di Aula'],
    ['show', 'Rancang pagelaranmu di Meja Perancang'],
  ] },
]

const build = (q, done) => ({ id: q.id, title: q.title, tasks: q.tasks.map(([id, text]) => ({ id, text, done: !!done[id] })) })
export const isComplete = (q, done) => q.tasks.every(([id]) => done[id])
export const questById = (id, done) => build(QUESTS.find((q) => q.id === id), done)
// Misi aktif: yang sedang dikerjakan (sebagian tugas selesai) didahulukan; bila tak ada, misi tak tuntas pertama.
export function currentQuest(done) {
  const open = QUESTS.filter((x) => !isComplete(x, done))
  const q = open.find((x) => x.tasks.some(([id]) => done[id])) || open[0] || QUESTS[QUESTS.length - 1]
  return build(q, done)
}
export const questOfTask = (taskId) => QUESTS.find((q) => q.tasks.some(([id]) => id === taskId))
