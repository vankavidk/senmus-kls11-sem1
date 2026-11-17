// Misi 11: Pagelaran Impian. Empat pilihan per kategori. Tiap pilihan punya "nuansa" (tag); semakin senada, semakin padu konsepnya.
export const TAGS = {
  tradisi: { label: 'Tradisi Nusantara', color: 0xc9884a, css: '#c9884a' },
  modern: { label: 'Modern', color: 0x3fb8c9, css: '#3fb8c9' },
  klasik: { label: 'Klasik', color: 0x9d6bd6, css: '#9d6bd6' },
  santai: { label: 'Santai Akustik', color: 0x6fbf73, css: '#6fbf73' },
}

export const SHOW_CATS = [
  { id: 'stage', label: 'PANGGUNG', opts: [
    { id: 'pendopo', name: 'Pendopo', tag: 'tradisi', ket: 'Pendopo: balai kayu beratap joglo, lampu gantung hangat dan lantai bermotif batik.' },
    { id: 'neon', name: 'Studio Neon', tag: 'modern', ket: 'Panggung Neon: layar LED, lampu sorot warna-warni, dan lantai yang berpendar.' },
    { id: 'aula', name: 'Aula Megah', tag: 'klasik', ket: 'Aula Megah: tirai beludru merah, lantai kayu mengilap, dan lampu gantung kristal.' },
    { id: 'taman', name: 'Taman Senja', tag: 'santai', ket: 'Taman Senja: panggung kayu kecil di bawah langit sore dan untaian lampu hias.' },
  ] },
  { id: 'music', label: 'MUSIK', opts: [
    { id: 'gamelan', name: 'Gamelan', tag: 'tradisi', clip: 'show_gamelan', dur: 22.9, ket: 'Gamelan Saluang: gong, kempul, dan gender bersahutan dengan tiupan saluang. Tangga nada pentatonik yang syahdu.' },
    { id: 'elektro', name: 'Elektro Etnik', tag: 'modern', clip: 'show_elektro', dur: 17.5, ket: 'Elektro Etnik: ketukan mesin dan arpeggio synth berpadu seruling etnik, ramuan nusantara masa kini.' },
    { id: 'piano', name: 'Piano Klasik', tag: 'klasik', clip: 'show_piano', dur: 24.6, ket: 'Piano Klasik: arpeggio piano, gesekan lembut, dan seruling yang bernyanyi pelan.' },
    { id: 'pop', name: 'Pop Akustik', tag: 'santai', clip: 'show_pop', dur: 19.2, ket: 'Pop Akustik: petikan ukulele, ketukan ringan, dan melodi mudah dinyanyikan.' },
  ] },
  { id: 'perf', label: 'PENAMPILAN', opts: [
    { id: 'ansambel', name: 'Ansambel', tag: 'tradisi', ket: 'Ansambel tradisi: Maestro Minang di saluang, gong, gender, dan kenong mengiringi vokalmu.' },
    { id: 'band', name: 'Band', tag: 'modern', ket: 'Band: drum, gitar elektrik, dan synthesizer bersama vokalmu di depan.' },
    { id: 'solo', name: 'Solo Vokal', tag: 'klasik', ket: 'Solo vokal: hanya kamu, satu mikrofon, dan sorot lampu. Sederhana tapi penuh perhatian.' },
    { id: 'duet', name: 'Duet', tag: 'santai', ket: 'Duet: kamu bernyanyi bersama Pujangga Taman yang memetik ukulele.' },
  ] },
  { id: 'lyric', label: 'LIRIK', opts: [
    { id: 'nusantara', name: 'Nusantara', tag: 'tradisi', ket: 'Lirik tentang bambu, gong, dan nada leluhur yang menyatukan Nusantara.',
      lines: ['Dari bambu dan gong yang bersahut,', 'nada leluhur menyapa langit.', 'Tangan kita merajut irama,', 'Nusantara bernyanyi, kita satu.'] },
    { id: 'kota', name: 'Cahaya Kota', tag: 'modern', ket: 'Lirik tentang kota yang berpendar dan suara baru yang lahir dari mesin dan rasa.',
      lines: ['Lampu kota menari di layar,', 'denyut mesin berpadu rasa.', 'Kita ramu esok dari hari ini,', 'suara baru, jiwa yang sama.'] },
    { id: 'hening', name: 'Hening', tag: 'klasik', ket: 'Lirik tentang sunyi yang perlahan tumbuh menjadi nada dan rindu.',
      lines: ['Dalam sunyi, nada pertama lahir,', 'perlahan tumbuh jadi kalimat rindu.', 'Tuts demi tuts menyentuh waktu,', 'hening pun belajar bernyanyi.'] },
    { id: 'taman', name: 'Taman Melodi', tag: 'santai', ket: 'Lirik tentang sore yang hangat, kata yang mekar, dan melodi yang menenangkan hati.',
      lines: ['Sore hangat, angin membawa lagu,', 'kata-kata mekar di taman kaca.', 'Petik pelan, kita bersenandung,', 'melodi tumbuh, hati ikut tenang.'] },
  ] },
]

// Penilaian konsep dari nuansa keempat pilihan
export function judge(choice) {
  const tags = SHOW_CATS.map((c, i) => c.opts[choice[i]].tag)
  const count = {}
  tags.forEach((t) => { count[t] = (count[t] || 0) + 1 })
  const top = Object.entries(count).sort((a, b) => b[1] - a[1])[0]
  if (top[1] === 4) return { score: 100, title: 'KONSEP PADU SEMPURNA', text: `Panggung, musik, penampilan, dan lirik semuanya bernuansa ${TAGS[top[0]].label}. Pesannya utuh dan penonton langsung merasakannya.` }
  if (top[1] === 3) return { score: 95, title: 'KONSEP HAMPIR PADU', text: `Tiga unsur bernuansa ${TAGS[top[0]].label}. Satu unsur yang berbeda memberi kejutan kecil.` }
  if (count.tradisi === 2 && count.modern === 2) return { score: 92, title: 'FUSI TRADISI DAN MODERN', text: 'Dua unsur tradisi, dua unsur modern: seperti musik etnik kontemporer, berani dan seimbang.' }
  if (top[1] === 2) return { score: 85, title: 'PAGELARAN BERWARNA', text: 'Dua unsur senada, dua lainnya kontras. Menarik, tapi pesan utamanya sedikit terbelah.' }
  return { score: 75, title: 'PAGELARAN EKSPERIMENTAL', text: 'Semua unsur berbeda nuansa. Berani! Lain kali samakan rasanya agar pesan pertunjukan lebih kuat.' }
}
