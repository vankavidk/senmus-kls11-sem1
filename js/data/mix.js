// Misi 4: Ramuan Modern Etnik. Loop 4 birama (32 langkah) pada satu rangkaian akor Am - F - C - G dan satu tangga nada,
// jadi pilihan chip apa pun tetap selaras. off = pergeseran waktu (langkah): 0 = presisi mesin, selain itu = human error.
export const STEP_SEC = 0.3125            // 96 bpm, langkah = not 1/8
export const STEPS = 32
export const LOOP_SEC = STEP_SEC * STEPS  // 10 detik

const mid = (m) => 440 * 2 ** ((m - 69) / 12)
export const midiHz = mid

// akor per birama (nada MIDI): Am, F, C, G
const BARS = [
  { root: 45, tones: [57, 60, 64] },   // Am: A3 C4 E4
  { root: 41, tones: [53, 57, 60] },   // F:  F3 A3 C4
  { root: 48, tones: [60, 64, 67] },   // C:  C4 E4 G4
  { root: 43, tones: [55, 59, 62] },   // G:  G3 B3 D4
]
const bars = (fn) => BARS.flatMap((b, i) => fn(b, i * 8, i))
// pergeseran manusia: deterministik, bergantian maju/mundur, 0.12 - 0.32 langkah
const human = (i) => (i % 2 ? -1 : 1) * (0.12 + ((i * 7) % 5) * 0.05)
const org = (hits) => hits.map((h, i) => ({ ...h, off: h.off ?? human(i) }))
const D = (v, steps, extra = {}) => steps.map((step) => ({ v, step, off: 0, ...extra }))

export const CHIPS = {
  // ---------- TRACK 1: RITME (digital) ----------
  beat_pop: {
    name: 'Beat Pop', track: 0, tex: 'drum_machine', kind: 'digital',
    ket: 'Digital: kick dan snare jatuh tepat di grid, ritme pop yang mantap dan rapi.',
    hits: bars((b, s) => [...D('kick', [s, s + 4]), ...D('snare', [s + 2, s + 6]), ...D('hat', [0, 1, 2, 3, 4, 5, 6, 7].map((k) => s + k))]),
  },
  beat_disko: {
    name: 'Beat Disko', track: 0, tex: 'turntable', kind: 'digital',
    ket: 'Digital: kick di setiap ketukan, hi-hat di sela-selanya. Mesin tak pernah lelah dan tak pernah goyah.',
    hits: bars((b, s) => [...D('kick', [s, s + 2, s + 4, s + 6]), ...D('clap', [s + 2, s + 6]), ...D('ohat', [s + 1, s + 3, s + 5, s + 7])]),
  },
  beat_lofi: {
    name: 'Beat Lo-fi', track: 0, tex: 'headphones', kind: 'digital',
    ket: 'Digital: ritme santai ala lo-fi. Posisinya tetap lurus di grid walau terdengar longgar.',
    hits: bars((b, s) => [...D('kick', [s, s + 3, s + 4]), ...D('snare', [s + 2, s + 6]), ...D('hat', [s + 1, s + 3, s + 5, s + 7], { soft: true })]),
  },
  beat_etnik: {
    name: 'Beat Etnik', track: 0, tex: 'speaker', kind: 'digital',
    ket: 'Digital: pola tabuhan etnik yang diprogram mesin. Rasa nusantara, ketepatan komputer.',
    hits: bars((b, s) => [...D('tom', [s, s + 3, s + 4, s + 7]), ...D('rim', [s + 2, s + 5, s + 6]), ...D('hat', [s + 1, s + 3, s + 5, s + 7], { soft: true })]),
  },

  // ---------- TRACK 2: HARMONI (digital) ----------
  arp: {
    name: 'Arpeggio', track: 1, tex: 'synth', kind: 'digital',
    ket: 'Digital: nada akor dipetik berurutan dengan presisi. Mesin menjaga temponya tepat.',
    hits: bars((b, s) => {
      const [a, c, e] = b.tones
      return [a, c, e, a + 12, e, c, e, c].map((m, k) => ({ v: 'arp', step: s + k, off: 0, len: 1, m: [m] }))
    }),
  },
  pad: {
    name: 'Pad Lembut', track: 1, tex: 'monitor_dna', kind: 'digital',
    ket: 'Digital: lapisan akor yang panjang dan lembut, menjadi alas yang hangat untuk melodi.',
    hits: bars((b, s) => [{ v: 'pad', step: s, off: 0, len: 8, m: b.tones }]),
  },
  bass: {
    name: 'Bass Synth', track: 1, tex: 'amp', kind: 'digital',
    ket: 'Digital: garis bass yang menahan akor. Tepat di grid sehingga seluruh lagu terasa kokoh.',
    hits: bars((b, s) => {
      const r = b.root - 12
      return [[0, r, 2], [3, r, 1], [4, r + 7, 2], [6, r, 2]].map(([k, m, len]) => ({ v: 'bass', step: s + k, off: 0, len, m: [m] }))
    }),
  },
  stab: {
    name: 'Pluck Akor', track: 1, tex: 'oscilloscope', kind: 'digital',
    ket: 'Digital: sentakan akor pendek yang berirama. Setiap sentakan jatuh persis di grid.',
    hits: bars((b, s) => [0, 3, 6].map((k) => ({ v: 'stab', step: s + k, off: 0, len: 1, m: b.tones }))),
  },

  // ---------- TRACK 3: MELODI (organik, human error) ----------
  saluang: {
    name: 'Saluang', track: 2, tex: 'saluang', kind: 'organik',
    ket: 'Organik tradisional: tiupan bambu manusia. Waktunya sedikit goyah dan napasnya terasa. Itulah jiwanya.',
    hits: org([[0, 76, 3], [3, 74, 1], [4, 72, 3], [7, 69, 1], [8, 69, 4], [12, 72, 2], [14, 74, 2], [16, 76, 3], [19, 79, 1], [20, 76, 2], [22, 74, 2], [24, 74, 4], [28, 72, 2], [30, 69, 2]]
      .map(([step, m, len]) => ({ v: 'saluang', step, len, m: [m] }))),
  },
  sampe: {
    name: 'Sampe', track: 2, tex: 'sampe', kind: 'organik',
    ket: 'Organik tradisional: petikan jari manusia. Ada human error kecil yang membuatnya hidup.',
    hits: org([[0, 57], [2, 64], [3, 69], [5, 67], [6, 64], [8, 53], [10, 60], [11, 65], [13, 64], [14, 60], [16, 60], [18, 67], [19, 72], [21, 71], [22, 67], [24, 55], [26, 62], [27, 71], [29, 69], [30, 67]]
      .map(([step, m]) => ({ v: 'sampe', step, len: 1, m: [m] }))),
  },
  gender: {
    name: 'Gender', track: 2, tex: 'gender', kind: 'organik',
    ket: 'Organik tradisional: bilah logam gamelan dipukul tangan. Gemerincingnya tidak pernah persis sama.',
    hits: org([[0, 81], [2, 79], [4, 76], [6, 79], [8, 81], [10, 84], [12, 81], [14, 77], [16, 79], [18, 76], [20, 79], [22, 84], [24, 83], [26, 79], [28, 86], [30, 79]]
      .map(([step, m]) => ({ v: 'gender', step, len: 1, m: [m] }))),
  },
  gong: {
    name: 'Gong Kempul', track: 2, tex: 'gong', kind: 'organik',
    ket: 'Organik tradisional: gong menandai awal, kempul dan kenong menyahut. Dipukul manusia, napasnya sedikit melenceng.',
    hits: org(BARS.flatMap((b, i) => [
      { v: 'gong', step: i * 8, len: 4, m: [b.root - 12] },
      { v: 'kempul', step: i * 8 + 4, len: 2, m: [b.root + 12] },
      { v: 'kenong', step: i * 8 + 6, len: 1, m: [b.root + 24] },
    ])),
  },
}

export const TRACKS = [
  { label: 'TRACK 1', role: 'RITME', need: 'digital', sub: 'Presisi digital', options: ['beat_pop', 'beat_disko', 'beat_lofi', 'beat_etnik'] },
  { label: 'TRACK 2', role: 'HARMONI', need: 'digital', sub: 'Presisi digital', options: ['arp', 'pad', 'bass', 'stab'] },
  { label: 'TRACK 3', role: 'MELODI', need: 'organik', sub: 'Organik tradisional', options: ['saluang', 'sampe', 'gender', 'gong'] },
]
