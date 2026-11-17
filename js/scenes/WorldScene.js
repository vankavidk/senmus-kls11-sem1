import { GAME_W, GAME_H } from '../config.js'
import { Player } from '../objects/Player.js'
import { NAV, DOOR_OF } from '../data/nav.js'
import { Npc } from '../objects/Npc.js'
import { VirtualJoystick } from '../ui/VirtualJoystick.js'
import { InteractButton } from '../ui/InteractButton.js'
import { Hud } from '../ui/Hud.js'
import { Storage } from '../systems/Storage.js'
import { Audio } from '../systems/Audio.js'
import { syncRecord } from '../systems/Report.js'
import { currentQuest, questById, questOfTask, isComplete } from '../data/quests.js'

// zoom hanya bilangan bulat agar tiap piksel seni tampil seragam (tanpa getar/berbayang)
const ZOOM_LEVELS = [1, 2, 3, 4], ZOOM_DEFAULT = 2

// Kelas dasar semua ruang yang bisa dijelajahi (alun-alun, interior). Turunan mengisi layout().
// layout() => { mapKey, w, h, bg, colliders, spawn, npcs, spots, particles }
const MUSIC_OF = { Game: 'm_world', Gallery: 'm_galeri', Lab: 'm_lab', Lorong: 'm_lorong', Kedap: 'm_kedap', Kibor: 'm_kibor', Taman: 'm_taman', Aula: 'm_aula' }

export class WorldScene extends Phaser.Scene {
  init(data) {
    this.profile = data.profile || Storage.getProfile()
    this.enterData = data
  }

  layout() { throw new Error('layout() belum diimplementasi') }

  create() {
    // instance scene dipakai ulang oleh Phaser: reset penanda dari kunjungan sebelumnya
    this.transitioning = false
    this.mini = false
    this.nearest = null
    const L = this.layout()
    this.L = L
    this.musicKey = MUSIC_OF[this.scene.key] || 'm_world'
    Audio.music(this.musicKey)
    this.stepT = 0
    this.navG = this.add.graphics().setDepth(99997)
    this.navCache = { t: -1e9, target: null }
    this.cameras.main.fadeIn(450, 255, 255, 255)
    this.add.image(0, 0, L.mapKey).setOrigin(0).setDepth(-1)
    this.physics.world.setBounds(0, 0, L.w, L.h)

    this.walls = this.physics.add.staticGroup()
    for (const [x, y, w, h] of L.colliders) {
      const r = this.add.rectangle(x + w / 2, y + h / 2, w, h).setVisible(false)
      this.physics.add.existing(r, true)
      this.walls.add(r)
    }

    const sp = this.enterData.spawn || L.spawn
    this.player = new Player(this, sp.x, sp.y, this.profile.avatar, this.profile.name)
    this.physics.add.collider(this.player, this.walls)

    this.npcs = (L.npcs || []).map((d) => new Npc(this, d))
    this.physics.add.collider(this.player, this.npcs)

    // titik interaksi: NPC + spot khusus ruang
    this.spots = [
      ...this.npcs.map((n) => ({ x: n.x, y: n.y, range: 26, label: n.def.name, run: () => this.talk(n) })),
      ...(L.spots || []),
    ]

    if (L.particles) {
      this.add.particles(0, 0, 'spark', {
        x: { min: 0, max: L.w }, y: { min: 10, max: L.h - 10 }, lifespan: 4200, speedY: { min: -6, max: -2 }, speedX: { min: -4, max: 4 },
        alpha: { start: 0, end: 0, ease: (t) => Math.sin(t * Math.PI) }, frequency: 220, quantity: 1, scale: { min: 1, max: 1.6 },
      }).setDepth(90000)
    }

    // kamera: lerp mengikuti pemain, dengan zoom (roda mouse, cubit, tombol +/-)
    const cam = this.cameras.main
    cam.setBackgroundColor(L.bg || '#9bdb9b')
    cam.startFollow(this.player, true, 1, 1)
    cam.setRoundPixels(true)
    this.uiObjs = []
    this.zoomLevel = Math.max(1, Math.min(4, Math.round(this.game.registry.get('zoom') ?? ZOOM_DEFAULT)))
    this.events.on('addedtoscene', (o) => { if (o.type === 'Text' && o.resolution !== this.zoomLevel) o.setResolution(this.zoomLevel) })
    this.applyZoom()

    const kb = this.input.keyboard
    this.keys = kb.addKeys({ up: 'UP', down: 'DOWN', left: 'LEFT', right: 'RIGHT', w: 'W', a: 'A', s: 'S', d: 'D' })
    kb.addCapture('UP,DOWN,LEFT,RIGHT,TAB,SPACE')
    this.joystick = new VirtualJoystick(this)
    this.isTouch = this.sys.game.device.input.touch
    this.interactBtn = new InteractButton(this, () => this.interact())
    if (!this.isTouch) {
      this.joystick.base.setVisible(false); this.joystick.knob.setVisible(false); this.interactBtn.img.setVisible(false)
    }
    this.prompt = this.add.text(0, 0, '', { fontFamily: 'Silkscreen', fontSize: '8px', color: '#fffaf0', stroke: '#3a2a4d', strokeThickness: 3 })
      .setOrigin(0.5, 1).setDepth(100002).setVisible(false)

    this.setupZoomInput()
    this.hud = new Hud()
    this.hud.setProfile(this.profile)
    this.hud.setIP(Storage.getProgress().ip)
    this.refreshQuest()
    this.refreshMarks()
    this.hud.show()
    this.mini = false
    this.nearest = null
    if (L.film) {
      this.buildFilmScreen(L.film)
      if (!this.tasks()[`film_${L.film}`]) this.time.delayedCall(1000, () => { if (!this.hud.isDialogOpen()) this.hud.toast('Ada Layar Materi di dekat pintu.\nTonton filmnya: +30 IP', 3400) })
    }
    this.afterCreate?.()

    kb.on('keydown-E', () => this.interact())
    kb.on('keydown-ENTER', () => { if (this.hud.isDialogOpen()) this.hud.advanceDialog() })
    kb.on('keydown-SPACE', () => { if (this.hud.isDialogOpen()) this.hud.advanceDialog() })
    kb.on('keydown-TAB', () => this.hud.toggleBook())
    this.events.once('shutdown', () => { this.hud.hide(); kb.removeAllListeners() })
  }

  // ---------- panah navigasi ke tujuan misi ----------
  // Target = tugas pertama yang belum selesai pada misi aktif (sama dengan panel misi di kanan atas).
  navTarget() {
    const t = this.tasks()
    const q = currentQuest(t)
    const task = q.tasks.find((x) => !x.done)
    const step = task && NAV[task.id]
    if (!step) return null
    const here = this.scene.key
    const spec = step.at[here]
    const find = (p) => {
      if (!p) return null
      if (p.npc) { const n = this.npcs.find((o) => o.def.id === p.npc); return n && { x: n.x, y: n.y - 6 } }
      if (p.spot) { const s = this.spots.find((o) => o.label && o.label.includes(p.spot)); return s && { x: s.x, y: s.y } }
      if (p.word) { const w = (this.words || [])[0]; if (!w) return null; let b = w, bd = Infinity; for (const c of this.words) { const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, c.x, c.y); if (d < bd) { bd = d; b = c } } return { x: b.x, y: b.y } }
      return null
    }
    const hit = find(spec)
    if (hit) return { ...hit, final: true }
    if (here !== 'Game') { const e = this.spots.find((o) => o.label && o.label.startsWith('Keluar')); return e && { x: e.x, y: e.y, final: false } }
    const doorId = DOOR_OF[step.home]
    const d = this.spots.find((o) => o.id === doorId)
    return d && { x: d.x, y: d.y, final: false }
  }

  drawNav(time) {
    const g = this.navG
    g.clear()
    if (this.mini || this.transitioning || this.hud.isDialogOpen()) return
    if (time - this.navCache.t > 250) this.navCache = { t: time, target: this.navTarget() }
    const tg = this.navCache.target
    if (!tg) return
    const px = this.player.x, py = this.player.y - 10
    const dx = tg.x - px, dy = tg.y - py, dist = Math.hypot(dx, dy)
    const bob = Math.sin(time / 200)
    if (dist > 34) {
      const ux = dx / dist, uy = dy / dist, r = 24 + bob * 2
      const cx = px + ux * r, cy = py + uy * r, nx = -uy, ny = ux
      const pts = [[cx + ux * 7, cy + uy * 7], [cx - ux * 3 + nx * 6, cy - uy * 3 + ny * 6], [cx - ux * 1, cy - uy * 1], [cx - ux * 3 - nx * 6, cy - uy * 3 - ny * 6]]
      const tri = (o, col, a) => { g.fillStyle(col, a).fillPoints(pts.map(([x, y]) => ({ x: x + o, y: y + o })), true) }
      tri(1, 0x3a2a4d, 0.55); tri(0, 0xf594b5, 1)
      g.lineStyle(1, 0xfffaf0, 1).strokePoints([...pts.map(([x, y]) => ({ x, y })), { x: pts[0][0], y: pts[0][1] }], false)
    }
    // penanda di atas tujuan
    const my = tg.y - 36 + bob * 2
    g.fillStyle(0x3a2a4d, 0.55).fillTriangle(tg.x - 5, my + 1, tg.x + 5, my + 1, tg.x, my + 9)
    g.fillStyle(tg.final ? 0xffd467 : 0xf594b5, 1).fillTriangle(tg.x - 5, my, tg.x + 5, my, tg.x, my + 8)
  }

  // ---------- zoom & kamera ----------
  applyZoom() {
    const cam = this.cameras.main, L = this.L, z = this.zoomLevel
    cam.setZoom(z)
    for (const o of this.children.list) if (o.type === 'Text' && o.resolution !== z) o.setResolution(z)
    const padX = Math.max(0, (GAME_W / z - L.w) / 2), padY = Math.max(0, (GAME_H / z - L.h) / 2)
    cam.setBounds(-padX, -padY, L.w + padX * 2, L.h + padY * 2)
    this.game.registry.set('zoom', z)
    this.uiLayout()
  }

  // satu langkah zoom (f > 1 = mendekat). Dibatasi waktu supaya roda/trackpad tidak meloncat banyak level.
  zoomBy(f) {
    const now = this.time.now
    if (now - (this.zoomT || 0) < 220) return
    const i = ZOOM_LEVELS.indexOf(this.zoomLevel)
    const j = Phaser.Math.Clamp(i + (f > 1 ? 1 : -1), 0, ZOOM_LEVELS.length - 1)
    if (j === i) return
    this.zoomT = now
    this.zoomLevel = ZOOM_LEVELS[j]
    Audio.sfx('zoom')
    this.applyZoom()
  }

  setupZoomInput() {
    this.input.on('wheel', (p, o, dx, dy) => { if (!this.locked()) this.zoomBy(dy < 0 ? 2 : 0.5) })
    this.input.keyboard.on('keydown', (e) => {
      if (this.locked()) return
      if (e.key === '+' || e.key === '=') this.zoomBy(2)
      else if (e.key === '-' || e.key === '_') this.zoomBy(0.5)
    })
    this.pinchD = 0
    this.input.on('pointermove', () => {
      const a = this.input.pointer1, b = this.input.pointer2
      if (a.isDown && b.isDown && !this.joystick.pointer && !this.locked()) {
        const d = Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y)
        if (!this.pinchD) this.pinchD = d
        const r = d / this.pinchD
        if (r > 1.35 || r < 0.74) { this.zoomBy(r); this.pinchD = d }
      } else this.pinchD = 0
    })
    const bind = (id, f) => { const el = document.getElementById(id); if (el) el.onclick = () => { if (!this.locked()) this.zoomBy(f) } }
    bind('btn-zin', 2); bind('btn-zout', 0.5)
  }

  // objek antarmuka (scrollFactor 0) harus melawan zoom kamera agar tetap di posisi layar yang sama
  uiPlace(o, sx, sy, s = 1) {
    const z = this.cameras.main.zoom
    o.setPosition(GAME_W / 2 + (sx - GAME_W / 2) / z, GAME_H / 2 + (sy - GAME_H / 2) / z).setScale(s / z)
  }

  uiAdd(o, sx, sy, s = 1) {
    o.setScrollFactor(0); o.ui = { sx, sy, s }
    this.uiObjs.push(o); this.uiPlace(o, sx, sy, s)
    return o
  }

  uiLayout() {
    for (const o of this.uiObjs) if (o.active) this.uiPlace(o, o.ui.sx, o.ui.sy, o.ui.s)
    this.joystick?.render?.()
    this.interactBtn?.render?.()
  }

  // ---------- layar materi (film) di tiap rumah ----------
  buildFilmScreen(id) {
    const fx = 108, fy = 180
    const g = this.add.graphics().setDepth(fy)
    g.fillStyle(0x3a2a4d).fillRect(fx - 12, fy - 24, 24, 17)
    g.fillStyle(0xffd467).fillRect(fx - 11, fy - 23, 22, 15)
    g.fillStyle(0x9fd3f5).fillRect(fx - 9, fy - 21, 18, 11)
    g.fillStyle(0x3a2a4d).fillTriangle(fx - 3, fy - 19, fx - 3, fy - 12, fx + 4, fy - 15.5)
    g.fillStyle(0x3a2a4d).fillRect(fx - 1, fy - 7, 2, 7).fillRect(fx - 7, fy - 1, 14, 2)
    const glow = this.add.circle(fx, fy - 15, 14, 0xfff7b8, 0.25).setDepth(fy - 1)
    this.tweens.add({ targets: glow, alpha: 0.05, scale: 1.4, yoyo: true, repeat: -1, duration: 900 })
    const wall = this.add.rectangle(fx, fy - 1, 22, 5).setVisible(false)
    this.physics.add.existing(wall, true); this.walls.add(wall); this.physics.add.collider(this.player, wall)
    this.spots.push({ x: fx, y: fy - 6, range: 22, label: 'Tonton Materi', labelDy: 36, run: () => this.playFilm(id) })
  }

  playFilm(id) {
    const t = this.tasks()
    this.launchMini('Film', { film: id }, (r) => { if (r) this.completeTask(`film_${id}`, 30) })
  }

  locked() { return this.mini || this.transitioning || this.hud.isDialogOpen() || this.hud.isBookOpen() }

  // ---------- quest & progres ----------
  tasks() { return Storage.getProgress().tasks }
  refreshQuest() { this.hud.setQuest(currentQuest(this.tasks())) }
  refreshMarks() {
    const t = this.tasks()
    for (const n of this.npcs) n.mark?.setVisible(n.def.mark ? !!n.def.mark(t) : !!n.def.quest)
  }

  completeTask(id, bonus = 25) {
    const before = this.tasks()
    if (before[id]) return
    Storage.markTask(id)
    if (bonus) this.hud.setIP(Storage.addIP(bonus))
    const q = questOfTask(id)
    const done = this.tasks()
    this.refreshMarks()
    if (q && isComplete(q, done)) {
      this.hud.setQuest(questById(q.id, done))
      Audio.sfx('quest_done')
      this.hud.toast(`Misi "${q.title}" tuntas!`, 3000)
      this.time.delayedCall(2600, () => this.refreshQuest())
    } else {
      this.hud.setQuest(currentQuest(done))
      Audio.sfx('task_done')
      if (bonus) this.hud.toast(`Tugas selesai! +${bonus} IP`)
    }
  }

  // hasil mini-game: r = { score } atau null bila keluar. ip = IP maksimum misi.
  finishMission(missionId, taskId, ip, r) {
    if (!r) return
    const first = Storage.setMission(missionId, r.score)
    if (first) {
      const gained = Math.round((ip * r.score) / 100)
      this.hud.setIP(Storage.addIP(gained))
      this.hud.toast(`Misi ${missionId} selesai!\nSkor ${r.score} · +${gained} IP`, 4200)
    } else this.hud.toast(`Latihan selesai · skor ${r.score}`, 2600)
    this.completeTask(taskId, 0)
    syncRecord()
  }

  launchMini(key, data, onResult) {
    this.mini = true
    this.player.move(0, 0)
    if (key === 'Film') Audio.music('m_film'); else Audio.duck(true)
    this.hud.hide()
    document.getElementById('toast').classList.remove('show')
    this.events.once('mini-result', (r) => {
      this.mini = false
      Audio.duck(false); Audio.music(this.musicKey)
      this.hud.show()
      onResult(r)
    })
    this.scene.pause()
    this.scene.launch(key, { ...data, parent: this.scene.key })
  }

  goTo(sceneKey, data) {
    if (this.transitioning) return
    this.transitioning = true
    this.player.move(0, 0)
    Audio.sfx('door')
    this.cameras.main.fadeOut(350, 255, 255, 255)
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start(sceneKey, { profile: this.profile, ...data }))
  }

  // ---------- interaksi ----------
  talk(npc) {
    const d = npc.def, t = this.tasks()
    const lines = typeof d.lines === 'function' ? d.lines(t) : d.lines
    this.hud.openDialog(d.name, lines, () => { d.onTalked?.(this, t); this.refreshMarks() })
  }

  interact() {
    Audio.unlock()
    if (this.hud.isDialogOpen()) { this.hud.advanceDialog(); return }
    if (this.locked() || !this.nearest) return
    this.player.move(0, 0)
    Audio.sfx('interact')
    this.nearest.run()
  }

  update() {
    if (this.mini || this.transitioning) return
    const k = this.keys
    let dx = 0, dy = 0
    if (!this.locked()) {
      dx = (k.right.isDown || k.d.isDown ? 1 : 0) - (k.left.isDown || k.a.isDown ? 1 : 0)
      dy = (k.down.isDown || k.s.isDown ? 1 : 0) - (k.up.isDown || k.w.isDown ? 1 : 0)
      if (this.joystick.vector.lengthSq() > 0) { dx = this.joystick.vector.x; dy = this.joystick.vector.y }
    }
    const moving = this.player.move(dx, dy)
    if (moving) { this.stepT -= this.game.loop.delta; if (this.stepT <= 0) { Audio.step(); this.stepT = 290 } } else this.stepT = 0

    let best = null, bd = Infinity
    for (const s of this.spots) {
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, s.x, s.y)
      if (d < s.range && d < bd) { bd = d; best = s }
    }
    this.nearest = best
    this.drawNav(this.time.now)
    const zs = 1 / this.cameras.main.zoom
    this.prompt.setScale(zs); this.player.label.setScale(zs)
    const ready = !!best && !this.locked()
    this.interactBtn.setReady(ready)
    if (ready) this.prompt.setText(this.isTouch ? best.label : `[E] ${best.label}`).setPosition(best.x, best.y - (best.labelDy ?? 30)).setVisible(true)
    else this.prompt.setVisible(false)
  }
}
