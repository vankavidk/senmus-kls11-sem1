// Posisi (x,y) = titik kaki NPC di koordinat dunia. Dialog Tahap 1 hanya sapaan; misi hadir di tahap berikutnya.
export const NPCS = [
  {
    id: 'minang', key: 'npc_maestro_minang', name: 'Maestro Minang', x: 62, y: 104, quest: true, mark: (t) => !t.meet_minang,
    lines: [
      'Udara di sini terasa salah, bukan? Saluang ini kehilangan jiwanya. Teknik meniup biasa takkan membangkitkan resonansinya.',
      'Dalam tradisi kami, napas tak boleh putus. Ia harus mengalir seperti sungai, ditiup dan ditarik dalam satu tarikan napas memutar, manyisian angok.',
      'Masuklah ke Galeri di belakangku. Sentuh bambu itu, rasakan ritmenya, dan selaraskan tarikan napasmu.',
    ],
    onTalked: (scene) => scene.completeTask('meet_minang'),
  },
  {
    id: 'detektif', key: 'npc_detektif_nada', name: 'Detektif Nada', x: 112, y: 106, quest: true, mark: (t) => !t.talk_detektif,
    lines: ['Setiap genre meninggalkan sidik jari di dalam bunyi. Tugasku mengendusnya.', 'Masuklah ke labku, di pintu sebelah. Ada instrumen yang tersesat dan hanya telingamu yang bisa menuntunnya pulang.'],
    onTalked: (scene) => scene.completeTask('talk_detektif'),
  },
  {
    id: 'virtuoso', key: 'npc_virtuoso', name: 'Sang Virtuoso', x: 132, y: 233, quest: true,
    mark: (t) => !t.talk_virtuoso || !t.posture || !t.keys,
    lines: ['Jari yang tegang tak pernah melahirkan nada yang lapang.', 'Masuklah ke Panggung Latihan Kibor di belakangku. Duduklah dengan punggung yang jujur, piano akan menjawab seperti sahabat lama.'],
  },
  {
    id: 'pujangga', key: 'npc_pujangga', name: 'Pujangga Taman', x: 80, y: 233, quest: true,
    mark: (t) => !t.talk_pujangga || !t.lyrics || !t.grow,
    lines: ['Kata-kata di taman ini berbunga lalu terbang. Masuklah ke Taman Kaca Karya di belakangku dan tangkaplah satu per satu sebelum angin mengambilnya.', 'Dari satu motif kecil, lagu pelan-pelan tumbuh.'],
  },
  {
    id: 'manager', key: 'npc_house_manager', name: 'House Manager', x: 224, y: 233, quest: true,
    mark: (t) => !t.stage,
    lines: ['Panggung ini berantakan, dan satu jam lagi tirai terbuka.', 'Masuklah ke Aula Pagelaran Agung di belakangku. Kabel, mikrofon, amplifier: semuanya menunggu tangan yang tahu tempatnya.'],
  },
]

// Maestro Minang di dalam Galeri: dialog berubah mengikuti progres.
export const MAESTRO_INDOOR = {
  id: 'minang2', key: 'npc_maestro_minang', name: 'Maestro Minang', x: 190, y: 138, quest: true,
  mark: (t) => !t.hold_breath || !t.talk_gamelan || !t.order_gamelan,
  lines: (t) => {
    if (!t.hold_breath) return [
      'Lihat bambu di atas penyangga itu. Ia sudah seratus tahun menunggu napas yang tak putus.',
      'Jangan meniupnya seperti meniup lilin. Hembuskan seperti sungai yang tak pernah kehabisan hulu.',
      'Saat napasmu hampir habis, tariklah lewat hidung sambil tetap meniup lewat pipi. Itu manyisian angok. Sentuh saluangnya bila kau siap.',
    ]
    if (!t.talk_gamelan) return [
      'Kau sudah menjaga sungai itu tetap mengalir. Telingaku bangga.',
      'Kini dengarkan saudara kami dari Bali. Di gamelan kebyar, bunyi tak berjalan lurus: ia meledak, mereda, lalu meledak lagi.',
      'Kuncinya intensitas. Gong menggantung rendah dan gaungnya panjang seperti napas bumi. Ceng-ceng tinggi, pendek, dan tajam seperti percikan api.',
      'Susunlah tabuhan dari yang paling dalam hingga yang paling menyala. Telinga akan menuntunmu, bukan mata. Hampiri panggung gamelan di sebelah kiri.',
    ]
    if (!t.order_gamelan) return ['Panggung gamelan menunggumu di sebelah kiri. Mulailah dari gaung yang paling panjang dan nada yang paling rendah.']
    return ['Gong, kempul, kenong, gender, ceng-ceng: kau telah mendengar bunyi menanjak seperti api yang tumbuh.', 'Lab DNA Genre di seberang alun-alun akan membuka telingamu pada dunia yang lain. Pergilah, Nak.']
  },
  onTalked: (scene, t) => { if (t.hold_breath && !t.talk_gamelan) scene.completeTask('talk_gamelan') },
}

// Detektif Nada di dalam Lab DNA Genre.
export const DETEKTIF_INDOOR = {
  id: 'detektif2', key: 'npc_detektif_nada', name: 'Detektif Nada', x: 160, y: 124, quest: true,
  mark: (t) => !t.talk_detektif || !t.sort_genre || !t.talk_ramuan || !t.mix_ramuan,
  lines: (t) => {
    if (!t.talk_detektif) return [
      'Setiap lagu meninggalkan sidik jari di udara: tempo, tekstur, tenaga. Aku hanya membacanya.',
      'Pop itu napas sore, menengah dan rileks, seperti berjalan pelan setelah hujan. Rock itu denyut dada yang menghentak, agresif, ingin didengar.',
      'Instrumen di lab ini tercerai-berai. Letakkan masing-masing di karpet genre yang menjadi rumahnya. Dengarkan dulu, jangan menebak dari rupa. Hampiri karpet di sisi kiri.',
    ]
    if (!t.sort_genre) return ['Karpet Pop dan Rock menunggumu di sisi kiri. Ketuk instrumen untuk mendengarnya, lalu seret ke rumahnya.']
    if (!t.talk_ramuan) return [
      'Telingamu tajam, Nak. Sekarang teka-teki yang lebih nakal.',
      'Ada musisi muda yang meramu bunyi etnik dengan mesin, seperti Alffy Rev menyulam nusantara ke dalam layar.',
      'Rahasianya pembagian tugas. Mesin menjaga tempo setepat jam: drum machine, synthesizer. Tangan manusia dan bambu leluhur memberi napas yang sedikit goyah. Goyahnya itu justru jiwa.',
      'Di Mixing Desk sana, isi Track 1 dan 2 dengan bunyi presisi digital, dan Track 3 dengan instrumen tradisional yang ber-human error. Lalu putar racikanmu.',
    ]
    if (!t.mix_ramuan) return ['Mixing Desk ada di sisi kanan. Dua jalur untuk mesin yang presisi, satu jalur untuk napas manusia.']
    return ['Mesin dan leluhur kini bernyanyi satu lagu. Itulah musik nusantara hingga kontemporer.', 'Ruang Kedap Apresiasi menunggu: di sana kau belajar mendengar, bukan sekadar mendengar-dengar.']
  },
  onTalked: (scene, t) => {
    if (!t.talk_detektif) scene.completeTask('talk_detektif')
    else if (t.sort_genre && !t.talk_ramuan) scene.completeTask('talk_ramuan')
  },
}
