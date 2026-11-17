// Sintesis suara WebAudio (tanpa file audio). AudioContext dibuka saat gestur pertama pemain.
let ctx = null, master = null, noiseBuf = null
let musicBus = null, sfxBus = null, duckGain = null

// ---------- musik & efek berbasis file (dibuat dengan chirp) ----------
const SFX_NAMES = ['step_1', 'step_2', 'step_3', 'step_4', 'door', 'interact', 'dlg_open', 'dlg_next', 'blip_1', 'blip_2', 'blip_3', 'ui_click', 'ui_back', 'zoom', 'toast', 'ip_gain', 'task_done', 'quest_done', 'fanfare', 'film_appear', 'pickup', 'ok', 'bad', 'win', 'locked']
const SFX_GAIN = { step_1: 0.55, step_2: 0.55, step_3: 0.55, step_4: 0.55, blip_1: 0.5, blip_2: 0.5, blip_3: 0.5, dlg_next: 0.6, ui_click: 0.7, ui_back: 0.7, zoom: 0.5, interact: 0.8, film_appear: 0.8, toast: 0.8 }
const MUSIC_LEVEL = 0.32
const bufs = {}          // nama -> AudioBuffer
const pending = {}       // nama -> Promise (musik dimuat saat dibutuhkan)
let curMusic = null      // { name, src, gain }
let wantMusic = null
let sfxLoaded = false
let sets = { music: true, sfx: true }
try { Object.assign(sets, JSON.parse(localStorage.getItem('melody.audio') || '{}')) } catch { /* abaikan */ }

function load(kind, name0) {
  const name = kind === 'mix' ? `mix_${name0}` : kind === 'clip' ? `clip_${name0}` : name0
  if (bufs[name]) return Promise.resolve(bufs[name])
  if (pending[name]) return pending[name]
  const url = kind === 'music' ? `assets/audio/music/${name}.mp3` : kind === 'mix' ? `assets/audio/mix/${name0}.mp3` : kind === 'clip' ? `assets/audio/clips/${name0}.mp3` : `assets/audio/sfx/${name}.wav`
  pending[name] = fetch(url).then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer() })
    .then((ab) => new Promise((res, rej) => ctx.decodeAudioData(ab, res, rej)))
    .then((b) => (bufs[name] = b))
    .catch(() => { delete pending[name]; return null })
  return pending[name]
}
function startMusic() {
  if (!ctx || !wantMusic || !sets.music) return
  const name = wantMusic
  if (curMusic && curMusic.name === name) return
  load('music', name).then((b) => {
    if (!b || wantMusic !== name || !sets.music || (curMusic && curMusic.name === name)) return
    const t = ctx.currentTime
    if (curMusic) { const old = curMusic; old.gain.gain.cancelScheduledValues(t); old.gain.gain.setValueAtTime(old.gain.gain.value, t); old.gain.gain.linearRampToValueAtTime(0, t + 1.1); try { old.src.stop(t + 1.2) } catch { /* sudah berhenti */ } }
    const src = ctx.createBufferSource(); src.buffer = b; src.loop = true
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(1, t + 1.4)
    src.connect(g).connect(musicBus); src.start(t)
    curMusic = { name, src, gain: g }
  })
}
function stopMusic() {
  if (!curMusic || !ctx) return
  const old = curMusic; curMusic = null
  const t = ctx.currentTime
  old.gain.gain.cancelScheduledValues(t); old.gain.gain.setValueAtTime(old.gain.gain.value, t); old.gain.gain.linearRampToValueAtTime(0, t + 0.5)
  try { old.src.stop(t + 0.6) } catch { /* sudah berhenti */ }
}
function applyBuses() {
  if (!ctx) return
  musicBus.gain.value = sets.music ? MUSIC_LEVEL : 0
  sfxBus.gain.value = sets.sfx ? 1 : 0
}

function ensure() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.9
    master.connect(ctx.destination)
    musicBus = ctx.createGain(); duckGain = ctx.createGain(); duckGain.connect(master); musicBus.connect(duckGain)
    sfxBus = ctx.createGain(); sfxBus.connect(master)
    applyBuses()
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const d = noiseBuf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  }
  if (ctx.state === 'suspended') ctx.resume()
  if (!sfxLoaded) { sfxLoaded = true; SFX_NAMES.forEach((n) => load('sfx', n)); startMusic() }
  return ctx
}
// gestur pertama (klik/tombol/sentuh) membuka audio dan memulai musik yang menunggu
if (typeof window !== 'undefined') {
  const first = () => { ensure() }
  window.addEventListener('pointerdown', first, { capture: true })
  window.addEventListener('keydown', first, { capture: true })
  window.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('button')
    if (!b || b.id === 'btn-mute-m' || b.id === 'btn-mute-s') return
    if (b.id !== 'btn-zin' && b.id !== 'btn-zout') Audio.sfx('ui_click')
  })
}

// partial-partial tidak harmonis = karakter logam gamelan
const VOICES = {
  gong: { f: 62, parts: [[1, 0.7], [2.01, 0.35], [2.76, 0.25], [4.1, 0.12], [5.4, 0.08]], decay: 3.4 },
  kempul: { f: 110, parts: [[1, 0.6], [2.02, 0.3], [3.1, 0.2], [4.3, 0.1]], decay: 2.0 },
  kenong: { f: 196, parts: [[1, 0.55], [2.4, 0.3], [3.9, 0.15]], decay: 1.1 },
  gender: { f: 392, parts: [[1, 0.5], [2.76, 0.3], [5.4, 0.2]], decay: 0.75 },
}


// ---------- suara tambahan Tahap 3 (semua menerima waktu t dan tujuan dest) ----------
function osc(t, f, dur, dest, { type = 'sine', vol = 0.3, a = 0.005, to } = {}) {
  const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t)
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur)
  const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(dest); o.start(t); o.stop(t + dur + 0.03)
}
function nz(t, dur, dest, { type = 'highpass', f = 6000, q = 1, vol = 0.3 } = {}) {
  const src = ctx.createBufferSource(); src.buffer = noiseBuf
  const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q
  const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur)
  src.connect(fl).connect(g).connect(dest); src.start(t); src.stop(t + dur + 0.02)
}
function pl(t, f, dur, dest, vol = 0.2, lp = 3000, type = 'triangle') {
  const o = ctx.createOscillator(); o.type = type; o.frequency.value = f
  const fl = ctx.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = lp
  const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(fl).connect(g).connect(dest); o.start(t); o.stop(t + dur + 0.03)
}
function shaper(amt) {
  const s = ctx.createWaveShaper(), n = 1024, cv = new Float32Array(n)
  for (let i = 0; i < n; i++) { const x = (i * 2) / n - 1; cv[i] = Math.tanh(x * amt) }
  s.curve = cv
  return s
}
function dist(t, freqs, dur, dest, amt, vol, lp) {
  const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur)
  const fl = ctx.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = lp
  const sh = shaper(amt); sh.connect(fl); fl.connect(g); g.connect(dest)
  for (const f of freqs) { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.connect(sh); o.start(t); o.stop(t + dur + 0.05) }
}
// suara untuk pola loop: h = { v, f, len }
const VOICE = {
  kick: (t, d) => osc(t, 140, 0.22, d, { vol: 0.9, to: 45 }),
  snare: (t, d) => { nz(t, 0.14, d, { type: 'bandpass', f: 1900, q: 0.8, vol: 0.35 }); osc(t, 190, 0.1, d, { type: 'triangle', vol: 0.25 }) },
  hat: (t, d) => nz(t, 0.05, d, { f: 8000, vol: 0.18 }),
  synth: (t, d, h) => { osc(t, h.f, 0.22, d, { type: 'sawtooth', vol: 0.08 }); osc(t, h.f * 1.006, 0.22, d, { type: 'sawtooth', vol: 0.08 }) },
  pluck: (t, d, h) => { pl(t, h.f, 0.6, d, h.vol ?? 0.3, 2600); nz(t, 0.02, d, { type: 'bandpass', f: 2500, vol: 0.08 }) },
  blow: (t, d, h) => { osc(t, h.f, h.len, d, { type: 'triangle', vol: 0.22, a: 0.09 }); nz(t, h.len, d, { type: 'bandpass', f: 2400, q: 1.2, vol: 0.05 }) },
}

export const Audio = {
  unlock() { ensure() },

  // Musik latar per lokasi (crossfade). Aman dipanggil sebelum gestur pertama: dimulai saat audio terbuka.
  music(name) { wantMusic = name; if (ctx) startMusic() },
  stopMusic() { wantMusic = null; stopMusic() },
  // Turunkan musik saat mini-game (yang punya bunyi sendiri)
  duck(on) { if (!ctx) return; const t = ctx.currentTime; duckGain.gain.cancelScheduledValues(t); duckGain.gain.setTargetAtTime(on ? 0.15 : 1, t, 0.25) },
  sfx(name, { vol = 1, rate = 1 } = {}) {
    const c = ensure(); if (!c || !sets.sfx) return false
    const b = bufs[name]; if (!b) return false
    const src = c.createBufferSource(); src.buffer = b; src.playbackRate.value = rate
    const g = c.createGain(); g.gain.value = vol * (SFX_GAIN[name] ?? 1)
    src.connect(g).connect(sfxBus); src.start()
    return true
  },
  step() { this.sfx(`step_${1 + Math.floor(Math.random() * 4)}`, { vol: 0.8 + Math.random() * 0.3, rate: 0.95 + Math.random() * 0.1 }) },
  blip() { this.sfx(`blip_${1 + Math.floor(Math.random() * 3)}`, { rate: 0.95 + Math.random() * 0.12 }) },
  settings() { return { ...sets } },

  // Tepuk tangan penonton: ledakan derau pendek yang acak, memudar
  applause(sec = 3) {
    const c = ensure(); if (!c || !sets.sfx || !noiseBuf) return
    const t0 = c.currentTime
    for (let i = 0; i < sec * 38; i++) {
      const t = t0 + Math.random() * sec, fade = 1 - (t - t0) / sec * 0.85
      const src = c.createBufferSource(); src.buffer = noiseBuf
      const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1400 + Math.random() * 2200; bp.Q.value = 0.8
      const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.16 * fade * (0.4 + Math.random() * 0.6), t + 0.004); g.gain.exponentialRampToValueAtTime(0.0008, t + 0.05 + Math.random() * 0.04)
      src.connect(bp).connect(g).connect(sfxBus); src.start(t, Math.random() * 0.8, 0.12)
    }
  },

  // Klip suara/musik berkas (melodi pot kaca, musik pagelaran). Mengembalikan { stop() }.
  loadClips(names) { ensure(); return Promise.all(names.map((n) => load('clip', n))) },
  clip(name, { loop = false, vol = 1, onend } = {}) {
    const c = ensure(); let src = null, g = null, dead = false
    const handle = {
      stop() {
        dead = true
        if (!src) return
        const t = c.currentTime; g.gain.cancelScheduledValues(t); g.gain.setTargetAtTime(0, t, 0.05)
        try { src.stop(t + 0.3) } catch { /* sudah berhenti */ }
      },
    }
    if (!c) return handle
    load('clip', name).then((b) => {
      if (!b || dead) return
      src = c.createBufferSource(); src.buffer = b; src.loop = loop
      g = c.createGain(); g.gain.value = vol
      src.connect(g).connect(sfxBus)
      if (onend) src.onended = () => { if (!dead) onend() }
      src.start()
    })
    return handle
  },

  // ---- Mixing Deck: chip berupa loop 4 birama yang diputar serempak, dan bisa diganti kapan saja tanpa putus irama ----
  loadChips(names) { ensure(); return Promise.all(names.map((n) => load('mix', n))) },
  chipMixer(loopLen) {
    const c = ensure()
    if (!c) return { setTrack() {}, stop() {}, phase: () => 0 }
    const comp = c.createDynamicsCompressor()
    comp.threshold.value = -16; comp.knee.value = 12; comp.ratio.value = 3.5; comp.attack.value = 0.004; comp.release.value = 0.2
    const bus = c.createGain(); bus.gain.value = 0.62
    bus.connect(comp); comp.connect(sfxBus)
    const trackGain = [1, 0.9, 1]
    const tr = [0, 1, 2].map(() => ({ name: null, srcs: [] }))
    const start = c.currentTime + 0.12
    let nextB = start, stopped = false
    const bufOf = (n) => bufs[`mix_${n}`]
    const play = (t, buf, when, offset = 0) => {
      if (offset >= buf.duration - 0.02) return
      const src = c.createBufferSource(); src.buffer = buf
      const g = c.createGain(); g.gain.value = trackGain[tr.indexOf(t)] ?? 1
      src.connect(g).connect(bus); src.start(when, offset)
      const rec = { src, g }
      t.srcs.push(rec)
      src.onended = () => { const k = t.srcs.indexOf(rec); if (k >= 0) t.srcs.splice(k, 1) }
    }
    const silence = (t) => {
      const now = c.currentTime
      for (const { src, g } of t.srcs) { try { g.gain.cancelScheduledValues(now); g.gain.setTargetAtTime(0, now, 0.012); src.stop(now + 0.08) } catch { /* sudah berhenti */ } }
      t.srcs = []
    }
    const tick = () => {
      if (stopped) return
      while (nextB < c.currentTime + 0.6) {
        for (const t of tr) { const b = t.name && bufOf(t.name); if (b) play(t, b, nextB) }
        nextB += loopLen
      }
    }
    tick()
    const id = setInterval(tick, 100)
    const apply = (i) => {
      const t = tr[i], b = t.name && bufOf(t.name)
      silence(t)
      if (!b || stopped) return
      const now = c.currentTime
      const lastB = nextB - loopLen   // batas loop terakhir yang sudah dijadwalkan
      if (lastB > now) { play(t, b, lastB); if (lastB - loopLen >= start && now > lastB - loopLen) play(t, b, now + 0.004, now - (lastB - loopLen)) }
      else play(t, b, now + 0.004, now - lastB)
    }
    return {
      setTrack(i, name) {
        tr[i].name = name
        if (!name) { silence(tr[i]); return }
        if (bufOf(name)) apply(i)
        else load('mix', name).then(() => { if (tr[i].name === name) apply(i) })
      },
      phase: () => Math.max(0, (((c.currentTime - start) / loopLen) % 1 + 1) % 1),
      stop() {
        stopped = true; clearInterval(id)
        const now = c.currentTime
        bus.gain.cancelScheduledValues(now); bus.gain.setTargetAtTime(0, now, 0.03)
        for (const t of tr) silence(t)
        setTimeout(() => { try { bus.disconnect(); comp.disconnect() } catch { /* sudah putus */ } }, 400)
      },
    }
  },
  setSetting(key, on) {
    sets[key] = !!on
    try { localStorage.setItem('melody.audio', JSON.stringify(sets)) } catch { /* abaikan */ }
    applyBuses()
    if (key === 'music') { if (on) startMusic(); else stopMusic() }
  },
  debug() { return { ctx: ctx && ctx.state, music: curMusic && curMusic.name, want: wantMusic, loaded: Object.keys(bufs).length, sets } },

  strike(key) {
    const c = ensure(); if (!c) return
    const t = c.currentTime
    if (key === 'cengceng') {
      const src = c.createBufferSource(); src.buffer = noiseBuf
      const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 5200
      const g = c.createGain(); g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.16)
      src.connect(hp).connect(g).connect(sfxBus); src.start(t); src.stop(t + 0.2)
      for (const f of [4800, 6100]) {
        const o = c.createOscillator(); o.type = 'square'; o.frequency.value = f
        const og = c.createGain(); og.gain.setValueAtTime(0.06, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
        o.connect(og).connect(sfxBus); o.start(t); o.stop(t + 0.15)
      }
      return
    }
    const v = VOICES[key]; if (!v) return
    for (const [m, a] of v.parts) {
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = v.f * m
      const g = c.createGain()
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(a * 0.5, t + 0.012)
      g.gain.exponentialRampToValueAtTime(0.0001, t + v.decay / (1 + m * 0.35))
      o.connect(g).connect(sfxBus); o.start(t); o.stop(t + v.decay + 0.1)
    }
  },

  // Saluang: nada tiup berembus + vibrato. Kontrol on/off/inhale agar napas terdengar mengalir.
  saluang() {
    const c = ensure()
    if (!c) return { on() {}, off() {}, inhale() {}, stop() {} }
    const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = 523
    const o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = 1046
    const lfo = c.createOscillator(); lfo.frequency.value = 5.2
    const lg = c.createGain(); lg.gain.value = 7
    lfo.connect(lg); lg.connect(o.frequency); lg.connect(o2.frequency)
    const g = c.createGain(); g.gain.value = 0
    const g2 = c.createGain(); g2.gain.value = 0.12
    const n = c.createBufferSource(); n.buffer = noiseBuf; n.loop = true
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2400; bp.Q.value = 1.2
    const ng = c.createGain(); ng.gain.value = 0.5
    o.connect(g); o2.connect(g2).connect(g); n.connect(bp).connect(ng).connect(g); g.connect(sfxBus)
    const t = c.currentTime
    o.start(t); o2.start(t); lfo.start(t); n.start(t)
    const to = (v, d) => { g.gain.cancelScheduledValues(c.currentTime); g.gain.setTargetAtTime(v, c.currentTime, d) }
    return {
      on() { to(0.26, 0.05) },
      off() { to(0, 0.05) },
      inhale() { to(0.09, 0.04) },
      stop() { to(0, 0.03); setTimeout(() => { try { o.stop(); o2.stop(); lfo.stop(); n.stop() } catch { /* sudah berhenti */ } }, 200) },
    }
  },

  note(freq, dur = 0.18, type = 'triangle', vol = 0.25, delay = 0) {
    const c = ensure(); if (!c) return
    const t = c.currentTime + delay
    const o = c.createOscillator(); o.type = type; o.frequency.value = freq
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g).connect(sfxBus); o.start(t); o.stop(t + dur + 0.05)
  },
  ok() { if (!this.sfx('ok')) { this.note(659, 0.12); this.note(880, 0.18, 'triangle', 0.25, 0.09) } },
  bad() { if (!this.sfx('bad')) { this.note(150, 0.28, 'sawtooth', 0.18); this.note(120, 0.3, 'sawtooth', 0.16, 0.08) } },
  win() { if (!this.sfx('win')) [523, 659, 784, 1047].forEach((f, i) => this.note(f, 0.34, 'triangle', 0.28, i * 0.11)) },
  click() { if (!this.sfx('ui_click')) this.note(740, 0.06, 'square', 0.1) },

  // Loop dinamis: getHits() dipanggil ulang tiap putaran, jadi perubahan slider langsung terdengar.
  dynLoop(getHits, bpm = 100, steps = 8) {
    const c = ensure()
    if (!c) return { stop() {} }
    const stepDur = 60 / bpm / 2, len = steps * stepDur
    const out = c.createGain(); out.connect(sfxBus)
    let next = c.currentTime + 0.06
    const tick = () => {
      while (next < c.currentTime + 0.35) { for (const h of getHits()) VOICE[h.v]?.(next + (h.step + (h.off || 0)) * stepDur, out, h); next += len }
    }
    tick()
    const id = setInterval(tick, 60)
    return { stop() { clearInterval(id); out.gain.cancelScheduledValues(c.currentTime); out.gain.setTargetAtTime(0, c.currentTime, 0.02); setTimeout(() => out.disconnect(), 300) } }
  },

  // Potongan era musik untuk Lorong Waktu (i = 0..3)
  era(i) {
    const c = ensure(); if (!c) return
    const t = c.currentTime + 0.02, d = sfxBus
    const at = (ms, fn) => setTimeout(fn, ms)
    if (i === 0) { this.strike('gong'); at(500, () => this.strike('kenong')); at(800, () => this.strike('gender')); at(1000, () => this.strike('kempul')); at(1250, () => this.strike('gender')); at(1500, () => this.strike('kenong')) }
    else if (i === 1) { [0, 0.3, 0.45, 0.75, 0.9, 1.2, 1.35, 1.65].forEach((o, k) => pl(t + o, k % 2 ? 392 : 330, 0.4, d, 0.22, 3800)); [0.15, 0.6, 1.05, 1.5].forEach((o) => pl(t + o, 98, 0.35, d, 0.3, 700)) }
    else if (i === 2) { this.play('power'); at(450, () => this.play('drums')); at(1100, () => this.play('power')); at(1500, () => this.play('bass')) }
    else { const l = this.mixLoop([{ hits: [0, 4, 8, 12].map((s) => ({ v: 'kick', step: s, off: 0 })).concat([0, 2, 4, 6, 8, 10, 12, 14].map((s) => ({ v: 'hat', step: s, off: 0 }))) }, { hits: [329.6, 392, 493.9, 587.3, 493.9, 392, 329.6, 392].map((f, k) => ({ v: 'synth', step: k * 2, off: 0, f })) }]); setTimeout(() => l.stop(), 3200) }
  },

  // Pratinjau instrumen Misi 3 (Pop = bersih & rileks, Rock = distorsi & menghentak)
  play(name) {
    const c = ensure(); if (!c) return
    const t = c.currentTime + 0.01, d = sfxBus
    switch (name) {
      case 'strum': [262, 330, 392, 523].forEach((f, i) => pl(t + i * 0.045, f, 1.0, d, 0.16, 2400)); break
      case 'uke': [392, 494, 587, 784].forEach((f, i) => pl(t + i * 0.035, f, 0.5, d, 0.15, 4200)); break
      case 'tamb': [0, 0.05, 0.1, 0.16].forEach((o) => nz(t + o, 0.07, d, { type: 'bandpass', f: 6500, q: 2, vol: 0.2 })); break
      case 'power': dist(t, [82.4, 123.5, 164.8], 0.75, d, 14, 0.32, 3000); break
      case 'bass': dist(t, [55], 0.55, d, 3, 0.5, 500); break
      case 'drums': VOICE.kick(t, d); VOICE.hat(t + 0.12, d); VOICE.snare(t + 0.25, d); VOICE.kick(t + 0.37, d); VOICE.snare(t + 0.5, d); break
      default: break
    }
  },

  // Loop Mixing Desk. tracks = [{ hits: [{ v, step, off, f, len }] }], 16 langkah/loop.
  mixLoop(tracks, bpm = 104) {
    const c = ensure()
    if (!c) return { stop() {}, phase: () => 0 }
    const stepDur = 60 / bpm / 2, len = 16 * stepDur
    const out = c.createGain(); out.connect(sfxBus)
    const start = c.currentTime + 0.08
    let next = start
    const sched = (t0) => { for (const tr of tracks) for (const h of tr.hits) VOICE[h.v]?.(t0 + (h.step + (h.off || 0)) * stepDur, out, h) }
    const tick = () => { while (next < c.currentTime + 0.5) { sched(next); next += len } }
    tick()
    const id = setInterval(tick, 80)
    return {
      phase: () => (((c.currentTime - start) / len) % 1 + 1) % 1,
      stop() { clearInterval(id); out.gain.cancelScheduledValues(c.currentTime); out.gain.setTargetAtTime(0, c.currentTime, 0.02); setTimeout(() => out.disconnect(), 300) },
    }
  },
}
