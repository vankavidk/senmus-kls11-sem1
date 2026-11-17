import { GAME_W as W, GAME_H as H } from '../config.js'
import { Audio } from '../systems/Audio.js'
import { txt, exitButton, closeMini } from '../ui/miniUi.js'

// MISI 1: Misteri Napas Tak Terputus (manyisian angok / circular breathing).
// Tahan tombol = meniup (bar napas turun). Lepas di ZONA HIJAU = tarik napas, lalu tahan lagi cepat.
// Jeda terlalu lama, lepas di luar zona, atau napas habis = napas terputus, ulang dari nol.
const DRAIN = 24          // % napas per detik saat meniup
const ZONE = [8, 36]      // zona hijau (% napas)
const GOAL = 10           // detik aliran napas
const INHALE = 0.42       // detik pengisian ulang napas
const GRACE = 0.9         // batas jeda sebelum napas dianggap putus

export class MiniSaluangScene extends Phaser.Scene {
  constructor() { super('MiniSaluang') }
  init(d) { this.parentKey = d.parent; this.practice = !!d.practice }

  create() {
    this.cameras.main.setBackgroundColor('#e2d4f7')
    this.cameras.main.fadeIn(300, 255, 255, 255)
    const g = this.add.graphics().setDepth(0)
    // rumpun bambu
    for (let i = 0; i < 10; i++) {
      const x = 14 + i * 40 + (i % 2) * 7, w = 7 + (i % 3)
      g.fillStyle(i % 2 ? 0xa8e8d3 : 0x9bdb9b).fillRect(x, 0, w, H)
      g.fillStyle(i % 2 ? 0x72c7ae : 0x74be8c)
      for (let y = 18 + (i * 13) % 30; y < H; y += 42) g.fillRect(x - 1, y, w + 2, 3)
    }
    g.fillStyle(0xfffaf0, 0.78).fillRect(0, 0, W, H)
    g.fillStyle(0x74be8c).fillRect(0, H - 14, W, 14)

    this.add.image(46, H - 12, 'npc_maestro_minang').setOrigin(0.5, 1).setScale(4).setDepth(5)
    this.sal = this.add.image(238, 74, 'saluang').setScale(6).setDepth(5)

    txt(this, W / 2, 6, 'MISTERI NAPAS TAK TERPUTUS', { size: 8, color: '#7561ad' })
    this.progText = txt(this, W / 2, 30, '', { size: 8 })
    this.tip = txt(this, W / 2 + 30, 120, '', { size: 8, color: '#c96890' })
    this.hint = txt(this, W / 2, H - 12, 'TAHAN [SPASI] / [E] / SENTUH LAYAR = TIUP', { size: 8, color: '#fffaf0', stroke: '#3a2a4d' })
    this.breakText = txt(this, 8, 6, '', { size: 8, align: 0, color: '#c96890' })
    exitButton(this, () => this.leave(null))

    this.gfx = this.add.graphics().setDepth(6)
    this.emitter = this.add.particles(238 + 40, 74, 'spark', {
      lifespan: 900, speedX: { min: 20, max: 50 }, speedY: { min: -26, max: 6 }, frequency: 70, scale: { min: 1, max: 2 },
      alpha: { start: 1, end: 0 }, emitting: false,
    }).setDepth(7)

    // masukan: tahan = tiup
    this.held = false
    const kb = this.input.keyboard
    kb.addCapture('SPACE')
    for (const key of ['SPACE', 'E']) {
      kb.on(`keydown-${key}`, () => { this.held = true })
      kb.on(`keyup-${key}`, () => { this.held = false })
    }
    this.input.addPointer(1)
    this.input.on('pointerdown', (p, over) => { if (!over.length) this.held = true })
    this.input.on('pointerup', () => { this.held = false })

    this.voice = Audio.saluang()
    this.breaks = 0
    this.resetRun('ready')
    this.t = 0
    this.events.once('shutdown', () => { this.voice.stop(); kb.removeAllListeners() })
  }

  resetRun(state) {
    this.state = state
    this.level = 100
    this.progress = 0
    this.inhaleT = 0
    this.failT = 0
    this.wasHeld = false
  }

  fail(msg) {
    this.breaks += 1
    this.state = 'fail'
    this.failT = 0
    this.failMsg = msg
    this.voice.off()
    this.emitter.emitting = false
    Audio.bad()
    this.cameras.main.shake(180, 0.004)
  }

  leave(result) {
    this.voice.stop()
    closeMini(this, result)
  }

  update(_, delta) {
    const dt = Math.min(delta, 50) / 1000
    this.t += dt
    const held = this.held
    const justPressed = held && !this.wasHeld
    const justReleased = !held && this.wasHeld
    this.wasHeld = held
    const inZone = this.level >= ZONE[0] && this.level <= ZONE[1]
    let tip = ''

    switch (this.state) {
      case 'ready':
        tip = 'Tahan tombol untuk mulai meniup'
        if (justPressed) { this.state = 'blow'; this.voice.on(); this.emitter.emitting = true }
        break
      case 'blow':
        this.level -= DRAIN * dt
        this.progress += dt
        tip = inZone ? 'LEPAS SEKARANG! Tarik napas!' : (this.level > ZONE[1] ? 'Tiup terus, jaga alirannya...' : 'Terlambat! Lepas!')
        if (this.level <= 0) { this.level = 0; this.fail('Napas habis sebelum sempat ditarik!') }
        else if (justReleased) {
          if (inZone) { this.state = 'inhale'; this.inhaleT = 0; this.voice.inhale(); this.emitter.emitting = false; Audio.note(880, 0.08, 'sine', 0.12) }
          else this.fail(this.level > ZONE[1] ? 'Terlalu cepat! Napasmu belum waktunya ditarik.' : 'Terlambat! Napas sudah terlalu tipis.')
        }
        break
      case 'inhale':
        this.inhaleT += dt
        this.progress += dt
        this.level = Math.min(100, this.level + (100 - ZONE[0]) * (dt / INHALE))
        tip = 'Tarik napas... tahan lagi SEGERA!'
        if (held) { this.state = 'blow'; this.voice.on(); this.emitter.emitting = true }
        else if (this.inhaleT > GRACE) this.fail('Napas terputus! Saluang butuh aliran tanpa jeda.')
        break
      case 'fail':
        this.failT += dt
        tip = this.failMsg
        if (this.failT > 1.5) this.resetRun('ready')
        break
      case 'win':
        this.failT += dt
        tip = 'Napasmu mengalir seperti sungai!'
        if (this.failT > 2.2) this.leave({ score: this.score })
        break
    }

    if ((this.state === 'blow' || this.state === 'inhale') && this.progress >= GOAL) {
      this.state = 'win'
      this.failT = 0
      this.score = Math.max(60, 100 - this.breaks * 10)
      this.voice.off()
      this.emitter.emitting = false
      Audio.win()
    }

    this.draw(tip, inZone)
  }

  draw(tip, inZone) {
    const g = this.gfx
    g.clear()
    // bar progres 10 detik
    const px = 60, pw = 264
    g.fillStyle(0x3a2a4d).fillRect(px - 3, 42, pw + 6, 12)
    g.fillStyle(0xfffaf0).fillRect(px, 45, pw, 6)
    g.fillStyle(0x72c7ae).fillRect(px, 45, pw * Math.min(1, this.progress / GOAL), 6)
    this.progText.setText(`Aliran napas: ${Math.min(GOAL, this.progress).toFixed(1)} / ${GOAL} dtk`)
    this.breakText.setText(this.breaks ? `Putus: ${this.breaks}x` : '')

    // gelombang suara
    const live = this.state === 'blow' ? 1 : this.state === 'inhale' ? 0.35 : 0.04
    g.lineStyle(2, this.state === 'fail' ? 0xc0334f : 0xf594b5)
    g.beginPath()
    for (let x = 100; x <= 340; x += 3) {
      const y = 112 + Math.sin(this.t * 9 + x * 0.09) * 9 * live * (0.4 + this.level / 160)
      x === 100 ? g.moveTo(x, y) : g.lineTo(x, y)
    }
    g.strokePath()

    // bar napas + zona hijau
    const bx = 100, by = 160, bw = 240, bh = 14
    g.fillStyle(0x3a2a4d).fillRect(bx - 3, by - 3, bw + 6, bh + 6)
    g.fillStyle(0xfffaf0).fillRect(bx, by, bw, bh)
    const pulse = inZone && this.state === 'blow' ? 0.6 + 0.4 * Math.sin(this.t * 24) : 1
    g.fillStyle(inZone && this.state === 'blow' ? 0x4ea08a : 0x72c7ae, pulse).fillRect(bx + (bw * ZONE[0]) / 100, by, (bw * (ZONE[1] - ZONE[0])) / 100, bh)
    g.fillStyle(0xf594b5).fillRect(bx, by + 3, (bw * Math.max(0, this.level)) / 100, bh - 6)
    g.fillStyle(0x3a2a4d).fillRect(bx + (bw * Math.max(0, this.level)) / 100 - 1, by - 3, 2, bh + 6)
    this.tip.setText(tip).setPosition(W / 2 + 30, 124)
    this.tip.setColor(this.state === 'fail' ? '#c0334f' : '#c96890')
    // label zona
    if (!this.zoneLabel) this.zoneLabel = txt(this, bx + (bw * (ZONE[0] + ZONE[1])) / 200, by + bh + 4, 'ZONA TARIK NAPAS', { size: 8, color: '#4ea08a', depth: 9 })
    // vibrasi saluang saat ditiup
    this.sal.setAngle(Math.sin(this.t * 30) * (this.state === 'blow' ? 1.2 : 0) - 4)
  }
}
