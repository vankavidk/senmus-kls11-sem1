// Benda/ilustrasi yang muncul di layar materi (Film). Tiap prop: { c: Container, tick(t), appear(), focus(on), act(name) }.
const P = { ink: 0x3a2a4d, paper: 0xfffaf0, lilac: 0xc1aae8, lilacD: 0x7561ad, pink: 0xf594b5, pinkD: 0xc96890, mint: 0xa8e8d3, mintD: 0x4ea08a, gold: 0xffd467, red: 0xf27a8c, blue: 0x9fd3f5 }
const line = (g, pts, w, col) => { g.lineStyle(w, col); g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.strokePath() }

const KINDS = {
  sprite(scene, c, g, d, p) {
    const im = scene.add.image(0, 0, d.key).setScale(d.s || 3)
    c.add(im); p.h = im.displayHeight
  },
  big(scene, c, g, d, p) {
    const t = scene.add.text(0, 0, d.text, { fontFamily: 'Silkscreen', fontSize: `${d.size || 14}px`, color: '#fff7b8', stroke: '#3a2a4d', strokeThickness: 4, align: 'center' }).setOrigin(0.5)
    c.add(t); p.h = t.height
  },
  wave(scene, c, g, d, p) {
    c.add(g)
    const w = d.w || 160, amp = d.amp || 12, jag = d.jag || 0, col = d.color || P.mint, sp = d.speed || 3
    p.h = amp * 2 + 8
    p.tick = (t) => {
      g.clear(); g.lineStyle(2, col); g.beginPath()
      for (let x = 0; x <= w; x += 2) {
        const k = x / w
        const y = amp * Math.sin(k * 14 + t * sp) + jag * Math.sin(k * 47 + t * sp * 2.3) * Math.sin(k * 9 - t * 1.7)
        x ? g.lineTo(x - w / 2, y) : g.moveTo(x - w / 2, y)
      }
      g.strokePath()
    }
  },
  stream(scene, c, g, d, p) {
    c.add(g)
    const w = d.w || 200
    p.h = 24
    p.tick = (t) => {
      g.clear(); g.lineStyle(2, P.lilacD, 0.5); g.lineBetween(-w / 2, 0, w / 2, 0)
      for (let i = 0; i < 14; i++) { const x = ((i * w) / 14 + t * 46) % w; g.fillStyle(P.mint).fillCircle(x - w / 2, Math.sin(x * 0.08 + t * 2) * 4, 3) }
    }
  },
  breath(scene, c, g, d, p) {
    c.add(g)
    p.h = 40
    p.tick = (t) => {
      g.clear()
      const r = 14 + 5 * Math.sin(t * 2.2)
      g.fillStyle(P.mint, 0.35).fillCircle(0, 0, r + 6); g.fillStyle(P.mint).fillCircle(0, 0, r); g.lineStyle(2, P.ink).strokeCircle(0, 0, r)
      for (let i = 0; i < 4; i++) { const x = 22 + ((t * 40 + i * 14) % 56); g.fillStyle(P.gold, 1 - (x - 22) / 56).fillCircle(x, Math.sin(x * 0.3) * 3, 2.5) }
    }
  },
  pin(scene, c, g, d, p) {
    c.add(g)
    p.h = 18
    p.tick = (t) => { g.clear(); const b = Math.sin(t * 4) * 2; g.fillStyle(P.pinkD).fillCircle(0, -9 + b, 5.5); g.fillTriangle(-4, -6 + b, 4, -6 + b, 0, 2 + b); g.fillStyle(P.paper).fillCircle(0, -9 + b, 2) }
  },
  peta(scene, c, g, d, p) {
    c.add(g)
    p.h = 50
    g.fillStyle(P.mint).lineStyle(2, P.ink)
    for (const [x, y, w, h] of [[-46, -6, 44, 12], [-4, -22, 34, 24], [4, 14, 60, 9], [44, 14, 9, 7], [52, -8, 28, 14], [76, 6, 14, 16]]) { g.fillEllipse(x, y, w, h); g.strokeEllipse(x, y, w, h) }
  },
  dna(scene, c, g, d, p) {
    c.add(g)
    p.h = 90
    p.tick = (t) => {
      g.clear()
      for (let y = -42; y <= 42; y += 6) {
        const x = 15 * Math.sin(y * 0.14 + t * 2)
        g.lineStyle(1, P.lilacD, 0.6).lineBetween(-x, y, x, y)
        g.fillStyle(P.pink).fillCircle(x, y, 2.4); g.fillStyle(P.mint).fillCircle(-x, y, 2.4)
      }
    }
  },
  staff(scene, c, g, d, p) {
    c.add(g)
    const w = d.w || 120, notes = d.notes || [0, 1, 2, 0]
    p.h = 40
    p.tick = (t) => {
      g.clear()
      for (let i = 0; i < 5; i++) g.lineStyle(1, P.ink, 0.7).lineBetween(-w / 2, -12 + i * 6, w / 2, -12 + i * 6)
      const hi = Math.floor(t * 3) % notes.length
      notes.forEach((n, i) => {
        const x = -w / 2 + 8 + (i * (w - 16)) / Math.max(1, notes.length - 1), y = 14 - n * 3
        g.fillStyle(i === hi ? P.gold : P.pinkD).fillCircle(x, y, i === hi ? 3.6 : 2.6)
        g.lineStyle(1, P.ink).lineBetween(x + 2.5, y, x + 2.5, y - 10)
      })
    }
  },
  beats(scene, c, g, d, p) {
    c.add(g)
    const n = d.n || 4, jit = d.jitter || 0, seeds = Array.from({ length: n }, (_, i) => Math.sin(i * 12.9) * jit)
    p.h = 30
    p.tick = (t) => {
      g.clear()
      const hi = Math.floor(t * 3) % n
      for (let i = 0; i < n; i++) {
        const x = -((n - 1) * 15) / 2 + i * 15 + seeds[i], s = i === hi ? 13 : 9
        g.fillStyle(i === hi ? P.gold : (d.color || P.mint)).fillRect(x - s / 2, -s / 2 + (jit ? seeds[i] * 0.6 : 0), s, s); g.lineStyle(2, P.ink).strokeRect(x - s / 2, -s / 2 + (jit ? seeds[i] * 0.6 : 0), s, s)
      }
    }
  },
  chord(scene, c, g, d, p) {
    c.add(g)
    p.h = 36
    p.tick = (t) => { g.clear(); const k = 1 + 0.12 * Math.sin(t * 4); for (let i = 0; i < 3; i++) { g.fillStyle([P.pink, P.mint, P.gold][i]).fillCircle(0, -10 + i * 10, 5 * k); g.lineStyle(2, P.ink).strokeCircle(0, -10 + i * 10, 5 * k) } }
  },
  keys(scene, c, g, d, p) {
    c.add(g)
    const n = d.n || 5, kw = 22, kh = 44
    p.h = kh
    for (let i = 0; i < n; i++) {
      const x = (i - (n - 1) / 2) * (kw + 2)
      g.fillStyle(P.paper).fillRect(x - kw / 2, -kh / 2, kw, kh); g.lineStyle(2, P.ink).strokeRect(x - kw / 2, -kh / 2, kw, kh)
      c.add(scene.add.text(x, kh / 2 - 12, String(i + 1), { fontFamily: 'Silkscreen', fontSize: '10px', color: '#7561ad' }).setOrigin(0.5))
    }
  },
  keyhl(scene, c, g, d, p) {
    c.add(g)
    p.h = 44
    p.tick = (t) => { g.clear(); g.fillStyle(P.gold, 0.45 + 0.25 * Math.sin(t * 6)).fillRect(-11, -22, 22, 44); g.lineStyle(2, P.gold).strokeRect(-11, -22, 22, 44) }
  },
  ring(scene, c, g, d, p) {
    c.add(g)
    p.tick = (t) => { g.clear(); g.lineStyle(2, P.gold).strokeCircle(0, 0, (d.r || 9) + Math.sin(t * 5) * 1.5); g.fillStyle(P.gold, 0.25).fillCircle(0, 0, d.r || 9) }
  },
  posture(scene, c, g, d, p) {
    c.add(g)
    p.h = 100
    const HIP = [0, 40], S = [0, -8], HEAD = [3, -25], E = [20, 16], W = [56, 18], F = [69, 18], KN = [34, 38], FT = [34, 61]
    const L = (a, b, w, col) => { g.lineStyle(w, col).lineBetween(a[0], a[1], b[0], b[1]) }
    const D = (a, r, col) => g.fillStyle(col).fillCircle(a[0], a[1], r)
    g.fillStyle(P.lilacD).fillRect(52, 20, 56, 8); g.fillStyle(P.paper).fillRect(52, 28, 56, 10)
    g.fillStyle(0xf594b5).fillRect(-22, 44, 44, 6)
    L(HIP, KN, 7, 0x5b4570); L(KN, FT, 6, 0x5b4570); D(HIP, 3.5, 0x5b4570); D(KN, 3.2, 0x5b4570)
    L(HIP, S, 11, 0x9b86d9); D(S, 5.5, 0x9b86d9)
    L(S, HEAD, 3, 0xf2c9a5); D(HEAD, 9, 0xf2c9a5); g.fillStyle(0x43323f).fillCircle(HEAD[0] - 2, HEAD[1] - 3, 9).fillRect(HEAD[0] - 11, HEAD[1] - 3, 8, 9); g.fillStyle(0xf2c9a5).fillCircle(HEAD[0] + 3, HEAD[1] + 1, 7)
    L(S, E, 6, 0x9b86d9); L(E, W, 5, 0xf2c9a5); L(W, F, 4, 0xf2c9a5); D(E, 3.2, 0x9b86d9)
  },
  cable(scene, c, g, d, p) {
    c.add(g)
    const pts = d.pts
    p.h = 10
    const len = pts.slice(1).reduce((a, q, i) => a + Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]), 0)
    p.tick = (t) => {
      g.clear(); line(g, pts, 3, P.gold)
      let at = ((t * 60) % len), i = 0
      while (i < pts.length - 2 && at > Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1])) { at -= Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); i++ }
      const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]) || 1
      g.fillStyle(P.paper).fillCircle(pts[i][0] + ((pts[i + 1][0] - pts[i][0]) * at) / l, pts[i][1] + ((pts[i + 1][1] - pts[i][1]) * at) / l, 3.5)
    }
  },
  stage(scene, c, g, d, p) {
    c.add(g)
    const w = d.w || 220, h = d.h || 64
    p.h = h + 30
    g.fillStyle(0xb98a5a).fillRect(-w / 2, -h / 2, w, h); g.lineStyle(2, P.ink).strokeRect(-w / 2, -h / 2, w, h)
    g.fillStyle(P.pink).fillRect(-w / 2, -h / 2 - 5, w, 5)
    for (let r = 0; r < 2; r++) for (let i = 0; i < 12; i++) g.fillStyle(r ? P.lilac : P.pinkD).fillCircle(-w / 2 + 12 + i * ((w - 24) / 11), h / 2 + 10 + r * 10, 3)
    c.add(scene.add.text(0, -h / 2 + 4, 'PANGGUNG', { fontFamily: 'Silkscreen', fontSize: '8px', color: '#fffaf0', stroke: '#3a2a4d', strokeThickness: 3 }).setOrigin(0.5, 0))
  },
  osc(scene, c, g, d, p) {
    c.add(g)
    p.h = 64
    p.mode = 'kusut'; p.smooth = 0
    p.act = (a) => { p.mode = a }
    p.tick = (t, dt) => {
      p.smooth += ((p.mode === 'mulus' ? 1 : 0) - p.smooth) * Math.min(1, dt * 0.004)
      g.clear(); g.fillStyle(0x2d1f3d).fillRect(-60, -32, 120, 64); g.lineStyle(2, P.ink).strokeRect(-60, -32, 120, 64)
      g.lineStyle(1, P.mintD, 0.4); for (let i = -2; i <= 2; i++) { g.lineBetween(-60, i * 12, 60, i * 12); g.lineBetween(i * 24, -32, i * 24, 32) }
      g.lineStyle(2, p.smooth > 0.5 ? P.mint : P.red); g.beginPath()
      for (let x = -58; x <= 58; x += 2) { const k = x / 58, y = 10 * Math.sin(k * 6 + t * 3) + (1 - p.smooth) * (9 * Math.sin(k * 31 + t * 7) + 6 * Math.sin(k * 17 - t * 4)); x === -58 ? g.moveTo(x, y) : g.lineTo(x, y) }
      g.strokePath()
    }
  },
  seed(scene, c, g, d, p) {
    c.add(g)
    p.h = 30
    p.tick = (t) => {
      g.clear(); const h = 4 + ((t * 5) % 22)
      g.fillStyle(0x7a5a38).fillEllipse(0, 12, 22, 8)
      g.lineStyle(3, P.mintD).lineBetween(0, 10, 0, 10 - h); g.fillStyle(P.mint).fillEllipse(-5, 10 - h * 0.6, 9, 5); g.fillStyle(P.mint).fillEllipse(5, 10 - h * 0.8, 9, 5)
      if (h > 18) g.fillStyle(P.pink).fillCircle(0, 10 - h - 3, 4)
    }
  },
  feedback(scene, c, g, d, p) {
    c.add(g)
    p.h = 70
    p.tick = (t) => {
      g.clear()
      for (let i = 0; i < 4; i++) { const k = ((t * 0.9 + i / 4) % 1); g.lineStyle(2, P.red, 1 - k).strokeCircle(0, 0, 6 + k * 40) }
      g.lineStyle(2, P.red); g.beginPath(); for (let x = -26; x <= 26; x += 2) { const y = Math.sin(x * 1.3 + t * 30) * (3 + Math.abs(x) * 0.15); x === -26 ? g.moveTo(x, y) : g.lineTo(x, y) } g.strokePath()
    }
  },
  bar(scene, c, g, d, p) {
    c.add(g)
    const w = d.w || 240
    p.h = 14
    p.tick = (t) => {
      g.clear()
      for (let i = 0; i < 24; i++) { const k = i / 23, x = -w / 2 + k * w; g.fillStyle(Phaser.Display.Color.GetColor(Math.round(120 + 135 * k), Math.round(110 + 60 * (1 - k)), Math.round(200 - 100 * k))).fillRect(x, -6, w / 24 + 1, 12) }
      g.lineStyle(2, P.ink).strokeRect(-w / 2, -6, w, 12)
      const x = -w / 2 + (((t * 0.4) % 1)) * w; g.fillStyle(P.paper).fillCircle(x, 0, 4); g.lineStyle(2, P.ink).strokeCircle(x, 0, 4)
    }
  },
}

export function makeProp(scene, d) {
  const c = scene.add.container(d.x, d.y).setDepth(5)
  const p = { id: d.id, c, shown: false, def: d }
  const g = scene.add.graphics()
  KINDS[d.kind](scene, c, g, d, p)
  p.tick?.(0, 16)
  if (d.label) {
    const ly = d.ly ?? ((p.h || 30) / 2 + 8)
    c.add(scene.add.text(0, ly, d.label, { fontFamily: 'Silkscreen', fontSize: '8px', color: '#fff7b8', stroke: '#3a2a4d', strokeThickness: 3, align: 'center' }).setOrigin(0.5, 0))
  }
  c.setAlpha(0).setScale(0.6)
  p.appear = (quiet) => {
    if (p.shown) return
    p.shown = true
    scene.tweens.add({ targets: c, alpha: 1, scale: 1, duration: quiet ? 1 : 340, ease: 'Back.Out' })
    if (quiet) return
    for (let i = 0; i < 8; i++) {
      const s = scene.add.circle(d.x, d.y, 2, P.gold).setDepth(6), a = (i / 8) * Math.PI * 2
      scene.tweens.add({ targets: s, x: d.x + Math.cos(a) * 34, y: d.y + Math.sin(a) * 26, alpha: 0, duration: 520, onComplete: () => s.destroy() })
    }
  }
  p.focus = (on) => scene.tweens.add({ targets: c, alpha: on ? 1 : 0.55, duration: 200 })
  return p
}
