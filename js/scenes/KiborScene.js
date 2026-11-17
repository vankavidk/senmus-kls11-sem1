import { KIBOR, KEYS, PATTERNS, VIRTUOSO_INDOOR } from '../data/kibor.js'
import { Audio } from '../systems/Audio.js'
import { WorldScene } from './WorldScene.js'

// Panggung Latihan Kibor: Sang Virtuoso, piano besar (Misi 6 Postur), tuts raksasa di lantai (Misi 7).
export class KiborScene extends WorldScene {
  constructor() { super('Kibor') }

  layout() {
    const K = KIBOR
    return {
      film: 'kibor', mapKey: 'kibor', w: K.w, h: K.h, bg: '#3a2a4d', colliders: K.colliders, spawn: K.spawn, particles: false, npcs: [VIRTUOSO_INDOOR],
      spots: [
        { ...K.exit, range: 14, label: 'Keluar ke Alun-alun', labelDy: 8, run: () => this.goTo('Game', { spawn: { x: 152, y: 226 }, fromInterior: true }) },
        { ...K.piano, range: 20, label: 'Piano Besar', labelDy: 14, run: () => this.touchPiano() },
        { ...K.metronome, range: 18, label: 'Metronom', labelDy: 24, run: () => this.touchMetronome() },
      ],
    }
  }

  afterCreate() {
    this.puzzle = null
    this.keyBoxes = []; this.keyNums = []
    for (let i = 0; i < 5; i++) {
      const x = KEYS.x0 + i * KEYS.step
      const box = this.add.rectangle(x + 1, KEYS.y0 + 1, KEYS.w - 2, KEYS.h - 2, 0xffd467, 0).setOrigin(0).setDepth(1)
      const num = this.add.text(x + KEYS.w / 2, KEYS.y0 + 20, String(i + 1), { fontFamily: 'Silkscreen', fontSize: '16px', color: '#7561ad', stroke: '#fffaf0', strokeThickness: 3 }).setOrigin(0.5).setDepth(2)
      this.keyBoxes.push(box); this.keyNums.push(num)
    }
    this.banner = this.add.text(192, 32, '', { fontFamily: 'Silkscreen', fontSize: '8px', color: '#fff7b8', backgroundColor: '#3a2a4dcc', padding: { x: 6, y: 3 }, align: 'center' })
      .setOrigin(0.5, 0).setDepth(100010).setVisible(false)
    this.uiAdd(this.banner, 192, 32)
    this.onKey = -1
  }

  touchPiano() {
    const t = this.tasks()
    if (!t.talk_virtuoso) { this.hud.toast('Bicaralah dengan Sang Virtuoso dulu.', 2600); return }
    this.launchMini('MiniPosture', { practice: !!t.posture }, (r) => this.finishMission(6, 'posture', 300, r))
  }

  touchMetronome() {
    const t = this.tasks()
    if (!t.posture) { this.hud.toast(t.talk_virtuoso ? 'Atur postur di depan piano besar dulu.' : 'Bicaralah dengan Sang Virtuoso dulu.', 2600); return }
    if (this.puzzle) { this.stopPuzzle(); this.hud.toast('Latihan tuts dihentikan.', 1800); return }
    this.startPuzzle()
  }

  // ---------- Misi 7 ----------
  startPuzzle() {
    this.puzzle = { round: 0, idx: 0, mistakes: 0, lock: 0 }
    Audio.click()
    this.setBanner()
    this.flashHint()
  }

  stopPuzzle() {
    this.puzzle = null
    this.banner.setVisible(false)
    this.keyBoxes.forEach((b) => b.setFillStyle(0xffd467, 0))
    this.hintTween?.stop()
  }

  setBanner() {
    const p = this.puzzle, pat = PATTERNS[p.round]
    const seq = pat.seq.map((n, i) => (i < p.idx ? `[${n}]` : String(n))).join(' ')
    this.banner.setText(`POLA ${p.round + 1}/${PATTERNS.length}: ${pat.name}\n${seq}`).setVisible(true)
  }

  flashHint() {
    this.hintTween?.stop()
    const p = this.puzzle
    if (!p || p.round > 0) return
    const target = PATTERNS[0].seq[p.idx] - 1
    this.keyBoxes.forEach((b, i) => b.setFillStyle(0xffd467, i === target ? 0.35 : 0))
    this.hintTween = this.tweens.add({ targets: this.keyBoxes[target], alpha: { from: 0.4, to: 1 }, yoyo: true, repeat: -1, duration: 420 })
  }

  press(i) {
    const p = this.puzzle
    if (!p || p.lock > 0) return
    const want = PATTERNS[p.round].seq[p.idx] - 1
    this.keyNums[i].setColor('#7561ad')
    Audio.note(KEYS.freq[i], 0.5, 'triangle', 0.3)
    if (i === want) {
      this.pulse(i, 0x72c7ae)
      p.idx += 1
      if (p.idx >= PATTERNS[p.round].seq.length) return this.roundDone()
      this.setBanner(); this.flashHint()
    } else {
      p.mistakes += 1; p.idx = 0
      this.pulse(i, 0xf27a8c)
      Audio.bad()
      this.hud.toast(`Jari ${i + 1} belum waktunya. Ulangi pola dari awal.`, 1800)
      this.setBanner(); this.flashHint()
    }
  }

  pulse(i, color) {
    const b = this.keyBoxes[i]
    this.hintTween?.stop(); b.setAlpha(1)
    b.setFillStyle(color, 0.7)
    this.time.delayedCall(220, () => { if (this.puzzle) this.flashHint(); else b.setFillStyle(0xffd467, 0) ; if (this.puzzle && this.puzzle.round > 0) b.setFillStyle(0xffd467, 0) })
  }

  roundDone() {
    const p = this.puzzle
    p.lock = 1
    Audio.ok()
    if (p.round + 1 >= PATTERNS.length) {
      const score = Math.max(60, 100 - p.mistakes * 10)
      this.stopPuzzle()
      Audio.win()
      this.finishMission(7, 'keys', 350, { score })
      return
    }
    this.hud.toast(`Pola ${p.round + 1} selesai!`, 1500)
    this.time.delayedCall(900, () => { if (!this.puzzle) return; p.round += 1; p.idx = 0; p.lock = 0; this.setBanner(); this.flashHint() })
  }

  update(t, d) {
    super.update(t, d)
    if (!this.puzzle || this.locked()) return
    const x = this.player.x, y = this.player.y
    let on = -1
    if (y > KEYS.y0 && y < KEYS.y0 + KEYS.h) for (let i = 0; i < 5; i++) { const kx = KEYS.x0 + i * KEYS.step; if (x > kx && x < kx + KEYS.w) on = i }
    if (on !== this.onKey) { this.onKey = on; if (on >= 0) this.press(on) }
  }
}
