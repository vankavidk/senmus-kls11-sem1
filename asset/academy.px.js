// MELODY ACADEMY: THE INNER SYMPHONY — aset pixel art (pastel, top-down, 16x16 grid)
pal({
  k: "#3a2a4d", K: "#5b4570", w: "#fffaf0",
  // rumput mint
  g: "#c4ecaa", G: "#9bdb9b", H: "#74be8c", I: "#4f9a78",
  // lilac
  l: "#e2d4f7", L: "#c1aae8", M: "#9d86cf", N: "#7561ad",
  // blush pink
  p: "#ffdce8", P: "#ffb9d1", Q: "#f594b5", R: "#c96890",
  // pasir / jalan
  s: "#fbeed3", S: "#ecd3a6", T: "#cfaa75",
  // kayu
  o: "#e0a96d", O: "#b97c4a", b: "#8a5a3c",
  // air
  a: "#c8eef7", A: "#93d6ee", B: "#64b8de",
  // emas
  y: "#fff0b0", Y: "#ffd467", Z: "#e9aa3d", f: "#fff7b8",
  // kulit
  u: "#ffe0c6", U: "#f2bc98", v: "#dba679", V: "#bc8258", x: "#8f5d3e", X: "#6e4228",
  // rambut
  d: "#43323f", D: "#271b2b", e: "#835240", E: "#5c3626", n: "#f0cf8a", F: "#d1ad5f",
  // mint pakaian
  t: "#a8e8d3", q: "#72c7ae", i: "#4ea08a",
  // biru
  c: "#aec4f5", C: "#7c98dc",
  // merah minang
  m: "#d8566f", r: "#a63a58", j: "#7561ad", J: "#c96890",
  W: "#ffffff", z: "#ff9fb8", h: "#43323f",
})
ramps("kKNMLlw", "IHGg", "RQPp", "TSs", "bOo", "BAa", "ZYy", "XxvVU", "VvUu", "rm", "iqt", "CcW")

// =============================================================
// TILES 16x16
// =============================================================
const tuft = (c, x, y, col = "g") => { c.px(x, y, col); c.px(x - 1, y + 1, col); c.px(x + 1, y + 1, col) }
sprite("tile_grass", { w: 16, h: 16 }, rect(0, 0, 16, 16, "G"),
  (c) => { tuft(c, 3, 3); tuft(c, 11, 7); tuft(c, 6, 12, "H"); tuft(c, 13, 13) })
sprite("tile_grass2", { w: 16, h: 16 }, rect(0, 0, 16, 16, "G"),
  (c) => { tuft(c, 8, 2, "H"); tuft(c, 2, 9); tuft(c, 12, 11); tuft(c, 14, 3) })
sprite("tile_grass_flower", { base: "tile_grass2" }, px(4, 5, "W"), px(3, 5, "P"), px(5, 5, "P"), px(4, 4, "P"), px(4, 6, "P"), px(4, 5, "Y"),
  px(11, 12, "y"), px(10, 12, "Q"), px(12, 12, "Q"), px(11, 11, "Q"), px(11, 13, "Q"), px(11, 12, "Y"))
sprite("tile_path", { w: 16, h: 16 }, rect(0, 0, 16, 16, "s"),
  px(3, 3, "S"), px(4, 3, "S"), px(11, 6, "S"), px(12, 6, "S"), px(6, 12, "S"), px(7, 12, "S"), px(13, 13, "T"), px(2, 9, "T"))
sprite("tile_plaza", { w: 16, h: 16 }, rect(0, 0, 16, 16, "l"), rect(0, 0, 8, 8, "w"), rect(8, 8, 8, 8, "w"),
  hline(0, 15, 16, "L"), vline(15, 0, 16, "L"), hline(0, 7, 16, "L"), vline(7, 0, 16, "L"))
sprite("tile_wood", { w: 16, h: 16 }, rect(0, 0, 16, 16, "o"), hline(0, 5, 16, "O"), hline(0, 10, 16, "O"), hline(0, 15, 16, "O"),
  vline(4, 0, 5, "O"), vline(11, 5, 5, "O"), vline(6, 10, 5, "O"))
sprite("tile_water", { w: 16, h: 16 }, rect(0, 0, 16, 16, "A"), hline(2, 4, 4, "a"), hline(9, 10, 5, "a"), hline(5, 13, 3, "B"), hline(11, 2, 3, "B"))
sprite("tile_carpet_pop", { w: 16, h: 16 }, rect(0, 0, 16, 16, "P"), box(0, 0, 16, 16, "Q"), box(2, 2, 12, 12, "p"))
sprite("tile_carpet_rock", { w: 16, h: 16 }, rect(0, 0, 16, 16, "M"), box(0, 0, 16, 16, "N"), box(2, 2, 12, 12, "L"))
sprite("tile_hedge", { w: 16, h: 16 }, rect(0, 0, 16, 16, "H"), rect(0, 0, 16, 5, "G"),
  (c) => { for (let x = 1; x < 16; x += 4) { c.px(x, 8, "I"); c.px(x + 1, 9, "I"); c.px(x + 2, 3, "g") } }, hline(0, 15, 16, "I"))

sheet("tiles", ["tile_*"], { cols: 6, pad: 1 })

// =============================================================
// PROPS (pohon, bunga, kunang-kunang, batu)
// =============================================================
sprite("_leaf", "g\nG")
sprite("tree_round", { w: 26, h: 30, selout: "k" },
  rect(11, 22, 4, 7, "O"), px(11, 22, "b"), rect(9, 27, 8, 2, "O"),
  ellipse(13, 12, 12, 11, "G"),
  light([9, 7, 6], 1, 0.6), light([8, 6, 3], 1),
  shade([18, 18, 9], 1, 0.7), shade([21, 20, 5], 1),
  px(7, 10, "g"), px(8, 9, "g"), px(17, 6, "g"), px(5, 14, "H"), px(19, 13, "H"))
sprite("tree_pink", { base: "tree_round", swap: { G: "P", g: "p", H: "Q", I: "R" } })
sprite("tree_lilac", { base: "tree_round", swap: { G: "L", g: "l", H: "M", I: "N" } })

// Beringin bercahaya (Galeri Etnik)
sprite("beringin", { w: 52, h: 56, selout: "k" },
  // akar & batang
  rect(22, 34, 8, 18, "O"), rect(22, 34, 3, 18, "b"), px(30, 40, "o"),
  poly([18, 52, 24, 44, 26, 52], "O"), poly([34, 52, 28, 44, 26, 52], "O"),
  vline(14, 28, 24, "b"), vline(38, 28, 24, "b"), vline(10, 30, 16, "b"), vline(42, 30, 18, "b"),
  // tajuk
  ellipse(26, 18, 24, 17, "H"), ellipse(26, 15, 22, 14, "G"), ellipse(14, 24, 11, 9, "G"), ellipse(38, 24, 11, 9, "G"),
  light([18, 9, 9], 1, 0.7), light([14, 8, 4], 1), shade([40, 24, 10], 1, 0.7), shade([26, 33, 20, 5]),
  px(9, 18, "g"), px(30, 7, "g"), px(44, 17, "g"), px(20, 24, "H"),
  // kunang-kunang emas
  px(12, 14, "f"), px(24, 8, "f"), px(36, 16, "f"), px(42, 26, "f"), px(18, 28, "f"), px(30, 24, "f"))
sprite("bush", { w: 14, h: 11, outline: "I" }, ellipse(7, 6, 6, 4, "G"), light([5, 4, 3], 1), shade([9, 8, 3], 1), px(4, 3, "g"))
sprite("bush_flower", { base: "bush" }, px(4, 6, "P"), px(8, 5, "W"), px(10, 8, "P"), px(6, 9, "Q"))
sprite("rock", { w: 12, h: 9, outline: "K" }, ellipse(6, 5, 5, 3, "L"), light([4, 3, 2], 1), shade([8, 6, 3], 1))
sprite("flowers_a", { w: 9, h: 6 }, px(1, 2, "Q"), px(1, 3, "H"), px(1, 4, "H"), px(4, 1, "W"), px(4, 2, "Y"), px(4, 3, "H"), px(4, 4, "H"),
  px(7, 3, "L"), px(7, 4, "H"), px(7, 5, "H"), px(0, 2, "P"), px(2, 2, "P"), px(3, 1, "W"), px(5, 1, "W"), px(6, 3, "M"), px(8, 3, "M"))
sprite("lamp", { w: 8, h: 22, outline: "k" }, rect(3, 6, 2, 15, "M"), rect(1, 19, 6, 2, "N"), rect(1, 1, 6, 6, "y"), px(2, 2, "w"), hline(1, 0, 6, "N"))
sprite("bench", { w: 20, h: 10, outline: "k" }, rect(0, 0, 20, 3, "o"), rect(0, 4, 20, 3, "O"), rect(1, 7, 2, 2, "b"), rect(17, 7, 2, 2, "b"))
sprite("fountain", { w: 40, h: 36, outline: "k" },
  ellipse(20, 22, 19, 12, "L"), ellipse(20, 22, 17, 10, "l"), ellipse(20, 22, 15, 8, "A"),
  hline(6, 22, 6, "a"), hline(26, 24, 6, "a"), hline(14, 26, 8, "B"),
  rect(18, 10, 4, 11, "L"), rect(18, 10, 1, 11, "l"), ellipse(20, 10, 5, 2, "M"), ellipse(20, 9, 4, 1, "a"),
  px(20, 4, "w"), px(19, 6, "a"), px(21, 6, "a"), px(17, 7, "a"), px(23, 7, "a"), px(20, 2, "f"))

sprite("star_note", { w: 9, h: 9 }, px(6, 0, "Z"), vline(6, 0, 6, "Z"), px(7, 1, "Z"), px(7, 2, "Z"), ellipse(4, 6, 2, 2, "Z"), px(3, 5, "Y"))

// =============================================================
// BANGUNAN (7 lokasi) — 48x44, atap genteng berlapis, kotak bunga, tangga
// =============================================================
sprite("_ico_leaf", "..t.\n.tqt\ntqt.\n.q..")
sprite("_ico_neon", ".PP.\nPmmP\nPmmP\n.PP.")
sprite("_ico_disc", ".kkk.\nkLLLk\nkLwLk\nkLLLk\n.kkk.")
sprite("_ico_mirror", ".aaa.\naAAAa\naAAAa\n.aaa.\n..k..")
sprite("_ico_flower", ".P.P.\nPPYPP\n.PPP.\n..H..")
sprite("_ico_piano", "wkwkw\nwkwkw\nwwwww")
sprite("_ico_curtain", "mmmmm\nmrmrm\nmrmrm\nm...m")

const ROOF = [0, 22, 8, 5, 40, 5, 48, 22]
sprite("_bld", { w: 48, h: 44, outline: "k" },
  // dinding + dasar batu
  rect(4, 20, 40, 22, "s"), rect(4, 20, 40, 2, "S"), rect(43, 22, 1, 15, "S"), rect(4, 37, 40, 5, "T"), hline(4, 37, 40, "S"),
  (c) => { for (let x = 7; x < 44; x += 6) { c.vline(x, 38, 4, "S"); c.px(x + 3, 40, "S") } },
  // atap: baris genteng
  poly(ROOF, "Q"),
  clip(ROOF, (c) => {
    for (let r = 0; r < 6; r++) {
      const y = 6 + r * 3
      c.hline(0, y, 48, r % 2 ? "P" : "Q"); c.hline(0, y + 2, 48, "R")
      for (let x = (r % 2) * 2; x < 48; x += 4) c.px(x, y + 1, "R")
    }
  }),
  hline(8, 5, 32, "p"), hline(9, 6, 30, "P"),
  rect(0, 20, 48, 2, "R"), hline(0, 20, 48, "Q"),
  shade([4, 22, 40, 2]),
  // tanaman rambat
  vline(5, 23, 11, "H"), px(6, 26, "G"), px(6, 30, "G"), px(4, 28, "g"), px(5, 34, "I"), px(6, 33, "H"),
  // jendela bercahaya + kotak bunga
  rect(9, 26, 8, 8, "y"), box(9, 26, 8, 8, "O"), vline(13, 26, 8, "O"), hline(9, 30, 8, "O"), px(10, 27, "w"),
  rect(8, 34, 10, 2, "b"), hline(8, 34, 10, "O"), px(9, 33, "Q"), px(11, 33, "P"), px(13, 33, "w"), px(15, 33, "Q"), px(10, 34, "H"), px(14, 34, "H"),
  rect(31, 26, 8, 8, "y"), box(31, 26, 8, 8, "O"), vline(35, 26, 8, "O"), hline(31, 30, 8, "O"), px(32, 27, "w"),
  rect(30, 34, 10, 2, "b"), hline(30, 34, 10, "O"), px(31, 33, "P"), px(33, 33, "w"), px(35, 33, "Q"), px(37, 33, "P"), px(32, 34, "H"), px(36, 34, "H"),
  // pintu lengkung + tangga
  rect(20, 28, 8, 14, "O"), rect(21, 26, 6, 2, "O"), rect(22, 25, 4, 1, "O"), vline(24, 27, 15, "b"), rect(21, 29, 2, 3, "y"), rect(25, 29, 2, 3, "y"), px(26, 36, "Y"),
  rect(18, 41, 12, 2, "S"), hline(18, 41, 12, "s"))
const bld = (n, ico, sw, ox, oy) => sprite(n, { base: "_bld", swap: sw || {} }, stamp(ico, ox ?? 21, oy ?? 12))
bld("bld_galeri", "_ico_leaf", { P: "t", Q: "q", R: "i", p: "g" }, 22, 12)
bld("bld_lab", "_ico_neon", { P: "L", Q: "M", R: "N", p: "l" }, 22, 12)
bld("bld_lorong", "_ico_disc", { P: "o", Q: "O", R: "b", p: "S" }, 21, 12)
bld("bld_kedap", "_ico_mirror", { P: "c", Q: "C", R: "j", p: "a" }, 21, 12)
bld("bld_taman", "_ico_flower", { P: "g", Q: "G", R: "H", p: "w" }, 21, 12)
bld("bld_kibor", "_ico_piano", { P: "l", Q: "L", R: "M", p: "w" }, 21, 14)
bld("bld_aula", "_ico_curtain", { P: "m", Q: "r", R: "k", p: "J" }, 21, 12)
sheet("buildings", ["bld_*"], { cols: 4, pad: 2 })

// =============================================================
// INSTRUMEN
// =============================================================
sprite("saluang", { w: 24, h: 7, outline: "k" }, rect(0, 2, 24, 3, "Y"), hline(0, 2, 24, "y"), hline(0, 4, 24, "Z"),
  px(5, 3, "b"), px(8, 3, "b"), px(11, 3, "b"), px(14, 3, "b"), px(17, 3, "b"), vline(0, 1, 5, "O"), vline(23, 1, 5, "O"))
sprite("gong", { w: 22, h: 26, outline: "k" }, rect(1, 0, 20, 2, "b"), rect(1, 0, 2, 26, "b"), rect(19, 0, 2, 26, "b"),
  circ(11, 14, 8, "Z"), circ(11, 14, 6, "Y"), circ(11, 14, 3, "Z"), px(11, 14, "y"), px(8, 11, "y"), px(9, 10, "y"))
sprite("cengceng", { w: 16, h: 10, outline: "k" }, ellipse(5, 5, 4, 3, "Y"), ellipse(11, 5, 4, 3, "Z"), px(4, 4, "y"), px(10, 4, "Y"), px(5, 5, "Z"), px(11, 5, "Y"))
sprite("gitar_akustik", { w: 12, h: 28, outline: "k" },
  rect(5, 0, 2, 12, "O"), px(5, 0, "b"), px(6, 0, "b"), ellipse(6, 20, 5, 5, "o"), ellipse(6, 14, 3, 3, "o"), circ(6, 17, 2, "b"),
  vline(6, 2, 22, "w"), light([4, 18, 2], 1), shade([8, 22, 3], 1), rect(4, 23, 4, 1, "b"))
sprite("gitar_elektrik", { w: 12, h: 28, outline: "k" },
  rect(5, 0, 2, 12, "K"), px(5, 0, "w"), px(6, 0, "w"), ellipse(6, 19, 4, 5, "m"), ellipse(6, 15, 2, 3, "m"),
  rect(4, 17, 4, 2, "k"), rect(4, 21, 4, 2, "k"), vline(6, 2, 20, "w"), px(4, 16, "r"), px(3, 19, "R"))
sprite("synth", { w: 28, h: 12, outline: "k" }, rect(0, 0, 28, 12, "N"), rect(0, 0, 28, 3, "M"),
  rect(2, 5, 24, 6, "w"), (c) => { for (let x = 4; x < 26; x += 4) c.vline(x, 5, 6, "L") },
  (c) => { for (const x of [3, 7, 11, 15, 19, 23]) c.rect(x, 5, 2, 3, "k") },
  px(3, 1, "P"), px(6, 1, "y"), px(9, 1, "t"))
sprite("drum_machine", { w: 16, h: 14, outline: "k" }, rect(0, 0, 16, 14, "K"), rect(1, 1, 14, 3, "t"),
  (c) => { for (let r = 0; r < 2; r++) for (let q = 0; q < 4; q++) c.rect(2 + q * 3, 6 + r * 4, 2, 3, (q + r) % 2 ? "P" : "L") })
sprite("mic_stand", { w: 8, h: 16, outline: "k" }, rect(3, 5, 2, 9, "K"), rect(1, 14, 6, 1, "K"), ellipse(4, 3, 2, 3, "M"), px(3, 2, "L"), hline(3, 5, 2, "Z"))
sprite("amp", { w: 16, h: 16, outline: "k" }, rect(0, 0, 16, 16, "K"), rect(2, 3, 12, 11, "N"),
  (c) => { for (let y = 4; y < 14; y += 2) c.hline(3, y, 10, "M") }, px(3, 1, "y"), px(5, 1, "y"), px(12, 1, "P"))
sprite("piano_grand", { w: 64, h: 44, outline: "k" },
  poly([4, 0, 40, 0, 56, 6, 60, 14, 52, 26, 4, 26], "N"), poly([6, 2, 38, 2, 52, 8, 56, 14, 48, 24, 6, 24], "M"),
  light([20, 8, 6], 1, 0.6), rect(8, 4, 26, 3, "L"),
  rect(2, 26, 60, 3, "K"), rect(2, 29, 60, 14, "w"),
  (c) => { for (let x = 6; x < 62; x += 4) c.vline(x, 29, 14, "L"); for (let x = 4; x < 60; x += 4) if ((x / 4) % 7 !== 3 && (x / 4) % 7 !== 0) c.rect(x + 1, 29, 3, 8, "k") },
  rect(26, 24, 10, 3, "Z"))
sprite("book", { w: 12, h: 9, outline: "k" }, rect(0, 0, 12, 9, "w"), vline(6, 0, 9, "L"), hline(1, 2, 4, "M"), hline(1, 4, 4, "M"), hline(7, 2, 4, "M"), hline(7, 4, 4, "M"), hline(0, 8, 12, "P"))
sheet("instruments", ["saluang", "gong", "cengceng", "gitar_*", "synth", "drum_machine", "mic_stand", "amp", "book"], { cols: 5, pad: 2 })

// =============================================================
// AVATAR SISWA — 12 (6 putra, 6 putri). Ramping: kepala 12px, badan 8px, kaki 2-3px
// =============================================================
sprite("_av_m", { mx: true, outline: "k" }, `
  ..hhhh
  .hhhhh
  hhhhhh
  hHhhhh
  hhhhhh
  hhhsss
  hsssss
  hsskss
  hszkzs
  .sssss
  ..uuaa
  .uuuaa
  .uuuaa
  .uuuuU
  .suuuU
  ..jjjj
  ..jjjj
  ..jjjj
  ..jjj.
  ..jjj.
  ..KKK.`)
sprite("_av_f", { mx: true, outline: "k" }, `
  ..hhhh
  .hhhhh
  hhhhhh
  hHhhhh
  hhhhhh
  hhhsss
  hhssss
  hhskss
  hhzkzs
  .hhsss
  hhuuaa
  hhuuaa
  .huuaa
  .suuuU
  ..jjjj
  .jjjjj
  .jjjjj
  ...ss.
  ...ss.
  ..KKK.
  ..KKK.`)
const sk = (i) => i === 0 ? { s: "u", S: "U" } : i === 1 ? { s: "v", S: "V" } : { s: "x", S: "X" }
const males = [
  { h: "d", H: "D", u: "c", U: "C", a: "w", j: "K", sk: 0 },
  { h: "e", H: "E", u: "t", U: "q", a: "w", j: "K", sk: 1 },
  { h: "D", H: "k", u: "l", U: "L", a: "m", j: "N", sk: 1 },
  { h: "n", H: "F", u: "p", U: "P", a: "w", j: "K", sk: 0 },
  { h: "E", H: "D", u: "w", U: "l", a: "C", j: "N", sk: 2 },
  { h: "d", H: "D", u: "o", U: "O", a: "y", j: "b", sk: 2 },
]
const females = [
  { h: "D", H: "k", u: "p", U: "P", a: "m", j: "R", sk: 0 },
  { h: "e", H: "E", u: "l", U: "L", a: "w", j: "N", sk: 1 },
  { h: "n", H: "F", u: "t", U: "q", a: "w", j: "i", sk: 0 },
  { h: "Q", H: "R", u: "w", U: "l", a: "P", j: "M", sk: 1 },
  { h: "d", H: "D", u: "c", U: "C", a: "y", j: "j", sk: 2 },
  { h: "L", H: "M", u: "p", U: "P", a: "t", j: "J", sk: 0 },
]
// aksesori kecil per avatar (hex agar tidak ikut tertukar oleh swap)
const bow = (x, y, col) => [px(x, y, col), px(x + 2, y, col), px(x + 1, y + 1, col), px(x + 1, y, "#ffffff")]
const accM = [[], [], [rect(2, 5, 10, 1, "#7561ad")], [], [px(3, 4, "#4ea08a"), px(10, 4, "#4ea08a")], []]
const accF = [bow(9, 2, "#f594b5"), [], [px(3, 3, "#ffffff"), px(2, 3, "#72c7ae")], [rect(2, 3, 10, 1, "#9d86cf")], [], bow(2, 2, "#72c7ae")]
males.forEach((v, i) => { const { sk: s, ...m } = v; sprite("avatar_putra_" + (i + 1), { base: "_av_m", swap: { ...m, ...sk(s) } }, ...accM[i]) })
females.forEach((v, i) => { const { sk: s, ...m } = v; sprite("avatar_putri_" + (i + 1), { base: "_av_f", swap: { ...m, ...sk(s) } }, ...accF[i]) })
sheet("avatars", ["avatar_*"], { cols: 6, pad: 2 })

// =============================================================
// NPC (5) — dasar avatar + atribut khas (koordinat = kanvas 14x23 termasuk outline)
// =============================================================
// Maestro Minang: tengkuluk merah-emas + selempang songket
sprite("npc_maestro_minang", { base: "_av_m", swap: { h: "D", H: "k", u: "m", U: "r", a: "Y", j: "k", s: "v", S: "V" } },
  rect(2, 1, 10, 4, "m"), hline(2, 1, 10, "Y"), hline(1, 4, 12, "r"), hline(2, 3, 10, "Y"), px(12, 2, "Y"), px(13, 3, "Y"), px(13, 4, "Z"),
  line(3, 12, 10, 16, "Y"), line(3, 13, 10, 17, "Z"))
// Detektif Nada: fedora lilac + kaca pembesar
sprite("npc_detektif_nada", { base: "_av_m", swap: { h: "e", H: "E", u: "L", U: "M", a: "y", j: "N", s: "u", S: "U" } },
  rect(0, 3, 14, 3, "k"), rect(1, 3, 12, 2, "N"), hline(1, 4, 12, "M"),
  rect(3, 0, 8, 4, "k"), rect(4, 1, 6, 2, "M"), hline(4, 2, 6, "w"),
  ring(1, 18, 2, "Y"), px(1, 18, "a"), line(2, 20, 4, 22, "b"))
// Sang Virtuoso: rambut panjang lilac-putih, jas gelap, dasi kupu-kupu
sprite("npc_virtuoso", { base: "_av_f", swap: { h: "l", H: "L", u: "k", U: "K", a: "m", j: "K", s: "u", S: "U" } },
  rect(5, 11, 4, 1, "m"), px(4, 12, "m"), px(9, 12, "m"), rect(6, 12, 2, 1, "r"), px(6, 13, "w"), px(7, 13, "w"), px(6, 14, "w"), px(7, 14, "w"))
// Pujangga Taman: mahkota daun & bunga, pena bulu
sprite("npc_pujangga", { base: "_av_f", swap: { h: "e", H: "E", u: "t", U: "q", a: "w", j: "i", s: "v", S: "V" } },
  hline(3, 1, 8, "H"), px(4, 0, "G"), px(6, 0, "G"), px(9, 0, "G"), px(5, 1, "P"), px(8, 1, "P"), px(10, 1, "g"),
  line(13, 12, 11, 18, "w"), px(13, 11, "L"), px(14, 12, "L"))
// House Manager: headset + papan jepit
sprite("npc_house_manager", { base: "_av_m", swap: { h: "d", H: "D", u: "N", U: "k", a: "w", j: "K", s: "u", S: "U" } },
  hline(2, 3, 10, "K"), vline(1, 4, 5, "K"), vline(12, 4, 5, "K"), rect(0, 8, 2, 3, "P"), rect(12, 8, 2, 3, "P"), px(2, 11, "K"), px(3, 12, "K"),
  rect(0, 15, 4, 5, "k"), rect(1, 16, 2, 3, "w"), px(1, 17, "L"))
sheet("npcs", ["npc_*"], { cols: 5, pad: 2 })

// Tanda quest
sprite("quest_exclaim", { w: 7, h: 12, outline: "k" }, rect(2, 0, 3, 7, "Y"), rect(2, 9, 3, 3, "Y"), vline(2, 0, 7, "y"), px(2, 9, "y"))
sprite("quest_done", { w: 11, h: 10, outline: "k" }, line(1, 5, 4, 8, "t", 2), line(4, 8, 9, 1, "t", 2), px(2, 5, "w"))

// =============================================================
// UI
// =============================================================
sprite("ui_panel", { w: 56, h: 40, outline: "k" }, rect(0, 0, 56, 40, "w"), box(1, 1, 54, 38, "P"), box(2, 2, 52, 36, "p"),
  px(0, 0, "_"), px(55, 0, "_"), px(0, 39, "_"), px(55, 39, "_"),
  rect(1, 1, 3, 3, "Q"), rect(52, 1, 3, 3, "Q"), rect(1, 36, 3, 3, "Q"), rect(52, 36, 3, 3, "Q"),
  rect(4, 5, 48, 7, "P"), text(7, 6, "MISI AKTIF", "R"))
sprite("ui_btn_interaksi", { w: 32, h: 32, outline: "k" }, circ(16, 16, 15, "P"), ring(16, 16, 14, "Q"), circ(16, 16, 11, "p"),
  // tangan
  rect(12, 14, 8, 8, "u"), rect(12, 9, 2, 6, "u"), rect(15, 8, 2, 7, "u"), rect(18, 9, 2, 6, "u"), rect(10, 15, 3, 4, "u"),
  shade([16, 21, 4, 2]), px(11, 15, "w"), px(14, 9, "w"),
  px(5, 5, "f"), px(26, 7, "f"), px(27, 24, "f"))
sprite("ui_joy_base", { w: 40, h: 40, outline: "k" }, circ(20, 20, 19, "l"), ring(20, 20, 18, "L"), ring(20, 20, 12, "L"),
  poly([20, 4, 24, 9, 16, 9], "M"), poly([20, 36, 24, 31, 16, 31], "M"), poly([4, 20, 9, 16, 9, 24], "M"), poly([36, 20, 31, 16, 31, 24], "M"))
sprite("ui_joy_knob", { w: 18, h: 18, outline: "k" }, circ(9, 9, 8, "P"), circ(9, 9, 6, "Q"), light([6, 6, 3], 2), px(5, 4, "w"))
sprite("ui_ip_coin", { w: 14, h: 14, outline: "k" }, circ(7, 7, 6, "Y"), circ(7, 7, 4, "Z"), vline(7, 4, 6, "y"), px(5, 5, "y"), px(5, 8, "y"))
sprite("ui_dialog_box", { w: 120, h: 34, outline: "k" }, rect(0, 0, 120, 34, "w"), box(1, 1, 118, 32, "L"), box(2, 2, 116, 30, "l"),
  rect(4, 4, 30, 8, "P"), text(6, 5, "NPC", "R"), poly([108, 26, 114, 26, 111, 30], "M"))
sprite("ui_logo", { w: 36, h: 36, outline: "k" }, circ(18, 18, 17, "L"), ring(18, 18, 15, "w"), circ(18, 18, 13, "l"),
  // kunci sol sederhana + nada
  vline(18, 8, 18, "N"), circ(17, 24, 3, "N"), circ(17, 24, 1, "l"), px(21, 11, "N"), px(22, 12, "N"), px(22, 13, "N"), px(21, 14, "N"), px(20, 15, "N"),
  px(13, 17, "N"), px(12, 18, "N"), px(12, 19, "N"), px(13, 20, "N"), px(14, 21, "N"), px(8, 5, "f"), px(29, 8, "f"), px(28, 29, "f"))
sheet("ui", ["ui_*", "quest_*"], { cols: 4, pad: 3 })

// =============================================================
// SCENE: Splash screen
// =============================================================
scene("splash", { w: 192, h: 108, bg: "L" },
  layer("langit", grad(0, 0, 192, 70, "LlpP", "v", 0.7)),
  layer("awan",
    ellipse(30, 26, 18, 6, "w"), ellipse(42, 22, 12, 6, "w"), ellipse(150, 18, 20, 6, "p"), ellipse(164, 14, 12, 5, "p"),
    ellipse(100, 36, 16, 4, "w")),
  layer("gunung", poly([0, 70, 30, 44, 54, 62, 84, 40, 116, 66, 150, 46, 192, 70], "L"),
    poly([0, 72, 40, 56, 80, 70, 120, 58, 192, 74], "M")),
  layer("tanah", rect(0, 72, 192, 36, "G"), (c) => { for (let x = 0; x < 192; x += 16) { c.px(x + 4, 80, "g"); c.px(x + 11, 92, "H"); c.px(x + 7, 100, "g") } }),
  layer("pohon", stamp("tree_pink", 6, 52), stamp("tree_lilac", 160, 52), stamp("tree_round", 28, 60), stamp("tree_round", 138, 58), stamp("bush_flower", 60, 84), stamp("bush_flower", 120, 88)),
  layer("logo", stamp("ui_logo", 78, 8)),
  layer("judul", text(96, 52, "MELODY ACADEMY", "N", { scale: 2, align: "c", shadow: "w" })),
  layer("sub", text(96, 68, "THE INNER SYMPHONY", "R", { align: "c", shadow: "w" })),
  layer("tombol", rect(66, 84, 60, 12, "P"), box(66, 84, 60, 12, "R"), text(96, 87, "MULAI", "w", { align: "c", shadow: "R" })),
  layer("partikel", px(20, 10, "f"), px(60, 30, "f"), px(140, 24, "f"), px(176, 50, "f"), px(100, 78, "f"), px(40, 76, "f")))


// =============================================================
// SCENE: Alun-alun Simfoni — semua karakter berdiri di jalan/tanah, bukan di atap
// =============================================================
// pintu: top row door x = bx+24 ; characters 14px wide => x = door-7
const SH = []
const shadowBld = (bx, by) => [rect(bx + 4, by + 42, 46, 4, "k"), rect(bx + 46, by + 22, 4, 22, "k")]
const shadowChar = (x, y) => ellipse(x + 7, y + 22, 6, 2, "k")
const alunScene = (name, chars) => scene(name, { w: 352, h: 256, bg: "G" },
  layer("rumput", pattern("tile_grass*", 0, 0, 352, 256, { rflip: "x", seed: 7 })),
  layer("bunga", scatter("flowers_a", 0, 130, 352, 70, 34, { on: "G", rflip: "x" }), scatter("flowers_a", 0, 2, 352, 30, 12, { on: "G", rflip: "x" })),
  layer("jalan",
    // jalan atas, bawah, dan poros tengah
    rect(0, 88, 352, 32, "s"), rect(0, 208, 352, 26, "s"), rect(160, 34, 32, 206, "s"),
    hline(0, 87, 352, "T"), hline(0, 120, 352, "S"), hline(0, 207, 352, "T"), hline(0, 234, 352, "S"),
    vline(159, 34, 54, "T"), vline(192, 34, 54, "S"), vline(159, 120, 87, "T"), vline(192, 120, 87, "S"),
    // jalan setapak ke pintu
    rect(75, 84, 10, 4, "s"), rect(127, 84, 10, 4, "s"), rect(219, 84, 10, 4, "s"), rect(275, 84, 10, 4, "s"),
    // plaza
    pattern("tile_plaza", 136, 90, 80, 48), box(135, 89, 82, 50, "M"), box(134, 88, 84, 52, "L")),
  layer("bayangan", { shade: true },
    ...shadowBld(56, 40), ...shadowBld(108, 40), ...shadowBld(200, 40), ...shadowBld(256, 40),
    ...shadowBld(56, 164), ...shadowBld(108, 164), ...shadowBld(200, 164),
    ellipse(30, 82, 22, 4, "k"), ellipse(176, 130, 18, 4, "k"),
    shadowChar(73, 86), shadowChar(125, 86), shadowChar(125, 210), shadowChar(73, 210), shadowChar(217, 210),
    shadowChar(169, 142), shadowChar(236, 96), shadowChar(296, 96)),
  layer("pagar", tile("tile_hedge", 0, 240, 22, 1), tile("tile_hedge", 0, 0, 22, 1)),
  layer("gedung",
    stamp("bld_galeri", 56, 40), stamp("bld_lab", 108, 40), stamp("bld_lorong", 200, 40), stamp("bld_kedap", 256, 40),
    stamp("bld_taman", 56, 164), stamp("bld_kibor", 108, 164), stamp("bld_aula", 200, 164)),
  layer("dekor",
    stamp("beringin", 2, 30),
    stamp("fountain", 156, 94),
    stamp("lamp", 138, 98), stamp("lamp", 206, 98), stamp("bench", 140, 124), stamp("bench", 192, 124),
    stamp("tree_pink", 312, 38), stamp("tree_lilac", 328, 62), stamp("tree_round", 6, 150), stamp("tree_pink", 4, 190),
    stamp("tree_lilac", 300, 160), stamp("tree_pink", 320, 190), stamp("tree_round", 258, 168),
    stamp("tree_round", 126, 4), stamp("tree_lilac", 214, 4), stamp("tree_pink", 40, 4),
    stamp("bush_flower", 104, 70), stamp("bush", 252, 72), stamp("bush_flower", 306, 76), stamp("bush_flower", 46, 190), stamp("bush", 152, 196),
    stamp("bush_flower", 250, 190), stamp("rock", 24, 124), stamp("rock", 284, 140)),
  ...(chars ? [
  layer("karakter",
    stamp("npc_maestro_minang", 73, 86), stamp("npc_detektif_nada", 125, 86),
    stamp("npc_virtuoso", 125, 210), stamp("npc_pujangga", 73, 210), stamp("npc_house_manager", 217, 210),
    stamp("avatar_putri_1", 169, 142), stamp("avatar_putra_1", 236, 96), stamp("avatar_putri_4", 296, 96),
    stamp("quest_exclaim", 76, 70), stamp("quest_exclaim", 128, 70), stamp("quest_exclaim", 128, 194),
    stamp("quest_done", 74, 196), stamp("quest_exclaim", 220, 194))
  ] : []),
  ...(chars ? [layer("partikel", (c) => { const r = c.rng(11); for (let i = 0; i < 46; i++) c.px(Math.floor(r() * 350), Math.floor(r() * 250), "f") }),
  glow("f", { r: 4, strength: 0.5 })] : []))
alunScene("alun_alun", true)
alunScene("alun_bg", false)


// =============================================================
// ANIMASI JALAN — 12 avatar x (bawah, atas, kiri) x 3 frame. Kanan = flipX di game.
// Sheet: 3 kolom x 3 baris, frame 14x23. Baris: down, up, left. Kolom: idle, langkah A, langkah B.
// =============================================================
const mirror = (rows) => rows.map((r) => r + [...r].reverse().join(""))
const padSide = (rows) => rows.map((r) => "." + r + ".")
const FRONT_M = [
  "..hhhh", ".hhhhh", "hhhhhh", "hHhhhh", "hhhhhh", "hhhsss", "hsssss", "hsskss", "hszkzs", ".sssss",
  "..uuaa", ".uuuaa", ".uuuaa", ".uuuuU", ".suuuU", "..jjjj", "..jjjj", "..jjjj", "..jjj.", "..jjj.", "..KKK."]
const FRONT_F = [
  "..hhhh", ".hhhhh", "hhhhhh", "hHhhhh", "hhhhhh", "hhhsss", "hhssss", "hhskss", "hhzkzs", ".hhsss",
  "hhuuaa", "hhuuaa", ".huuaa", ".suuuU", "..jjjj", ".jjjjj", ".jjjjj", "...ss.", "...ss.", "..KKK.", "..KKK."]
const BACK_M = FRONT_M.map((r, i) => i >= 5 && i <= 8 ? "hhhhhh" : i === 9 ? ".hhhhh" : i === 10 ? "..uuuu" : i === 11 || i === 12 ? ".uuuuu" : r)
const BACK_F = FRONT_F.map((r, i) => i >= 5 && i <= 11 ? "hhhhhh" : i === 12 ? ".hhhhh" : r)
const SIDE_M_TOP = [
  "..hhhhhh..", ".hhhhhhhh.", "hhhhhhhhhh", "hhHhhhhhhh", "hhhhhhhhhh", "hsshhhhhhh", "hsssshhhhh", "sskssshhhh", "szssshhhhh", ".ssssshhh.",
  "..uuuuuu..", "..uuuuuu..", "..uuUUuu..", "..uuUUuu..", "..uussuu..", "..jjjjjj..", "..jjjjjj..", "..jjjjjj.."]
const SIDE_F_TOP = [
  "..hhhhhh..", ".hhhhhhhh.", "hhhhhhhhhh", "hhHhhhhhhh", "hhhhhhhhhh", "hsshhhhhhh", "hsssshhhhh", "sskssshhhh", "szssshhhhh", ".ssshhhhhh",
  "..uuuhhhh.", "..uuuhhhh.", "..uuUhhh..", "..uussuu..", "..jjjjjj..", ".jjjjjjjj.", ".jjjjjjjj."]
const legsFrontM = [
  [["..jjj..jjj..", "..jjj..jjj..", "..KKK..KKK.."]],
  [["..jjj..jjj..", "..KKK..jjj..", ".......KKK.."]],
  [["..jjj..jjj..", "..jjj..KKK..", "..KKK......."]]].map((x) => x[0])
const legsFrontF = [
  ["...ss..ss...", "...ss..ss...", "..KKK..KKK..", "..KKK..KKK.."],
  ["..KKK..ss...", ".......KKK..", ".......KKK..", "............"],
  ["...ss..KKK..", "..KKK.......", "..KKK.......", "............"]]
const legsSideM = [
  ["...jjjj...", "...jjjj...", "..KKKK...."],
  [".jj....jj.", ".jj....jj.", ".KKK...KK."],
  ["...jj.jj..", "...jj.jj..", "...KKK.KK."]]
const legsSideF = [
  ["....ss....", "....ss....", "...KKK....", "...KKK...."],
  ["...ss.ss..", "..ss...ss.", ".KKK...KK.", ".........."],
  ["....ss....", "...ss.ss..", "...KKK.KK.", ".........."]]
const frames = (male, id, cfg, acc) => {
  const swap = { ...cfg, ...sk(cfg.sk) }; delete swap.sk
  const names = []
  const mk = (n, rows, extra = []) => { sprite(n, { w: 12, h: 21, outline: "k", swap }, rows.join("\n"), ...extra); names.push(n) }
  for (let f = 0; f < 3; f++) {
    const front = male ? [...mirror(FRONT_M.slice(0, 18)), ...legsFrontM[f]] : [...mirror(FRONT_F.slice(0, 17)), ...legsFrontF[f]]
    mk(`w_${id}_d${f}`, front, f === 0 ? acc : [])
  }
  for (let f = 0; f < 3; f++) {
    const back = male ? [...mirror(BACK_M.slice(0, 18)), ...legsFrontM[f]] : [...mirror(BACK_F.slice(0, 17)), ...legsFrontF[f]]
    mk(`w_${id}_u${f}`, back)
  }
  for (let f = 0; f < 3; f++) {
    const side = male ? [...padSide(SIDE_M_TOP), ...padSide(legsSideM[f])] : [...padSide(SIDE_F_TOP), ...padSide(legsSideF[f])]
    mk(`w_${id}_l${f}`, side)
  }
  sheet(`walk_${id}`, names, { cols: 3, pad: 0 })
}
males.forEach((v, i) => frames(true, "putra_" + (i + 1), v, accM[i]))
females.forEach((v, i) => frames(false, "putri_" + (i + 1), v, accF[i]))

// =============================================================
// TAHAP 2 — Interior Galeri Etnik + gamelan Bali
// =============================================================
sprite("kempul", { w: 18, h: 24, outline: "k" },
  rect(1, 0, 16, 2, "b"), vline(4, 2, 3, "w"), vline(13, 2, 3, "w"),
  circ(9, 14, 7, "Z"), circ(9, 14, 5, "Y"), circ(9, 14, 2, "Z"), px(9, 14, "y"), px(6, 11, "y"), px(7, 10, "y"))
sprite("kenong", { w: 18, h: 16, outline: "k" },
  rect(0, 10, 18, 5, "b"), hline(0, 10, 18, "O"), ellipse(9, 7, 8, 6, "Z"), ellipse(9, 6, 6, 4, "Y"), ellipse(9, 4, 3, 2, "Z"), px(8, 3, "y"))
sprite("gender", { w: 30, h: 18, outline: "k" },
  rect(0, 10, 30, 7, "b"), hline(0, 10, 30, "O"),
  (c) => { for (let i = 0; i < 7; i++) { c.rect(2 + i * 4, 1 + (i >> 1), 3, 9 - (i >> 1), i % 2 ? "Y" : "Z"); c.px(2 + i * 4, 1 + (i >> 1), "y") } })
sprite("pedestal", { w: 30, h: 28, outline: "k" },
  rect(3, 16, 24, 11, "O"), rect(3, 16, 24, 2, "o"), rect(1, 12, 28, 5, "o"), hline(1, 12, 28, "y"), stamp("saluang", 2, 5))
sprite("songket", { w: 26, h: 30, outline: "k" }, rect(0, 0, 26, 30, "m"), rect(2, 2, 22, 26, "r"),
  (c) => { for (let y = 4; y < 28; y += 6) for (let x = 4; x < 24; x += 6) { c.px(x + 1, y, "Y"); c.px(x, y + 1, "Y"); c.px(x + 2, y + 1, "Y"); c.px(x + 1, y + 2, "Y") } },
  hline(0, 0, 26, "Y"), hline(0, 29, 26, "Y"))
sprite("window_glow", { w: 28, h: 24, outline: "O" }, rect(0, 0, 28, 24, "y"), vline(13, 0, 24, "O"), vline(14, 0, 24, "O"), hline(0, 11, 28, "O"), hline(0, 12, 28, "O"),
  rect(2, 2, 9, 3, "w"), rect(16, 2, 9, 3, "w"))
sprite("lantern", { w: 8, h: 14, outline: "k" }, vline(4, 0, 4, "k"), rect(1, 4, 6, 8, "Y"), rect(2, 5, 4, 5, "y"), rect(1, 4, 6, 1, "m"), rect(1, 11, 6, 1, "m"), vline(4, 12, 2, "m"))

scene("galeri_int", { w: 320, h: 192, bg: "b" },
  layer("lantai", pattern("tile_wood", 0, 48, 320, 144, { seed: 3 }), light([160, 120, 80], 1, 0.35)),
  layer("dinding", rect(0, 0, 320, 48, "H"), rect(0, 0, 320, 5, "I"),
    (c) => { for (let x = 0; x < 320; x += 10) c.vline(x, 5, 30, (x / 10) % 2 ? "H" : "G"); for (let x = 0; x < 320; x += 10) c.px(x + 4, 12 + ((x / 10) % 3) * 6, "g") },
    rect(0, 35, 320, 13, "O"), hline(0, 35, 320, "o"), hline(0, 47, 320, "b"),
    (c) => { for (let x = 6; x < 320; x += 16) c.vline(x, 36, 11, "b") }),
  layer("sisi", rect(0, 48, 8, 136, "b"), rect(312, 48, 8, 136, "b"), vline(8, 48, 136, "O"), vline(311, 48, 136, "O"),
    rect(0, 184, 144, 8, "b"), rect(176, 184, 144, 8, "b"), hline(0, 184, 144, "o"), hline(176, 184, 144, "o"),
    rect(144, 184, 32, 8, "S"), box(144, 184, 32, 8, "T"), hline(148, 187, 24, "s")),
  layer("hiasan", stamp("window_glow", 34, 8), stamp("window_glow", 118, 8), stamp("window_glow", 202, 8), stamp("songket", 78, 4), stamp("songket", 160, 4),
    stamp("lantern", 16, 6), stamp("lantern", 100, 6), stamp("lantern", 184, 6), stamp("lantern", 296, 6)),
  layer("karpet", rect(112, 128, 96, 44, "m"), box(112, 128, 96, 44, "Y"), box(115, 131, 90, 38, "r"),
    (c) => { for (let x = 126; x < 200; x += 14) { c.px(x, 150, "Y"); c.px(x - 1, 151, "Y"); c.px(x + 1, 151, "Y"); c.px(x, 152, "Y") } }),
  layer("panggung", rect(24, 66, 128, 60, "O"), box(24, 66, 128, 60, "b"), hline(25, 67, 126, "o"), rect(24, 120, 128, 6, "b"), hline(24, 120, 128, "O"),
    (c) => { for (let x = 30; x < 152; x += 12) c.vline(x, 70, 48, "b") }),
  layer("gamelan",
    stamp("gong", 28, 70), stamp("kempul", 62, 88), stamp("kenong", 86, 96), stamp("gender", 102, 96), stamp("cengceng", 132, 106)),
  layer("bayang", { shade: true }, ellipse(60, 124, 40, 3, "k"), ellipse(237, 106, 16, 3, "k"), ellipse(160, 183, 30, 2, "k")),
  layer("pohon", stamp("beringin", 262, 4)),
  layer("pedestal", stamp("pedestal", 222, 76)),
  layer("tanaman", stamp("bush_flower", 20, 170), stamp("bush", 290, 170), stamp("bush_flower", 20, 56)),
  layer("cahaya", { light: true }, poly([34, 32, 62, 32, 80, 100, 20, 100], "w"), poly([202, 32, 230, 32, 250, 110, 190, 110], "w")),
  layer("debu", (c) => { const r = c.rng(5); for (let i = 0; i < 26; i++) c.px(Math.floor(r() * 316), 20 + Math.floor(r() * 150), "f") }),
  glow("f", { r: 3, strength: 0.4 }))

// =============================================================
// TAHAP 3 — Lab DNA Genre
// =============================================================
sprite("ukulele", { w: 10, h: 24, outline: "k" },
  rect(4, 0, 2, 11, "O"), px(4, 0, "b"), px(5, 0, "b"), ellipse(5, 19, 4, 4, "o"), ellipse(5, 14, 3, 3, "o"), circ(5, 17, 1, "b"),
  vline(5, 2, 17, "w"), light([3, 17, 2], 1), shade([7, 20, 2], 1))
sprite("tamborin", { w: 16, h: 16, outline: "k" }, circ(8, 8, 7, "O"), circ(8, 8, 5, "w"), circ(8, 8, 4, "l"),
  px(1, 8, "Y"), px(15, 8, "Y"), px(8, 1, "Y"), px(8, 15, "Y"), px(3, 3, "Y"), px(13, 3, "Y"), px(3, 13, "Y"), px(13, 13, "Y"), px(6, 6, "w"))
sprite("bass_elektrik", { w: 12, h: 34, outline: "k" },
  rect(5, 0, 2, 18, "K"), px(5, 0, "w"), px(6, 0, "w"), ellipse(6, 26, 4, 6, "N"), ellipse(6, 20, 2, 3, "N"),
  rect(4, 23, 4, 2, "k"), rect(4, 27, 4, 2, "k"), vline(6, 2, 26, "w"), px(4, 22, "M"), px(3, 25, "L"))
sprite("drum_kit", { w: 32, h: 26, outline: "k" },
  vline(4, 6, 18, "K"), vline(27, 7, 17, "K"), ellipse(4, 5, 4, 1, "Y"), ellipse(27, 6, 4, 1, "Y"),
  ellipse(16, 17, 8, 7, "w"), ellipse(16, 17, 6, 5, "Q"), circ(16, 17, 2, "w"),
  ellipse(9, 12, 4, 2, "Q"), ellipse(23, 12, 4, 2, "Q"), ellipse(9, 11, 3, 1, "w"), ellipse(23, 11, 3, 1, "w"),
  rect(5, 21, 2, 4, "K"), rect(25, 21, 2, 4, "K"))
sprite("sampe", { w: 34, h: 12, outline: "k" },
  poly([0, 6, 6, 2, 26, 2, 33, 6, 26, 10, 6, 10], "O"), poly([2, 6, 7, 3, 25, 3, 30, 6, 25, 9, 7, 9], "o"),
  rect(26, 5, 8, 2, "b"), hline(7, 5, 20, "w"), hline(7, 7, 20, "w"),
  px(10, 6, "m"), px(14, 6, "Y"), px(18, 6, "m"), px(22, 6, "Y"), px(4, 6, "r"), vline(33, 4, 5, "b"))
sprite("speaker", { w: 14, h: 22, outline: "k" }, rect(0, 0, 14, 22, "K"), circ(7, 6, 3, "Q"), circ(7, 6, 1, "k"), circ(7, 15, 4, "t"), circ(7, 15, 2, "k"), px(2, 2, "y"))
sprite("desk_mix", { w: 96, h: 30, outline: "k" }, rect(0, 6, 96, 24, "N"), rect(0, 0, 96, 8, "M"), hline(0, 0, 96, "L"),
  rect(6, 1, 26, 5, "k"), (c) => { for (let x = 8; x < 30; x += 3) c.vline(x, 2 + ((x * 7) % 3), 3, x % 2 ? "t" : "Q") },
  (c) => { for (let i = 0; i < 12; i++) { const x = 6 + i * 7.5 | 0; c.rect(x, 11, 4, 4, i % 3 === 0 ? "Q" : i % 3 === 1 ? "t" : "y"); c.px(x + 1, 11, "w"); c.rect(x + 1, 17, 2, 10, "k"); c.rect(x, 19 + (i * 5) % 6, 4, 3, "w") } })
sprite("monitor_dna", { w: 34, h: 28, outline: "k" }, rect(0, 0, 34, 24, "K"), rect(2, 2, 30, 20, "k"), rect(13, 24, 8, 4, "N"),
  (c) => { for (let x = 4; x < 30; x++) { const y = 12 + Math.round(Math.sin(x * 0.55) * 6); const y2 = 12 - Math.round(Math.sin(x * 0.55) * 6); c.px(x, y, "Q"); c.px(x, y2, "t"); if (x % 4 === 0) c.vline(x, Math.min(y, y2), Math.abs(y - y2) + 1, "w") } })

scene("lab_int", { w: 320, h: 192, bg: "M" },
  layer("lantai", rect(0, 48, 320, 144, "l"),
    (c) => { for (let y = 48; y < 192; y += 16) for (let x = 0; x < 320; x += 16) if (((x + y) / 16) % 2) c.rect(x, y, 16, 16, "w"); for (let y = 48; y < 192; y += 16) c.hline(0, y, 320, "L") }),
  layer("dinding", rect(0, 0, 320, 48, "M"), (c) => { for (let x = 0; x < 320; x += 16) c.rect(x, 0, 8, 44, "L") },
    rect(0, 42, 320, 2, "Q"), rect(0, 44, 320, 2, "t"), rect(0, 46, 320, 2, "N")),
  layer("sisi", rect(0, 48, 8, 136, "N"), rect(312, 48, 8, 136, "N"), vline(8, 48, 136, "L"), vline(311, 48, 136, "L"),
    rect(0, 184, 144, 8, "N"), rect(176, 184, 144, 8, "N"), hline(0, 184, 144, "L"), hline(176, 184, 144, "L"),
    rect(144, 184, 32, 8, "t"), box(144, 184, 32, 8, "i"), hline(148, 187, 24, "g")),
  layer("hiasan", stamp("monitor_dna", 20, 8), stamp("monitor_dna", 70, 8), stamp("monitor_dna", 216, 8), stamp("monitor_dna", 266, 8),
    text(160, 22, "LAB DNA GENRE", "w", { align: "c", shadow: "Q" }), text(160, 33, "POP  ROCK  ETNIK", "N", { align: "c" })),
  layer("karpet",
    rect(16, 92, 64, 52, "P"), box(16, 92, 64, 52, "Q"), box(19, 95, 58, 46, "p"), text(48, 114, "POP", "R", { align: "c", scale: 2 }),
    rect(88, 92, 64, 52, "N"), box(88, 92, 64, 52, "k"), box(91, 95, 58, 46, "L"), text(120, 114, "ROCK", "k", { align: "c", scale: 2 })),
  layer("meja", stamp("desk_mix", 202, 64), stamp("speaker", 190, 56), stamp("speaker", 300, 56), ellipse(250, 106, 8, 3, "N"), rect(246, 100, 8, 5, "M")),
  layer("bayang", { shade: true }, ellipse(250, 96, 50, 3, "k"), ellipse(160, 183, 28, 2, "k")),
  layer("tanaman", stamp("bush_flower", 20, 170), stamp("bush", 290, 170), stamp("bush_flower", 290, 120), stamp("rock", 22, 154)),
  layer("debu", (c) => { const r = c.rng(8); for (let i = 0; i < 24; i++) c.px(Math.floor(r() * 316), 52 + Math.floor(r() * 130), "f") }),
  glow("f", { r: 3, strength: 0.4 }))

// =============================================================
// TAHAP 4 — Ruang Kedap Apresiasi + Lorong Waktu Evolusi
// =============================================================
sprite("foam", { w: 16, h: 16 }, rect(0, 0, 16, 16, "N"),
  (c) => { for (let y = 0; y < 16; y += 8) for (let x = 0; x < 16; x += 8) { c.rect(x, y, 8, 8, "M"); c.rect(x + 1, y + 1, 6, 6, "N"); c.rect(x + 1, y + 1, 3, 3, "L"); c.px(x + 5, y + 5, "j") } })
sprite("oscilloscope", { w: 38, h: 28, outline: "k" }, rect(0, 0, 38, 28, "K"), rect(3, 3, 32, 17, "k"),
  (c) => { for (let x = 4; x < 34; x++) c.px(x, 11 + Math.round(Math.sin(x * 0.42) * 5), "t"); for (let x = 4; x < 34; x += 6) c.vline(x, 4, 15, "N"); c.hline(4, 11, 30, "N") },
  rect(4, 22, 4, 4, "Q"), rect(11, 22, 4, 4, "y"), rect(18, 22, 4, 4, "t"), rect(25, 22, 4, 4, "L"), px(5, 22, "w"), px(12, 22, "w"))
sprite("mirror_big", { w: 64, h: 44, outline: "Y" }, rect(0, 0, 64, 44, "Z"), rect(2, 2, 60, 40, "Y"), rect(4, 4, 56, 36, "a"),
  rect(4, 4, 56, 12, "A"), line(12, 38, 28, 5, "w", 2), line(24, 38, 40, 5, "w", 1), line(44, 38, 56, 12, "w", 1), px(10, 8, "w"), px(52, 30, "w"))
sprite("turntable", { w: 24, h: 18, outline: "k" }, rect(0, 0, 24, 18, "O"), rect(0, 0, 24, 2, "o"),
  circ(10, 9, 7, "k"), ring(10, 9, 6, "K"), ring(10, 9, 4, "K"), circ(10, 9, 2, "P"), px(10, 9, "w"),
  line(20, 3, 13, 8, "w"), rect(19, 2, 3, 3, "Y"))
sprite("shelf_vinyl", { w: 46, h: 36, outline: "k" }, rect(0, 0, 46, 36, "b"), rect(2, 2, 42, 14, "O"), rect(2, 19, 42, 14, "O"),
  (c) => { const cols = ["Q", "t", "Y", "L", "m", "c", "P", "g"]; for (let r = 0; r < 2; r++) for (let i = 0; i < 14; i++) { const y = r ? 19 : 2; c.rect(3 + i * 3, y + 1 + (i % 3), 2, 13 - (i % 3), cols[(i + r * 3) % 8]) } })
sprite("headphones", { w: 14, h: 12, outline: "k" }, ring(7, 7, 5, "K"), rect(0, 6, 3, 5, "Q"), rect(11, 6, 3, 5, "Q"), px(1, 7, "w"), px(12, 7, "w"))
sprite("podium", { w: 30, h: 26, outline: "k" }, rect(0, 6, 30, 20, "L"), rect(0, 6, 30, 3, "l"), rect(2, 10, 26, 14, "M"), rect(8, 14, 14, 6, "Y"), hline(9, 16, 12, "O"), hline(9, 18, 8, "O"))
sprite("npc_penyimak", { base: "_av_f", swap: { h: "d", H: "D", u: "C", U: "j", a: "w", j: "c", s: "u", S: "U" } },
  rect(1, 1, 12, 4, "c"), hline(2, 1, 10, "w"), rect(0, 6, 2, 4, "Q"), rect(12, 6, 2, 4, "Q"), hline(2, 4, 10, "C"), px(2, 5, "C"), px(11, 5, "C"))

scene("kedap_int", { w: 320, h: 192, bg: "N" },
  layer("lantai", rect(0, 48, 320, 144, "c"), (c) => { for (let y = 48; y < 192; y += 16) c.hline(0, y, 320, "C"); for (let x = 0; x < 320; x += 32) c.vline(x, 48, 144, "C") },
    rect(96, 56, 128, 128, "L"), box(96, 56, 128, 128, "M"), box(100, 60, 120, 120, "l")),
  layer("dinding", pattern("foam", 0, 0, 320, 48), rect(0, 44, 320, 4, "k"), hline(0, 44, 320, "N")),
  layer("sisi", rect(0, 48, 8, 136, "N"), rect(312, 48, 8, 136, "N"), vline(8, 48, 136, "M"), vline(311, 48, 136, "M"),
    rect(0, 184, 144, 8, "N"), rect(176, 184, 144, 8, "N"), hline(0, 184, 144, "M"), hline(176, 184, 144, "M"),
    rect(144, 184, 32, 8, "t"), box(144, 184, 32, 8, "i"), hline(148, 187, 24, "g")),
  layer("hiasan", stamp("mirror_big", 128, 0)),
  layer("meja", rect(196, 80, 90, 14, "O"), rect(196, 80, 90, 3, "o"), rect(200, 94, 4, 8, "b"), rect(278, 94, 4, 8, "b"),
    stamp("oscilloscope", 226, 56), stamp("headphones", 270, 72), ellipse(240, 110, 8, 3, "N"), rect(236, 102, 8, 5, "M")),
  layer("bayang", { shade: true }, ellipse(240, 98, 44, 3, "k"), ellipse(160, 183, 28, 2, "k")),
  layer("tanaman", stamp("bush_flower", 20, 170), stamp("bush", 290, 170), stamp("bush", 20, 60)),
  layer("debu", (c) => { const r = c.rng(21); for (let i = 0; i < 16; i++) c.px(Math.floor(r() * 316), 52 + Math.floor(r() * 130), "w") }))

scene("lorong_int", { w: 320, h: 192, bg: "b" },
  layer("lantai", rect(0, 48, 320, 144, "o"), (c) => { for (let y = 48; y < 192; y += 12) c.hline(0, y, 320, "O"); for (let x = 0; x < 320; x += 24) for (let y = 48; y < 192; y += 24) c.vline(x + ((y / 24) % 2) * 12, y, 12, "O") },
    rect(0, 118, 320, 24, "m"), hline(0, 118, 320, "Y"), hline(0, 141, 320, "Y"), rect(0, 121, 320, 1, "r"), rect(0, 138, 320, 1, "r")),
  layer("dinding", rect(0, 0, 320, 48, "O"), (c) => { for (let x = 0; x < 320; x += 12) c.vline(x, 0, 44, "b") }, rect(0, 44, 320, 4, "b"), hline(0, 44, 320, "o")),
  layer("sisi", rect(0, 48, 8, 136, "b"), rect(312, 48, 8, 136, "b"), vline(8, 48, 136, "O"), vline(311, 48, 136, "O"),
    rect(0, 184, 144, 8, "b"), rect(176, 184, 144, 8, "b"), hline(0, 184, 144, "o"), hline(176, 184, 144, "o"),
    rect(144, 184, 32, 8, "S"), box(144, 184, 32, 8, "T"), hline(148, 187, 24, "s")),
  layer("rak", stamp("shelf_vinyl", 12, 6), stamp("shelf_vinyl", 64, 6), stamp("shelf_vinyl", 210, 6), stamp("shelf_vinyl", 262, 6),
    stamp("lantern", 114, 6), stamp("lantern", 190, 6), text(152, 12, "LORONG", "Y", { align: "c", shadow: "k" }), text(152, 22, "WAKTU", "Y", { align: "c", shadow: "k" })),
  layer("podium", stamp("podium", 26, 70), stamp("podium", 106, 70), stamp("podium", 186, 70), stamp("podium", 266, 70),
    stamp("turntable", 29, 56), stamp("turntable", 109, 56), stamp("turntable", 189, 56), stamp("turntable", 269, 56)),
  layer("tahun", text(41, 126, "TRADISI", "Y", { align: "c", shadow: "r" }), text(121, 126, "KERONCONG", "Y", { align: "c", shadow: "r" }),
    text(201, 126, "POP-ROCK", "Y", { align: "c", shadow: "r" }), text(281, 126, "ELEKTRONIK", "Y", { align: "c", shadow: "r" })),
  layer("bayang", { shade: true }, ellipse(41, 96, 14, 2, "k"), ellipse(121, 96, 14, 2, "k"), ellipse(201, 96, 14, 2, "k"), ellipse(281, 96, 14, 2, "k"), ellipse(160, 183, 28, 2, "k")),
  layer("tanaman", stamp("bush_flower", 20, 170), stamp("bush", 290, 170)),
  layer("debu", (c) => { const r = c.rng(33); for (let i = 0; i < 22; i++) c.px(Math.floor(r() * 316), 52 + Math.floor(r() * 130), "f") }),
  glow("f", { r: 3, strength: 0.4 }))

// =============================================================
// TAHAP 5 — Panggung Latihan Kibor (Misi 6 Postur, Misi 7 Tuts Raksasa)
// =============================================================
sprite("metronome", { w: 10, h: 16, outline: "k" }, poly([2, 15, 8, 15, 6, 1, 4, 1], "O"), rect(4, 4, 2, 9, "o"), line(5, 12, 7, 3, "Y"), px(7, 3, "Q"), rect(2, 14, 6, 2, "b"))
sprite("stool", { w: 18, h: 16, outline: "k" }, ellipse(9, 4, 8, 3, "Q"), ellipse(9, 3, 7, 2, "P"), rect(3, 7, 2, 8, "b"), rect(13, 7, 2, 8, "b"), rect(8, 7, 2, 8, "O"))
sprite("curtain", { w: 40, h: 46, outline: "k" }, rect(0, 0, 40, 46, "Q"),
  (c) => { for (let x = 3; x < 40; x += 6) c.vline(x, 0, 46, "q"); for (let x = 0; x < 40; x += 6) c.vline(x, 0, 46, "P") }, rect(0, 0, 40, 4, "Y"), hline(0, 4, 40, "y"))
sprite("poster_notes", { w: 22, h: 28, outline: "k" }, rect(0, 0, 22, 28, "w"), rect(2, 2, 18, 24, "L"),
  (c) => { for (let y = 8; y < 24; y += 4) c.hline(3, y, 16, "M"); c.circ(8, 12, 2, "k"); c.vline(10, 5, 8, "k"); c.circ(15, 17, 2, "k"); c.vline(17, 10, 8, "k") })

scene("kibor_int", { w: 320, h: 192, bg: "L" },
  layer("lantai", rect(0, 48, 320, 144, "o"), (c) => { for (let y = 48; y < 192; y += 10) c.hline(0, y, 320, "O"); for (let y = 48; y < 192; y += 20) for (let x = 0; x < 320; x += 40) c.vline(x + ((y / 20) % 2) * 20, y, 10, "O") },
    rect(28, 108, 264, 68, "M"), box(28, 108, 264, 68, "N"), box(32, 112, 256, 60, "l")),
  layer("dinding", rect(0, 0, 320, 48, "L"), (c) => { for (let x = 0; x < 320; x += 16) c.vline(x, 0, 44, "l") }, rect(0, 44, 320, 4, "M"), hline(0, 44, 320, "N")),
  layer("sisi", rect(0, 48, 8, 136, "M"), rect(312, 48, 8, 136, "M"), vline(8, 48, 136, "N"), vline(311, 48, 136, "N"),
    rect(0, 184, 144, 8, "M"), rect(176, 184, 144, 8, "M"), hline(0, 184, 144, "N"), hline(176, 184, 144, "N"),
    rect(144, 184, 32, 8, "t"), box(144, 184, 32, 8, "i"), hline(148, 187, 24, "g")),
  layer("hiasan", stamp("curtain", 12, 2), stamp("curtain", 268, 2), stamp("poster_notes", 70, 10), stamp("poster_notes", 228, 10),
    text(160, 8, "PANGGUNG", "Y", { align: "c", shadow: "N" }), text(160, 18, "KIBOR", "Y", { align: "c", shadow: "N" })),
  layer("piano", stamp("piano_grand", 128, 50), stamp("stool", 151, 92), stamp("metronome", 200, 66)),
  layer("tutsRaksasa",
    (c) => { for (let i = 0; i < 5; i++) { const x = 40 + i * 48; c.rect(x, 116, 44, 52, "K"); c.rect(x + 1, 117, 42, 49, "w"); c.rect(x + 1, 160, 42, 6, "L"); c.hline(x + 1, 166, 42, "M"); c.rect(x + 2, 118, 40, 2, "W") } }),
  layer("bayang", { shade: true }, ellipse(160, 96, 30, 3, "k"), ellipse(160, 183, 28, 2, "k")),
  layer("tanaman", stamp("bush_flower", 20, 170), stamp("bush", 290, 170)),
  layer("debu", (c) => { const r = c.rng(55); for (let i = 0; i < 18; i++) c.px(Math.floor(r() * 316), 52 + Math.floor(r() * 130), "y") }),
  glow("y", { r: 3, strength: 0.4 }))

// =============================================================
// TAHAP 6 — Taman Kaca Karya + Aula Pagelaran Agung
// =============================================================
sprite("glass_pane", { w: 16, h: 24 }, rect(0, 0, 16, 24, "a"), rect(1, 1, 14, 22, "A"), rect(1, 1, 14, 8, "a"), line(3, 20, 11, 3, "w"), line(6, 21, 12, 9, "w"), box(0, 0, 16, 24, "t"))
sprite("planter", { w: 26, h: 16, outline: "k" }, rect(0, 6, 26, 10, "O"), rect(0, 6, 26, 2, "o"), rect(2, 8, 22, 6, "b"),
  px(5, 3, "P"), px(5, 4, "G"), px(5, 5, "G"), px(12, 2, "W"), px(12, 3, "Y"), px(12, 4, "G"), px(12, 5, "G"), px(19, 3, "Q"), px(19, 4, "G"), px(19, 5, "G"))
sprite("pond", { w: 80, h: 32, outline: "k" }, ellipse(40, 16, 39, 15, "N"), ellipse(40, 16, 37, 13, "A"), ellipse(40, 14, 30, 8, "a"), line(18, 12, 28, 10, "w"), line(50, 18, 62, 16, "w"))
sprite("seat", { w: 11, h: 11, outline: "k" }, rect(0, 3, 11, 8, "Q"), rect(1, 0, 9, 5, "P"), rect(0, 3, 2, 8, "R"), rect(9, 3, 2, 8, "R"))
sprite("grow_pot", { w: 30, h: 24, outline: "k" }, rect(2, 10, 26, 14, "M"), rect(2, 10, 26, 3, "L"), rect(4, 13, 22, 9, "j"), rect(13, 2, 4, 9, "G"), px(11, 3, "g"), px(10, 4, "g"), px(18, 3, "g"), px(19, 4, "g"), ellipse(15, 2, 3, 2, "P"), px(15, 2, "Y"))

scene("taman_int", { w: 320, h: 192, bg: "t" },
  layer("lantai", rect(0, 48, 320, 144, "g"), (c) => { for (let y = 48; y < 192; y += 16) c.hline(0, y, 320, "G"); for (let x = 0; x < 320; x += 16) c.vline(x, 48, 144, "G") },
    rect(16, 56, 288, 120, "t"), (c) => { for (let y = 56; y < 176; y += 16) c.hline(16, y, 288, "q"); for (let x = 16; x < 304; x += 16) c.vline(x, 56, 120, "q") }, box(16, 56, 288, 120, "i")),
  layer("dinding", rect(0, 0, 320, 48, "a"), (c) => { for (let x = 0; x < 320; x += 16) { c.rect(x, 0, 16, 44, "A"); c.rect(x + 1, 1, 14, 42, "a"); c.line(x + 3, 40, x + 11, 4, "w"); c.vline(x, 0, 44, "t") } }, rect(0, 40, 320, 8, "q"), hline(0, 40, 320, "t"), hline(0, 47, 320, "i")),
  layer("sisi", rect(0, 48, 8, 136, "q"), rect(312, 48, 8, 136, "q"), vline(8, 48, 136, "i"), vline(311, 48, 136, "i"),
    rect(0, 184, 144, 8, "q"), rect(176, 184, 144, 8, "q"), hline(0, 184, 144, "t"), hline(176, 184, 144, "t"),
    rect(144, 184, 32, 8, "Q"), box(144, 184, 32, 8, "R"), hline(148, 187, 24, "p")),
  layer("hiasan", text(160, 12, "TAMAN KACA", "i", { align: "c", shadow: "w" }), text(160, 24, "KARYA", "i", { align: "c", shadow: "w" })),
  layer("kolam", stamp("pond", 120, 88)),
  layer("bunga", stamp("planter", 24, 60), stamp("planter", 270, 60), stamp("planter", 24, 150), stamp("planter", 270, 150),
    stamp("bench", 70, 168), stamp("bench", 228, 168), stamp("lamp", 108, 60), stamp("lamp", 204, 60),
    scatter("flowers_a", 18, 62, 284, 110, 22, { on: "t", rflip: "x" })),
  layer("pot", stamp("grow_pot", 246, 98)),
  layer("bayang", { shade: true }, ellipse(160, 108, 36, 5, "k"), ellipse(261, 120, 13, 2, "k"), ellipse(160, 183, 28, 2, "k")),
  layer("debu", (c) => { const r = c.rng(77); for (let i = 0; i < 24; i++) c.px(Math.floor(r() * 316), 52 + Math.floor(r() * 130), "f") }),
  glow("f", { r: 3, strength: 0.45 }))

scene("aula_int", { w: 320, h: 192, bg: "N" },
  layer("lantai", rect(0, 48, 320, 144, "L"), (c) => { for (let y = 112; y < 192; y += 12) c.hline(0, y, 320, "M") },
    rect(8, 48, 304, 58, "O"), (c) => { for (let y = 48; y < 106; y += 8) c.hline(8, y, 304, "b") }, rect(8, 104, 304, 6, "o"), hline(8, 110, 304, "b"),
    rect(138, 112, 44, 72, "Q"), box(138, 112, 44, 72, "R"), (c) => { for (let y = 116; y < 184; y += 8) c.hline(140, y, 40, "P") }),
  layer("dinding", rect(0, 0, 320, 48, "j"), (c) => { for (let x = 0; x < 320; x += 20) c.vline(x, 0, 44, "N") }, rect(0, 44, 320, 4, "N"),
    rect(40, 0, 240, 46, "Q"), (c) => { for (let x = 42; x < 280; x += 8) c.vline(x, 0, 46, "R"); for (let x = 46; x < 280; x += 8) c.vline(x, 0, 46, "P") }, rect(40, 0, 240, 4, "Y"), hline(40, 4, 240, "y"),
    rect(40, 0, 8, 46, "R"), rect(272, 0, 8, 46, "R")),
  layer("sisi", rect(0, 48, 8, 136, "N"), rect(312, 48, 8, 136, "N"), vline(8, 48, 136, "M"), vline(311, 48, 136, "M"),
    rect(0, 184, 144, 8, "N"), rect(176, 184, 144, 8, "N"), hline(0, 184, 144, "M"), hline(176, 184, 144, "M"),
    rect(144, 184, 32, 8, "t"), box(144, 184, 32, 8, "i"), hline(148, 187, 24, "g")),
  layer("hiasan", text(160, 18, "AULA PAGELARAN", "Y", { align: "c", shadow: "N" }), text(160, 28, "AGUNG", "Y", { align: "c", shadow: "N" })),
  layer("panggung", stamp("speaker", 14, 62), stamp("speaker", 290, 62), stamp("mic_stand", 108, 72), stamp("amp", 196, 70), stamp("drum_machine", 232, 74), stamp("lamp", 60, 60), stamp("lamp", 250, 60)),
  layer("kursi", (c) => { for (const x0 of [16, 192]) for (let r = 0; r < 3; r++) for (let q = 0; q < 9; q++) c.stamp("seat", x0 + q * 12.4, 118 + r * 16) }),
  layer("bayang", { shade: true }, ellipse(160, 98, 28, 3, "k"), ellipse(160, 183, 28, 2, "k")),
  layer("debu", (c) => { const r = c.rng(88); for (let i = 0; i < 22; i++) c.px(Math.floor(r() * 316), 52 + Math.floor(r() * 130), "y") }),
  glow("y", { r: 3, strength: 0.4 }))
