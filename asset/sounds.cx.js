// Melody Academy: musik latar tiap lokasi + efek suara dunia/UI (gaya pastel, hangat, tidak melelahkan)
const REV = (m = 0.28) => reverb({ mix: m })

// ---------- instrumen ----------
inst("pad", { wave: "triangle", env: [0.5, 0.4, 0.8, 1.0], vol: 0.16 })
inst("pad2", { wave: "sine", env: [0.8, 0.5, 0.8, 1.2], vol: 0.2 })
inst("bass", { wave: "triangle", env: [0.01, 0.12, 0.7, 0.12], vol: 0.42 })
inst("bell", { wave: "fm", fm: { ratio: 3.5, index: 2.2, decay: 0.5 }, env: [0.002, 0.4, 0.0, 0.5], vol: 0.2 })
inst("mallet", { wave: "fm", fm: { ratio: 2, index: 1.6, decay: 0.18 }, env: [0.002, 0.2, 0.0, 0.25], vol: 0.26 })
inst("box", { wave: "fm", fm: { ratio: 4, index: 1.2, decay: 0.3 }, env: [0.001, 0.3, 0.0, 0.4], vol: 0.16 })
inst("epiano", { wave: "fm", fm: { ratio: 1, index: 1.4, decay: 0.5 }, env: [0.004, 0.5, 0.25, 0.4], vol: 0.26 })
inst("flute", { wave: "sine", vibrato: { rate: 5, depth: 0.25 }, env: [0.12, 0.2, 0.7, 0.35], vol: 0.3 })
inst("pluck", { wave: "square", duty: 0.25, env: [0.002, 0.14, 0.0, 0.1], vol: 0.12, filter: { type: "lp", cutoff: 2600 } })
inst("gong", { wave: "fm", fm: { ratio: 1.41, index: 3, decay: 2.5 }, env: [0.004, 1.6, 0.0, 2.0], vol: 0.32 })
inst("sub", { wave: "sine", env: [0.02, 0.2, 0.8, 0.3], vol: 0.5 })

const ch = (names, o = 3, tail = " - - -") => names.map((c) => chord(c, o) + tail)

// ---------- musik ----------
// Menu: lydian, melayang
song("m_menu", { bpm: 78, bars: 8, vol: 0.8, fx: [REV(0.32), limiter({ ceiling: 0.9 })] },
  track("pad", ch(["Cmaj7", "Am7", "Fmaj7", "G6", "Cmaj7", "Em7", "Fmaj7", "G6"], 3, " - - - | - - - - | - - - - | - - - -").join(" | ")),
  track("bass", ["C2", "A1", "F2", "G2", "C2", "E2", "F2", "G2"].map((n) => n + " - - - | - - - - | - - - - | - - - -").join(" | ")),
  track("bell", ["E5 . G5 . B5 . G5 . | E5 . . . . . . .", "C5 . E5 . A5 . E5 . | . . . . . . . .", "A5 . C6 . E6 . C6 . | A5 . . . . . . .", "D5 . G5 . B5 . D6 . | . . . . . . . ."].join(" | ") + " | " + ["E5 . G5 . B5 . G5 . | E5 . . . . . . .", "G5 . B5 . E6 . B5 . | . . . . . . . .", "A5 . C6 . E6 . C6 . | A5 . . . . . . .", "B5 . D6 . G6 . D6 . | . . . . . . . ."].join(" | ")))

// Alun-alun: cerah, langkah ringan
song("m_world", { bpm: 104, bars: 8, vol: 0.8, fx: [REV(0.2), limiter({ ceiling: 0.9 })] },
  track("pad", ["G3+B3+D4", "D3+F#3+A3", "E3+G3+B3", "C3+E3+G3", "G3+B3+D4", "D3+F#3+A3", "C3+E3+G3", "D3+F#3+A3"].map((c) => c + " - - - - - - - | - - - - - - - -").join(" | ")),
  track("bass", ["G2 . . . G2 . D3 .", "D2 . . . D2 . A2 .", "E2 . . . E2 . B2 .", "C2 . . . C2 . G2 ."].concat(["G2 . . . G2 . D3 .", "D2 . . . D2 . A2 .", "C2 . . . C2 . G2 .", "D2 . . . D2 . A2 ."]).map((p) => p + " " + p).join(" | ")),
  track("mallet", ["B4 . D5 . G5 . D5 . | B4 . . . . . A4 .", "A4 . D5 . F#5 . D5 . | A4 . . . . . . .", "G4 . B4 . E5 . B4 . | G4 . . . . . A4 .", "E5 . G5 . C6 . G5 . | E5 . . . . . . ."].concat(["B4 . D5 . G5 . B5 . | A5 . . . G5 . . .", "A4 . D5 . F#5 . A5 . | F#5 . . . . . . .", "C5 . E5 . G5 . E5 . | C5 . . . D5 . E5 .", "D5 . F#5 . A5 . F#5 . | D5 . . . . . . ."]).join(" | ")),
  track("hat", ". . x . . . x . | . . x . . . x x"),
  track("kick", "x . . . . . . . | x . . . . . x ."))

// Galeri Etnik: pentatonik, napas bambu, gong rendah
song("m_galeri", { bpm: 70, bars: 8, vol: 0.85, fx: [REV(0.35), limiter({ ceiling: 0.9 })] },
  track("sub", "A1 - - - - - - - | - - - - - - - - | A1 - - - - - - - | - - - - - - - - | D2 - - - - - - - | - - - - - - - - | A1 - - - - - - - | E2 - - - - - - -"),
  track("pad2", "A3+E4 - - - - - - - | - - - - - - - - | A3+E4 - - - - - - - | - - - - - - - - | D3+A3 - - - - - - - | - - - - - - - - | A3+E4 - - - - - - - | G3+D4 - - - - - - -"),
  track("flute", "A4 - - - C5 - D5 - | E5 - - - - - - - | D5 - C5 - A4 - - - | G4 - - - - - - - | D5 - - - E5 - G5 - | A5 - - - - - E5 - | D5 - C5 - D5 - E5 - | C5 - - - A4 - - -"),
  track("gong", "x . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . | x . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . ."),
  track("bell", ". . . . . . . . | . . . . A5 . . . | . . . . . . . . | . . . . . . E5 . | . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . ."))

// Lab DNA Genre: chill elektronik
song("m_lab", { bpm: 98, bars: 8, vol: 0.8, fx: [REV(0.16), limiter({ ceiling: 0.9 })] },
  track("pad", ["D3+F3+A3+C4", "G3+Bb3+D4+F4", "Bb2+D3+F3+A3", "A2+C3+E3+G3"].concat(["D3+F3+A3+C4", "G3+Bb3+D4+F4", "Bb2+D3+F3+A3", "A2+C#3+E3+G3"]).map((c) => c + " - - - - - - - | - - - - - - - -").join(" | ")),
  track("bass", ["D2 . . D2 . . D3 .", "G2 . . G2 . . G3 .", "Bb1 . . Bb1 . . Bb2 .", "A1 . . A1 . . A2 ."].concat(["D2 . . D2 . . D3 .", "G2 . . G2 . . G3 .", "Bb1 . . Bb1 . . Bb2 .", "A1 . . A1 . . E2 ."]).map((p) => p + " " + p).join(" | ")),
  track("pluck", ["A4 . . D5 . . F5 . | . . A4 . . . . .", "Bb4 . . D5 . . G5 . | . . F5 . . . . .", "F4 . . A4 . . D5 . | . . A4 . . . . .", "E4 . . G4 . . C5 . | . . E5 . . . . ."].concat(["A4 . . D5 . . F5 . | . . A5 . . . G5 .", "Bb4 . . D5 . . G5 . | . . F5 . . . D5 .", "F4 . . A4 . . D5 . | . . F5 . . . A4 .", "E4 . . G4 . . C#5 . | . . E5 . . . . ."]).join(" | ")),
  track("kick", "x . . . . . x . | . . x . . . . ."),
  track("clap", ". . . . x . . . | . . . . x . . ."),
  track("hat", ". x . x . x . x | . x . x . x . x"))

// Lorong Waktu: kotak musik + detak jam
song("m_lorong", { bpm: 84, bars: 8, vol: 0.8, fx: [REV(0.3), limiter({ ceiling: 0.9 })] },
  track("pad2", ["F3+A3+C4", "Dm", "Bb2+D3+F3", "C3+E3+G3"].map((c) => (c === "Dm" ? "D3+F3+A3" : c) + " - - - - - - - | - - - - - - - -").concat(["F3+A3+C4 - - - - - - - | - - - - - - - -", "A2+C3+E3 - - - - - - - | - - - - - - - -", "Bb2+D3+F3 - - - - - - - | - - - - - - - -", "C3+E3+G3 - - - - - - - | - - - - - - - -"]).join(" | ")),
  track("bass", ["F2", "D2", "Bb1", "C2", "F2", "A1", "Bb1", "C2"].map((n) => n + " - - - - - - - - | - - - - - - - -").join(" | ")),
  track("box", ["A5 C6 F6 C6 A5 C6 F6 C6 | A5 C6 F6 C6 A5 C6 F6 C6", "A5 D6 F6 D6 A5 D6 F6 D6 | A5 D6 F6 D6 A5 D6 F6 D6", "Bb5 D6 F6 D6 Bb5 D6 F6 D6 | Bb5 D6 F6 D6 Bb5 D6 F6 D6", "G5 C6 E6 C6 G5 C6 E6 C6 | G5 C6 E6 C6 G5 C6 E6 C6"].concat(["A5 C6 F6 C6 A5 C6 F6 C6 | A5 C6 F6 C6 A5 C6 F6 C6", "A5 C6 E6 C6 A5 C6 E6 C6 | A5 C6 E6 C6 A5 C6 E6 C6", "Bb5 D6 F6 D6 Bb5 D6 F6 D6 | A5 D6 F6 D6 A5 D6 F6 D6", "G5 C6 E6 C6 G5 C6 E6 C6 | G5 C6 E6 G6 - - - -"]).join(" | ")),
  track("hat", "x . . . x . . . | x . . . x . . ."))

// Ruang Kedap: hening, jarang
song("m_kedap", { bpm: 60, bars: 8, vol: 0.9, fx: [REV(0.5), limiter({ ceiling: 0.9 })] },
  track("pad2", ["Ab3+Eb4+C4", "F3+C4+Ab3", "Db3+Ab3+F4", "Eb3+Bb3+G4"].map((c) => c + " - - - - - - - - - - - - - - -").join(" | ")),
  track("sub", ["Ab1", "F1", "Db2", "Eb2"].map((n) => n + " - - - - - - - - - - - - - - -").join(" | ")),
  track("bell", [". . . . . . . . Eb5 . . . . . . .", ". . . . C5 . . . . . . . . . . .", ". . . . . . . . . . Ab5 . . . . .", ". . . . . . F5 . . . . . . . . ."].concat([". . . . . . . . C6 . . . . . . .", ". . . . Ab5 . . . . . . . . . . .", ". . . . . . . . . . F5 . . . . .", ". . . . . . G5 . . . . . Eb5 . . ."]).join(" | ")))

// Panggung Kibor: piano lembut
song("m_kibor", { bpm: 76, bars: 8, vol: 0.85, fx: [REV(0.25), limiter({ ceiling: 0.9 })] },
  track("epiano", ["C3 E3 G3 E4 G3 E3 C4 E3", "A2 C3 E3 C4 E3 C3 A3 C3", "F2 A2 C3 A3 C3 A2 F3 A2", "G2 B2 D3 B3 D3 B2 G3 B2"].concat(["C3 E3 G3 E4 G3 E3 C4 E3", "E3 G3 B3 G4 B3 G3 E4 G3", "F2 A2 C3 A3 C3 A2 F3 A2", "G2 B2 D3 G3 D3 B2 G3 D3"]).map((p) => p + " | " + p).join(" | ")),
  track("flute", [". . . . . . . . | E5 - - - D5 - - -", ". . . . . . . . | C5 - - - A4 - - -", ". . . . . . . . | A4 - C5 - F5 - - -", ". . . . . . . . | G5 - - - D5 - - -"].concat([". . . . . . . . | G5 - - - E5 - - -", ". . . . . . . . | B4 - D5 - G5 - - -", ". . . . . . . . | A5 - - - C6 - - -", ". . . . . . . . | B5 - A5 - G5 - - -"]).join(" | ")),
  track("sub", ["C2", "A1", "F1", "G1", "C2", "E2", "F1", "G1"].map((n) => n + " - - - - - - - | - - - - - - - -").join(" | ")))

// Taman Kaca: berkilau, berangin
song("m_taman", { bpm: 92, bars: 8, vol: 0.8, fx: [REV(0.4), limiter({ ceiling: 0.9 })] },
  track("pad2", ["G3+B3+D4", "E3+G3+B3", "C3+E3+G3+B3", "D3+F#3+A3"].concat(["G3+B3+D4", "B2+D3+F#3+A3", "C3+E3+G3+B3", "D3+F#3+A3"]).map((c) => c + " - - - - - - - | - - - - - - - -").join(" | ")),
  track("box", ["D6 B5 G5 B5 D6 B5 G5 B5", "E6 B5 G5 B5 E6 B5 G5 B5", "E6 C6 G5 C6 E6 C6 G5 C6", "F#6 D6 A5 D6 F#6 D6 A5 D6"].concat(["D6 B5 G5 B5 D6 G6 D6 B5", "D6 B5 F#5 B5 D6 B5 F#5 B5", "E6 C6 G5 C6 B5 G5 E5 G5", "F#6 D6 A5 D6 A5 F#5 D5 F#5"]).map((p) => p + " | " + p).join(" | ")),
  track("flute", ["B4 - - - D5 - - - | G5 - - - - - - -", "E5 - - - G5 - - - | B5 - - - - - - -", "G5 - - - E5 - - - | C5 - - - - - - -", "A5 - - - F#5 - - - | D5 - - - - - - -"].concat([". . . . . . . . | . . . . . . . .", ". . . . . . . . | . . . . . . . .", ". . . . . . . . | . . . . . . . .", ". . . . . . . . | . . . . . . . ."]).join(" | ")),
  track("bass", ["G2", "E2", "C2", "D2", "G2", "B1", "C2", "D2"].map((n) => n + " - - - - - - - | - - - - - - - -").join(" | ")))

// Aula Pagelaran: hangat, megah tapi lembut
song("m_aula", { bpm: 92, bars: 8, vol: 0.8, fx: [REV(0.3), limiter({ ceiling: 0.9 })] },
  track("pad", ["D3+F#3+A3", "B2+D3+F#3", "G2+B2+D3", "A2+C#3+E3"].concat(["D3+F#3+A3", "E3+G3+B3", "G2+B2+D3", "A2+C#3+E3+G3"]).map((c) => c + " - - - - - - - | - - - - - - - -").join(" | ")),
  track("bass", ["D2 . . . D2 . A2 .", "B1 . . . B1 . F#2 .", "G1 . . . G1 . D2 .", "A1 . . . A1 . E2 ."].concat(["D2 . . . D2 . A2 .", "E2 . . . E2 . B2 .", "G1 . . . G1 . D2 .", "A1 . . . A1 . E2 ."]).map((p) => p + " " + p).join(" | ")),
  track("bell", ["F#5 - A5 - D6 - - - | A5 - - - - - - -", "D5 - F#5 - B5 - - - | F#5 - - - - - - -", "B4 - D5 - G5 - - - | D5 - - - - - - -", "E5 - A5 - C#6 - - - | A5 - - - - - - -"].concat(["F#5 - A5 - D6 - E6 - | F#6 - - - D6 - - -", "G5 - B5 - E6 - - - | B5 - - - G5 - - -", "B4 - D5 - G5 - B5 - | D6 - - - - - - -", "C#6 - E6 - A5 - - - | A5 - - - - - - -"]).join(" | ")),
  track("kick", "x . . . . . . . | . . x . . . . ."),
  track("hat", ". . x . . . x . | . . x . . . x ."))

// Layar Materi (film): tenang, tidak menutupi narasi
song("m_film", { bpm: 68, bars: 8, vol: 0.7, fx: [REV(0.4), limiter({ ceiling: 0.9 })] },
  track("pad2", ["E3+G3+B3", "C3+E3+G3", "G2+B2+D3", "D3+F#3+A3"].concat(["E3+G3+B3", "A2+C3+E3", "C3+E3+G3", "D3+F#3+A3"]).map((c) => c + " - - - - - - - | - - - - - - - -").join(" | ")),
  track("sub", ["E2", "C2", "G1", "D2", "E2", "A1", "C2", "D2"].map((n) => n + " - - - - - - - | - - - - - - - -").join(" | ")),
  track("epiano", ["B4 - - - G4 - - - | E4 - - - - - - -", "G4 - - - E4 - - - | C4 - - - - - - -", "D4 - - - B3 - - - | G3 - - - - - - -", "F#4 - - - A4 - - - | D5 - - - - - - -"].concat(["B4 - - - G4 - - - | E5 - - - - - - -", "E4 - - - C4 - - - | A3 - - - - - - -", "G4 - - - E4 - - - | C5 - - - - - - -", "A4 - - - F#4 - - - | D4 - - - - - - -"]).join(" | ")))

// ---------- SFX ----------
const tap = (f, d = 0.07, v = 0.5) => [noise({ color: "brown", dur: d, env: [0.001, d * 0.7, 0, 0.02], filter: { type: "lp", from: f, to: f * 0.4 }, vol: v })]
sfx("step_1", { vol: 0.35 }, ...tap(900), tone({ wave: "sine", freq: 130, to: 80, dur: 0.05, env: [0.001, 0.04, 0, 0.02], vol: 0.35 }))
sfx("step_2", { base: "step_1", pitch: 1.5 })
sfx("step_3", { base: "step_1", pitch: -1.5 })
sfx("step_4", { base: "step_1", pitch: 3 })

sfx("door", { vol: 0.55, fx: [REV(0.15)] },
  noise({ color: "pink", dur: 0.35, env: [0.02, 0.2, 0.2, 0.15], filter: { type: "bp", from: 400, to: 1800 }, vol: 0.25 }),
  at(0.28, tone({ wave: "sine", freq: 196, to: 140, dur: 0.12, env: [0.002, 0.1, 0, 0.1], vol: 0.5 })),
  at(0.3, tone({ wave: "triangle", freq: "G5", dur: 0.2, env: [0.002, 0.18, 0, 0.2], vol: 0.2 })))
sfx("interact", { vol: 0.4 },
  tone({ wave: "sine", freq: "E5", to: "A5", slide: 0.06, dur: 0.09, env: [0.002, 0.07, 0.2, 0.08] }),
  at(0.04, tone({ wave: "triangle", freq: "E6", dur: 0.12, env: [0.002, 0.1, 0, 0.12], vol: 0.5 })))
sfx("dlg_open", { vol: 0.4, fx: [REV(0.15)] },
  tone({ wave: "triangle", freq: "C6", dur: 0.08, env: [0.002, 0.07, 0, 0.1] }),
  at(0.06, tone({ wave: "triangle", freq: "G6", dur: 0.12, env: [0.002, 0.1, 0, 0.14] })))
sfx("dlg_next", { vol: 0.28 }, tone({ wave: "square", duty: 0.25, freq: "A5", to: "C6", slide: 0.03, dur: 0.045, env: [0.001, 0.035, 0.1, 0.03], vol: 0.5 }))
sfx("blip_1", { vol: 0.16 }, tone({ wave: "triangle", freq: "E5", dur: 0.03, env: [0.001, 0.025, 0, 0.015] }))
sfx("blip_2", { base: "blip_1", pitch: 2 })
sfx("blip_3", { base: "blip_1", pitch: 4 })
sfx("ui_click", { vol: 0.38 }, tone({ wave: "square", duty: 0.25, freq: "D6", dur: 0.04, env: [0.001, 0.03, 0.1, 0.03], vol: 0.5 }))
sfx("ui_back", { vol: 0.38 }, tone({ wave: "square", duty: 0.25, freq: "A5", to: "E5", slide: 0.05, dur: 0.06, env: [0.001, 0.05, 0.1, 0.04], vol: 0.5 }))
sfx("zoom", { vol: 0.25 }, tone({ wave: "sine", freq: "C6", dur: 0.04, env: [0.001, 0.03, 0, 0.03] }))
sfx("toast", { vol: 0.4, fx: [REV(0.12)] },
  tone({ wave: "fm", fm: { ratio: 3, index: 1.2, decay: 0.2 }, freq: "E6", dur: 0.1, env: [0.002, 0.1, 0, 0.15] }),
  at(0.08, tone({ wave: "fm", fm: { ratio: 3, index: 1.2, decay: 0.2 }, freq: "B6", dur: 0.12, env: [0.002, 0.1, 0, 0.2] })))
sfx("ip_gain", { vol: 0.5, fx: [REV(0.1)] },
  tone({ wave: "square", duty: 0.25, freq: "B5", dur: 0.055, env: [0.001, 0.02, 0.6, 0.02], vol: 0.5 }),
  at(0.055, tone({ wave: "square", duty: 0.25, freq: "E6", dur: 0.2, env: [0.001, 0.05, 0.5, 0.18], vol: 0.5 })),
  at(0.06, tone({ wave: "fm", fm: { ratio: 3.5, index: 1.5, decay: 0.3 }, freq: "E7", dur: 0.2, env: [0.001, 0.2, 0, 0.3], vol: 0.15 })))
sfx("task_done", { vol: 0.5, fx: [REV(0.2)] },
  tone({ wave: "triangle", freq: "C5", dur: 0.12, env: [0.003, 0.1, 0.3, 0.1] }),
  at(0.1, tone({ wave: "triangle", freq: "E5", dur: 0.12, env: [0.003, 0.1, 0.3, 0.1] })),
  at(0.2, tone({ wave: "triangle", freq: "G5", dur: 0.28, env: [0.003, 0.15, 0.3, 0.3] })),
  at(0.2, tone({ wave: "fm", fm: { ratio: 3.5, index: 1.2, decay: 0.4 }, freq: "G6", dur: 0.3, env: [0.002, 0.3, 0, 0.4], vol: 0.2 })))
sfx("quest_done", { vol: 0.55, fx: [REV(0.3), limiter({ ceiling: 0.9 })] },
  ...["C5", "E5", "G5", "C6", "E6"].map((n, i) => at(i * 0.09, tone({ wave: "triangle", freq: n, dur: 0.22, env: [0.003, 0.15, 0.3, 0.3] }))),
  at(0.45, tone({ wave: "fm", fm: { ratio: 3.5, index: 1.4, decay: 0.8 }, freq: "G6", dur: 0.7, env: [0.002, 0.7, 0, 0.8], vol: 0.3 })),
  at(0.45, tone({ wave: "sine", freq: "C4", dur: 0.7, env: [0.01, 0.4, 0.4, 0.5], vol: 0.3 })))
sfx("fanfare", { vol: 0.6, fx: [REV(0.35), limiter({ ceiling: 0.9 })] },
  ...[["C5", 0], ["E5", 0.12], ["G5", 0.24], ["C6", 0.36], ["G5", 0.6], ["C6", 0.72], ["E6", 0.84]].map(([n, t]) => at(t, tone({ wave: "triangle", freq: n, dur: 0.26, env: [0.004, 0.16, 0.4, 0.3] }))),
  at(0.96, tone({ wave: "triangle", freq: "C4+E4+G4+C5".split("+")[0], dur: 1.2, env: [0.01, 0.6, 0.4, 0.9], vol: 0.35 })),
  at(0.96, tone({ wave: "triangle", freq: "G6", dur: 1.2, env: [0.01, 0.7, 0.3, 0.9], vol: 0.3 })),
  at(0.96, tone({ wave: "fm", fm: { ratio: 3.5, index: 1.4, decay: 1.2 }, freq: "E6", dur: 1.4, env: [0.002, 1.2, 0, 1.2], vol: 0.25 })))
sfx("film_appear", { vol: 0.4, fx: [REV(0.25)] },
  tone({ wave: "fm", fm: { ratio: 3.5, index: 1.4, decay: 0.3 }, freq: "A6", dur: 0.16, env: [0.002, 0.15, 0, 0.25] }),
  at(0.05, tone({ wave: "sine", freq: "E7", dur: 0.12, env: [0.002, 0.1, 0, 0.2], vol: 0.35 })))
sfx("pickup", { vol: 0.45, fx: [REV(0.15)] },
  tone({ wave: "triangle", freq: "G5", to: "D6", slide: 0.07, dur: 0.1, env: [0.002, 0.08, 0.3, 0.1] }),
  at(0.07, tone({ wave: "fm", fm: { ratio: 3, index: 1.3, decay: 0.3 }, freq: "G6", dur: 0.2, env: [0.002, 0.2, 0, 0.3], vol: 0.35 })))
sfx("ok", { vol: 0.45, fx: [REV(0.12)] },
  tone({ wave: "triangle", freq: "E5", dur: 0.1, env: [0.003, 0.08, 0.3, 0.08] }),
  at(0.08, tone({ wave: "triangle", freq: "A5", dur: 0.2, env: [0.003, 0.15, 0.3, 0.15] })))
sfx("bad", { vol: 0.4 },
  tone({ wave: "triangle", freq: "E4", to: "C4", slide: 0.14, dur: 0.18, env: [0.004, 0.14, 0.3, 0.1] }),
  at(0.09, tone({ wave: "sine", freq: "A3", to: "F3", slide: 0.14, dur: 0.22, env: [0.004, 0.18, 0.3, 0.12], vol: 0.8 })))
sfx("win", { vol: 0.55, fx: [REV(0.3), limiter({ ceiling: 0.9 })] },
  ...["C5", "E5", "G5", "C6"].map((n, i) => at(i * 0.11, tone({ wave: "triangle", freq: n, dur: 0.36, env: [0.003, 0.2, 0.3, 0.3] }))),
  at(0.44, tone({ wave: "fm", fm: { ratio: 3.5, index: 1.4, decay: 0.9 }, freq: "E6", dur: 0.9, env: [0.002, 0.8, 0, 0.9], vol: 0.25 })))
sfx("locked", { vol: 0.35 }, tone({ wave: "triangle", freq: "D4", dur: 0.07, env: [0.002, 0.06, 0.1, 0.05] }), at(0.08, tone({ wave: "triangle", freq: "D4", dur: 0.1, env: [0.002, 0.08, 0.1, 0.06] })))
sfx("amb_world", { dur: 12, loop: true, vol: 0.35 },
  noise({ color: "pink", dur: 12.5, filter: { type: "lp", cutoff: 1400 }, vol: 0.25 }),
  noise({ color: "brown", dur: 12.5, filter: { type: "lp", from: 300, to: 700 }, vol: 0.3 }))
