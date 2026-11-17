// Film materi di tiap rumah. Teks memakai penanda [id:kata]: saat narasi mengetik kata itu,
// benda dengan id yang sama muncul di layar ("id!aksi" memberi perintah ke benda). Koordinat kanvas 384x216; area gambar y 34-148.
const sp = (id, key, x, y, s = 3, label, extra = {}) => ({ id, kind: 'sprite', key, x, y, s, label, ...extra })
const pr = (id, kind, x, y, extra = {}) => ({ id, kind, x, y, ...extra })

export const FILMS = {
  galeri: {
    title: 'Napas Nusantara', subtitle: 'MATERI 1 · MUSIK NUSANTARA', guide: 'Maestro Minang',
    intro: 'Selamat datang di layar materi. Mari mendengar Nusantara dengan mata yang ikut menyimak.',
    scenes: [
      { bg: [0x5b4570, 0xf594b5], text: 'Nusantara adalah [peta:untaian pulau] dengan ribuan suara. Dari [sumatra:Sumatra Barat] hingga [bali:Bali], tiap daerah menyimpan bunyinya sendiri.',
        props: [pr('peta', 'peta', 192, 92, { initial: true }), pr('sumatra', 'pin', 146, 82, { label: 'SUMATRA BARAT', ly: 6 }), pr('bali', 'pin', 236, 104, { label: 'BALI', ly: 6 })] },
      { bg: [0x4ea08a, 0xa8e8d3], text: 'Di Minangkabau, [saluang:saluang] ditiup dari bambu tipis. Peniupnya memakai teknik [napas:manyisian angok]: menarik napas lewat hidung sambil bunyi terus mengalir.',
        props: [sp('saluang', 'saluang', 110, 92, 3, 'SALUANG'), pr('napas', 'breath', 268, 90, { label: 'MANYISIAN ANGOK' })] },
      { bg: [0x5b4570, 0x8c76b8], text: 'Hasilnya, bunyi [sungai:mengalir tanpa putus] seperti sungai. Gelombangnya bersambung, tak berhenti sebelum sang peniup selesai bercerita.',
        props: [pr('sungai', 'wave', 192, 90, { w: 250, amp: 16, label: 'BUNYI TAK PUTUS', ly: 28 })] },
      { bg: [0xc96890, 0xffd467], text: 'Di Bali, [gamelan:gamelan] bergaya kebyar bermain dengan kontras tajam: dari [gong:Gong] yang berat dan panjang, lewat [kempul:kempul] dan [kenong:kenong], hingga [cengceng:ceng-ceng] yang pendek, tinggi, dan meledak-ledak.',
        props: [sp('gong', 'gong', 64, 58, 2.5, 'GONG'), sp('kempul', 'kempul', 138, 58, 2.5, 'KEMPUL'), sp('kenong', 'kenong', 208, 62, 2.5, 'KENONG'), sp('cengceng', 'cengceng', 286, 64, 2.5, 'CENG-CENG'),
          pr('gamelan', 'bar', 192, 128, { w: 270, label: 'RENDAH  ...  TINGGI', ly: 9 })] },
      { bg: [0x7561ad, 0xa8e8d3], text: 'Tradisi bukan benda yang membeku. Ia [napas:napas yang diwariskan], dan kini giliranmu untuk menyimaknya.',
        props: [pr('napas', 'breath', 192, 90, { label: 'DIWARISKAN', ly: 32 })] },
    ],
  },

  lab: {
    title: 'DNA Sebuah Genre', subtitle: 'MATERI 2 · GENRE MUSIK', guide: 'Detektif Nada',
    intro: 'Setiap lagu punya sidik jari. Mari kita periksa DNA sebuah genre.',
    scenes: [
      { bg: [0x4a3860, 0x9fd3f5], text: 'Setiap [genre:genre] punya DNA: tempo, warna bunyi, tenaga, dan suasana yang membedakannya dari yang lain.',
        props: [pr('genre', 'dna', 192, 92, { label: 'DNA GENRE', ly: 52 })] },
      { bg: [0x8c76b8, 0xffb9d1], text: '[pop:Pop] terasa menengah dan rileks. [akustik:Gitar akustik] dan suara yang jernih mengajak kita bernyanyi bersama.',
        props: [sp('akustik', 'gitar_akustik', 112, 86, 3, 'GITAR AKUSTIK'), pr('pop', 'wave', 268, 90, { w: 130, amp: 10, color: 0xa8e8d3, label: 'POP: MENENGAH, RILEKS', ly: 24 })] },
      { bg: [0x3a2a4d, 0xc96890], text: '[rock:Rock] menghentak dan agresif. [elektrik:Gitar elektrik] yang berdistorsi dan [drum:drum] yang lantang membuat dada ikut bergetar.',
        props: [sp('elektrik', 'gitar_elektrik', 96, 86, 3, 'GITAR ELEKTRIK'), sp('drum', 'drum_kit', 190, 92, 3, 'DRUM'), pr('rock', 'wave', 300, 90, { w: 110, amp: 10, jag: 12, color: 0xf27a8c, speed: 5, label: 'ROCK: MENGHENTAK', ly: 24 })] },
      { bg: [0x5b4570, 0x7561ad], text: 'Bedanya terdengar pada cara bunyi bergerak: [pop:Pop mengalir tenang], [rock:Rock bergerigi dan bertenaga]. Genre dikenali dari telinga yang jeli menyimak ciri-cirinya.',
        props: [pr('pop', 'wave', 130, 92, { w: 150, amp: 10, color: 0xa8e8d3, label: 'POP', ly: 26 }), pr('rock', 'wave', 262, 92, { w: 100, amp: 10, jag: 12, color: 0xf27a8c, speed: 5, label: 'ROCK', ly: 26 })] },
    ],
  },

  lorong: {
    title: 'Piringan Waktu', subtitle: 'MATERI 3 · MUSIK ETNIK MODERN', guide: 'Penjaga Lorong',
    intro: 'Lorong ini menyimpan waktu. Setiap piringan hitam adalah satu zaman bunyi.',
    scenes: [
      { bg: [0x3a2a4d, 0x8c76b8], text: 'Musik berjalan melewati [piringan:waktu], seperti piringan hitam yang terus berputar dan membawa suara dari satu zaman ke zaman lain.',
        props: [sp('piringan', 'turntable', 192, 92, 4, 'PIRINGAN WAKTU')] },
      { bg: [0x7a5a38, 0xffd467], text: 'Dahulu bunyi lahir dari alat [saluang:tradisional] seperti saluang, [sampe:sampe], dan [gender:gender] gamelan, dimainkan langsung oleh tangan manusia.',
        props: [sp('saluang', 'saluang', 88, 90, 3, 'SALUANG'), sp('sampe', 'sampe', 200, 96, 3, 'SAMPE'), sp('gender', 'gender', 308, 94, 3, 'GENDER')] },
      { bg: [0x4a3860, 0x9fd3f5], text: 'Lalu datang [band:era band] dengan gitar listrik dan [drum:drum], kemudian [digital:mesin digital]: [synth:synthesizer] dan [dm:drum machine] yang presisi.',
        props: [sp('band', 'gitar_elektrik', 56, 86, 3, 'GITAR LISTRIK'), sp('drum', 'drum_kit', 126, 92, 3, 'DRUM'), sp('synth', 'synth', 232, 92, 3, 'SYNTHESIZER'), sp('dm', 'drum_machine', 322, 92, 3, 'DRUM MACHINE')] },
      { bg: [0x5b4570, 0xffb9d1], text: 'Musik [etnik:etnik modern], seperti garapan [alffy:Alffy Rev], memadukan [presisi:presisi digital] yang rapi dengan [human:napas organik] yang tak pernah sempurna.',
        props: [pr('presisi', 'beats', 130, 90, { n: 5, label: 'PRESISI DIGITAL', ly: 26 }), pr('human', 'beats', 262, 90, { n: 5, jitter: 5, color: 0xffb9d1, label: 'HUMAN ERROR ORGANIK', ly: 26 })] },
      { bg: [0x7561ad, 0xa8e8d3], text: 'Presisi memberi [presisi:kerangka], ketidaksempurnaan memberi [human:jiwa]. Dari keduanya lahir bunyi yang terasa baru, tetapi tetap pulang.',
        props: [pr('presisi', 'beats', 130, 90, { n: 5, label: 'KERANGKA', ly: 26 }), pr('human', 'beats', 262, 90, { n: 5, jitter: 5, color: 0xffb9d1, label: 'JIWA', ly: 26 })] },
    ],
  },

  kedap: {
    title: 'Mendengar dengan Rasa', subtitle: 'MATERI 4 · APRESIASI MUSIK', guide: 'Penyimak Hening',
    intro: 'Di ruang ini dunia dipelankan. Mari belajar menyimak, bukan sekadar mendengarkan.',
    scenes: [
      { bg: [0x2d1f3d, 0x7561ad], text: '[dengar:Mendengar] itu pasif: bunyi masuk begitu saja. [simak:Menyimak] itu perseptif: kita memilih apa yang diperhatikan dan bertanya apa yang sedang terjadi.',
        props: [pr('dengar', 'wave', 100, 92, { w: 120, amp: 4, color: 0x8c76b8, label: 'MENDENGAR (PASIF)', ly: 22 }), sp('simak', 'headphones', 284, 90, 4, 'MENYIMAK (PERSEPTIF)')] },
      { bg: [0x4a3860, 0xc1aae8], text: 'Ada empat hal yang bisa disimak: [nada:nada], tinggi rendah bunyi; [irama:irama], denyut waktunya; [melodi:melodi], garis lagunya; dan [harmoni:harmoni], bunyi yang berpadu.',
        props: [pr('nada', 'staff', 62, 90, { w: 60, notes: [3], label: 'NADA', ly: 28 }), pr('irama', 'beats', 150, 90, { n: 4, label: 'IRAMA', ly: 28 }),
          pr('melodi', 'staff', 246, 90, { w: 84, notes: [0, 2, 4, 3, 1, 2], label: 'MELODI', ly: 28 }), pr('harmoni', 'chord', 332, 90, { label: 'HARMONI', ly: 28 })] },
      { bg: [0x2d1f3d, 0x4ea08a], text: 'Di [osc:osiloskop], lagu yang sumbang tampak sebagai gelombang yang kusut. Saat nada dan melodi selaras, gelombangnya menjadi [osc!mulus:mulus dan harmonis].',
        props: [pr('osc', 'osc', 192, 90, { label: 'OSILOSKOP', ly: 40 })] },
      { bg: [0x7561ad, 0xffb9d1], text: 'Mengapresiasi berarti mendengar dengan [rasa:rasa dan pikiran]: apa yang kurasakan, apa yang dibangun penciptanya, dan mengapa bunyi itu terasa begini.',
        props: [sp('rasa', 'star_note', 192, 90, 7, 'RASA DAN PIKIRAN', { ly: 40 })] },
    ],
  },

  kibor: {
    title: 'Tubuh yang Bermain', subtitle: 'MATERI 5 · TEKNIK KIBOR', guide: 'Sang Virtuoso',
    intro: 'Sebelum satu nada berbunyi, tubuhmu sudah bermain. Perhatikan sosok di layar ini.',
    scenes: [
      { bg: [0x5b4570, 0xc1aae8], text: '[postur:Postur] yang baik membuat jari bebas dan nada lapang. Duduklah dengan [punggung:punggung tegak alami], bukan kaku seperti papan.',
        props: [pr('postur', 'posture', 150, 84, { initial: true }), pr('punggung', 'ring', 150, 102, { r: 12, label: 'PUNGGUNG TEGAK', ly: 18 })] },
      { bg: [0x5b4570, 0xc1aae8], text: '[bahu:Bahu] turun dan rileks. [siku:Siku] sejajar tuts dengan sudut yang wajar, dan [tangan:pergelangan] tetap lurus, tidak patah ke bawah.',
        props: [pr('postur', 'posture', 150, 84, { initial: true }), pr('bahu', 'ring', 150, 76, { r: 8, label: 'BAHU RILEKS', ly: -34 }), pr('siku', 'ring', 170, 100, { r: 8, label: 'SIKU SEJAJAR', ly: 14 }), pr('tangan', 'ring', 206, 102, { r: 8, label: 'PERGELANGAN LURUS', ly: -26 })] },
      { bg: [0x7561ad, 0xffd467], text: 'Lima jari punya nomor: [j1:1 untuk jempol], 2 telunjuk, 3 jari tengah, 4 jari manis, dan [j5:5 untuk kelingking].',
        props: [pr('keys', 'keys', 192, 92, { initial: true }), pr('j1', 'keyhl', 144, 92, { label: 'JEMPOL', ly: 30 }), pr('j5', 'keyhl', 240, 92, { label: 'KELINGKING', ly: 30 })] },
      { bg: [0x7561ad, 0xffd467], text: 'Tuts di sisi kiri menghasilkan nada [rendah:rendah], tuts di sisi kanan menghasilkan nada [tinggi:tinggi]. Pada tangan kanan, jari 1 menjemput nada terendah dan jari 5 nada tertinggi.',
        props: [pr('keys', 'keys', 192, 100, { initial: true }), pr('rendah', 'big', 84, 56, { text: 'RENDAH', size: 12 }), pr('tinggi', 'big', 300, 56, { text: 'TINGGI', size: 12 })] },
    ],
  },

  taman: {
    title: 'Biji Menjadi Taman', subtitle: 'MATERI 6 · KREASI MELODI', guide: 'Pujangga Taman',
    intro: 'Lagu tumbuh seperti tanaman. Mari lihat bagaimana sebutir biji menjadi taman.',
    scenes: [
      { bg: [0x4ea08a, 0xa8e8d3], text: 'Lagu bermula dari biji kecil bernama [motif:motif]: beberapa nada yang menjadi ide dasarnya.',
        props: [pr('seed', 'seed', 120, 96, { initial: true }), pr('motif', 'staff', 262, 92, { w: 90, notes: [0, 1, 2, 0], label: 'MOTIF', ly: 28 })] },
      { bg: [0x4ea08a, 0xa8e8d3], text: 'Dua motif yang saling bertanya dan menjawab tumbuh menjadi [frasa:frasa].',
        props: [pr('frasa', 'staff', 192, 92, { w: 190, notes: [0, 1, 2, 0, 2, 3, 4, 4], label: 'FRASA', ly: 28 })] },
      { bg: [0x7561ad, 0xffb9d1], text: 'Beberapa frasa yang tuntas bersambung membentuk [kalimat:kalimat lagu] yang utuh.',
        props: [pr('kalimat', 'staff', 192, 92, { w: 300, notes: [0, 1, 2, 0, 2, 3, 4, 4, 4, 5, 4, 3, 2, 1, 0, 0], label: 'KALIMAT LAGU', ly: 28 })] },
      { bg: [0xc96890, 0xffd467], text: 'Syair pun begitu: [kata:kata] dirangkai menjadi [baris:baris], dan baris-baris menjadi bait yang bermakna.',
        props: [pr('kata', 'big', 92, 92, { text: 'SUNYI', size: 14, label: 'KATA', ly: 22 }), pr('baris', 'big', 262, 92, { text: 'MELODI LAHIR\nDARI SUNYI', size: 10, label: 'BARIS', ly: 28 })] },
    ],
  },

  aula: {
    title: 'Sebelum Tirai Terbuka', subtitle: 'MATERI 7 · MANAJEMEN PAGELARAN', guide: 'House Manager',
    intro: 'Pagelaran dimulai jauh sebelum tirai terbuka. Mari lihat tata letak panggung yang sehat.',
    scenes: [
      { bg: [0x5b4570, 0xc96890], text: 'Pagelaran yang baik dimulai dari [tata:tata letak panggung] yang rapi, agar setiap bunyi sampai ke penonton tanpa gangguan.',
        props: [pr('tata', 'stage', 192, 80, { w: 230, h: 66 })] },
      { bg: [0x4a3860, 0xc1aae8], text: 'Instrumen [akustik:akustik] menghasilkan bunyi langsung dari badannya. Letakkan di depan [mik:mikrofon] agar bunyi alaminya tertangkap.',
        props: [sp('akustik', 'gitar_akustik', 120, 88, 3, 'GITAR AKUSTIK'), sp('mik', 'mic_stand', 258, 90, 4, 'MIKROFON')] },
      { bg: [0x2d1f3d, 0x7561ad], text: 'Instrumen [elektrik:non-akustik] seperti synthesizer menghasilkan sinyal listrik. [kabel:Sambungkan kabelnya] ke [amp:amplifier] agar bunyinya bisa diperkeras.',
        props: [sp('elektrik', 'synth', 80, 98, 3, 'SYNTHESIZER'), sp('amp', 'amp', 306, 92, 4, 'AMPLIFIER'), pr('kabel', 'cable', 0, 0, { pts: [[104, 106], [104, 124], [290, 124], [290, 102]] })] },
      { bg: [0x3a2a4d, 0xc96890], text: 'Bila tata letak salah, mikrofon menangkap suara pengeras sendiri dan terjadilah [feedback:feedback], lengkingan yang menyiksa telinga.',
        props: [sp('mik', 'mic_stand', 108, 90, 4, 'MIKROFON', { initial: true }), sp('spk', 'speaker', 290, 90, 4, 'PENGERAS', { initial: true }), pr('feedback', 'feedback', 198, 90, { label: 'FEEDBACK', ly: 46 })] },
      { bg: [0x7561ad, 0xffd467], text: 'Panggung yang rapi mempertemukan musik dan penonton dalam [harmoni:harmoni]. Kini giliranmu menjadi House Manager.',
        props: [sp('harmoni', 'star_note', 192, 90, 7, 'HARMONI', { ly: 40 })] },
    ],
  },
}
