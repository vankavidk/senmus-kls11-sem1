import { GAME_W as W, GAME_H as H } from '../config.js'
import { FILMS } from '../data/films.js'
import { makeProp } from '../ui/filmProps.js'
import { Audio } from '../systems/Audio.js'
import { closeMini } from '../ui/miniUi.js'

const $ = (id) => document.getElementById(id)
const CPS = 30
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
const hex = (n) => `#${n.toString(16).padStart(6, '0')}`

// Layar Materi: film pendek. Narasi diketik; saat sebuah kata penting terucap, bendanya muncul di layar.
export class FilmScene extends Phaser.Scene {
  constructor() { super('Film') }
  init(d) { this.parentKey = d.parent; this.film = FILMS[d.film]; this.filmId = d.film }

  create() {
    const F = this.film
    this.cameras.main.setBackgroundColor('#2d1f3d')
    this.cameras.main.fadeIn(400, 255, 255, 255)
    this.bg = this.add.graphics().setDepth(0)
    this.dust = Array.from({ length: 26 }, () => ({ x: Math.random() * W, y: Math.random() * H, v: 4 + Math.random() * 10, r: 0.6 + Math.random() * 1.4 }))
    this.dustG = this.add.graphics().setDepth(1)
    this.bars = this.add.graphics().setDepth(60)
    this.bars.fillStyle(0x1b1226).fillRect(0, 0, W, 24)
    this.add.text(8, 8, F.subtitle, { fontFamily: 'Silkscreen', fontSize: '8px', color: '#c1aae8' }).setDepth(61)
    this.titleT = null
    this.scenes = [{ title: true, bg: [0x2d1f3d, 0x7561ad], text: F.intro, props: [] }, ...F.scenes]
    this.idx = -1; this.props = []; this.segs = []; this.typed = 0; this.len = 0; this.done = true; this.autoAt = 0; this.ended = false
    $('film').classList.remove('hidden')
    $('film-skip').onclick = () => this.end(false)
    this.input.on('pointerdown', () => this.advance())
    const kb = this.input.keyboard
    kb.on('keydown-ENTER', () => this.advance()); kb.on('keydown-SPACE', () => this.advance()); kb.on('keydown-E', () => this.advance())
    kb.on('keydown-ESC', () => this.end(false))
    this.events.once('shutdown', () => { $('film').classList.add('hidden'); kb.removeAllListeners() })
    this.showScene(0)
  }

  drawBg(top, bot) {
    const g = this.bg
    g.clear()
    const a = Phaser.Display.Color.IntegerToColor(top), b = Phaser.Display.Color.IntegerToColor(bot)
    const n = 18
    for (let i = 0; i < n; i++) {
      const c = Phaser.Display.Color.Interpolate.ColorWithColor(a, b, n - 1, i)
      g.fillStyle(Phaser.Display.Color.GetColor(c.r, c.g, c.b)).fillRect(0, 24 + (i * (H - 24)) / n, W, (H - 24) / n + 1)
    }
    g.fillStyle(0x000000, 0.12).fillEllipse(W / 2, 150, 300, 40)
  }

  showScene(i) {
    this.idx = i
    const sc = this.scenes[i]
    this.props.forEach((p) => p.c.destroy())
    this.titleT?.destroy(); this.titleT = null
    this.drawBg(...sc.bg)
    this.props = (sc.props || []).map((d) => makeProp(this, d))
    this.props.forEach((p) => { if (p.def.initial) p.appear(true) })
    if (sc.title) {
      this.titleT = this.add.text(W / 2, 74, this.film.title.toUpperCase(), { fontFamily: 'Silkscreen', fontSize: '16px', color: '#fff7b8', stroke: '#3a2a4d', strokeThickness: 5, align: 'center', wordWrap: { width: W - 30 } }).setOrigin(0.5).setDepth(8)
      this.titleT.setAlpha(0); this.tweens.add({ targets: this.titleT, alpha: 1, y: 68, duration: 900 })
    }
    // urai penanda [id:kata]
    this.segs = []; let pos = 0
    for (const part of sc.text.split(/(\[[^\]]+\])/)) {
      if (!part) continue
      const m = part.match(/^\[([^:\]]+):([^\]]+)\]$/)
      const t = m ? m[2] : part
      this.segs.push({ t, kw: !!m, id: m ? m[1] : null, start: pos, fired: false })
      pos += t.length
    }
    this.len = pos; this.typed = 0; this.done = false
    $('film-name').textContent = this.film.guide
    $('film-step').textContent = i === 0 ? '' : `ADEGAN ${i}/${this.scenes.length - 1}`
    $('film-hint').textContent = 'ketuk / ENTER: lanjut'
    this.render()
    this.focused = null
    if (i > 0) Audio.sfx('interact')
  }

  fire(seg) {
    if (!seg.id || seg.fired) return
    seg.fired = true
    const [id, act] = seg.id.split('!')
    const p = this.props.find((q) => q.id === id)
    if (!p) return
    if (!p.shown) { p.appear(); Audio.sfx('film_appear', { rate: 0.92 + Math.random() * 0.2 }) }
    if (act) p.act?.(act)
    this.props.forEach((q) => q.shown && q.focus(q === p))
  }

  render() {
    let rem = Math.floor(this.typed), html = ''
    for (const s of this.segs) {
      const take = s.t.slice(0, Math.max(0, rem)); rem -= s.t.length
      html += s.kw ? `<b>${esc(take)}</b>` : esc(take)
      if (take.length && s.kw) this.fire(s)
    }
    $('film-text').innerHTML = html
  }

  advance() {
    if (this.ended) return
    Audio.unlock()
    if (!this.done) { this.typed = this.len; this.render(); this.finishTyping(); return }
    if (this.idx + 1 < this.scenes.length) this.showScene(this.idx + 1)
    else this.end(true)
  }

  finishTyping() {
    this.done = true
    this.autoAt = this.time.now + 4200 + this.len * 55
    this.segs.forEach((s) => this.fire(s))
    $('film-hint').textContent = this.idx + 1 < this.scenes.length ? 'ketuk / ENTER: lanjut' : 'ketuk / ENTER: selesai'
  }

  end(complete) {
    if (this.ended) return
    this.ended = true
    $('film').classList.add('hidden')
    closeMini(this, complete ? { score: 100 } : null)
  }

  update(time, delta) {
    const t = time / 1000
    for (const p of this.props) p.tick?.(t, delta)
    this.dustG.clear()
    for (const d of this.dust) { d.y -= (d.v * delta) / 1000; if (d.y < 24) { d.y = H; d.x = Math.random() * W } this.dustG.fillStyle(0xfff7b8, 0.5).fillCircle(d.x + Math.sin(t + d.y * 0.05) * 3, d.y, d.r) }
    if (this.ended) return
    if (!this.done) {
      this.typed += (CPS * delta) / 1000
      if (this.typed >= this.len) { this.typed = this.len; this.render(); this.finishTyping() } else this.render()
    } else if (time > this.autoAt && this.autoAt > 0) { this.autoAt = 0; this.advance() }
  }
}
