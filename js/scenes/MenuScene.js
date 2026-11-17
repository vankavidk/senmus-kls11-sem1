import { Audio } from '../systems/Audio.js'
import { GAME_W, GAME_H, CLASS_LIST } from '../config.js'
import { AVATARS } from '../data/avatars.js'
import { Storage } from '../systems/Storage.js'
import { syncRecord } from '../systems/Report.js'
import { openTeacher } from '../ui/Teacher.js'

// Menu utama: latar peta + panel HTML (nama, kelas, avatar).
export class MenuScene extends Phaser.Scene {
  constructor() { super('Menu') }

  create() {
    Audio.music('m_menu')
    this.cameras.main.fadeIn(400, 255, 255, 255)
    this.add.image(GAME_W / 2, GAME_H / 2, 'world').setScale(1.15)
    this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x3a2a4d, 0.25)
    for (let i = 0; i < 30; i++) {
      const s = this.add.image(Phaser.Math.Between(0, GAME_W), Phaser.Math.Between(0, GAME_H), 'spark').setAlpha(0)
      this.tweens.add({ targets: s, alpha: 1, y: s.y - 14, duration: Phaser.Math.Between(1200, 2600), yoyo: true, repeat: -1, delay: Phaser.Math.Between(0, 2000) })
    }

    const $ = (id) => document.getElementById(id)
    const saved = Storage.getProfile()
    this.selected = saved?.avatar ?? AVATARS[0].id

    const sel = $('sel-class')
    sel.innerHTML = CLASS_LIST.map((c) => `<option>${c}</option>`).join('')
    sel.value = saved?.kelas ?? 'XI MIPA 1'
    $('inp-name').value = saved?.name ?? ''
    $('menu-error').textContent = ''

    const grid = $('avatar-grid')
    grid.innerHTML = ''
    for (const a of AVATARS) {
      const b = document.createElement('div')
      b.className = 'av' + (a.id === this.selected ? ' sel' : '')
      b.innerHTML = `<img src="assets/img/avatar_${a.id}.png" alt="${a.label}"><small>${a.label}</small>`
      b.onclick = () => {
        this.selected = a.id
        grid.querySelectorAll('.av').forEach((e) => e.classList.remove('sel'))
        b.classList.add('sel')
      }
      grid.appendChild(b)
    }

    $('menu').classList.remove('hidden')
    // logo akademi diklik 5x (dalam 3 detik) membuka Dashboard Guru tersembunyi
    let taps = 0, timer = null
    document.querySelector('.menu-card h1').onclick = () => {
      taps += 1; clearTimeout(timer); timer = setTimeout(() => { taps = 0 }, 3000)
      if (taps >= 5) { taps = 0; openTeacher() }
    }
    $('btn-start').onclick = () => this.start()
    $('inp-name').onkeydown = (e) => { if (e.key === 'Enter') this.start() }
    // jangan biarkan tombol WASD/E menggerakkan game saat mengetik nama
    this.input.keyboard.disableGlobalCapture()
    this.input.keyboard.enabled = false
  }

  start() {
    const $ = (id) => document.getElementById(id)
    const name = $('inp-name').value.trim().replace(/\s+/g, ' ')
    if (name.length < 2) { $('menu-error').textContent = 'Tulis namamu dulu ya (minimal 2 huruf).'; $('inp-name').focus(); return }
    const profile = { name, kelas: $('sel-class').value, avatar: this.selected }
    Storage.saveProfile(profile)
    syncRecord()
    $('menu').classList.add('hidden')
    this.input.keyboard.enabled = true
    this.cameras.main.fadeOut(400, 255, 255, 255)
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Game', { profile }))
  }
}
