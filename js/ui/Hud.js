import { MISSIONS } from '../data/world.js'
import { Audio } from '../systems/Audio.js'
import { Storage } from '../systems/Storage.js'
import { showNotebook, isNotebookOpen } from './Notebook.js'

// HUD berbasis DOM (teks tajam di semua layar). Diakses dari GameScene.
const $ = (id) => document.getElementById(id)

export class Hud {
  constructor() {
    this.dialogLines = []
    this.dialogIndex = 0
    this.typer = null
    this.typing = false
    this.onDialogEnd = null
    this.toastTimer = null
    $('dialog').onclick = () => this.advanceDialog()
    $('btn-book').onclick = () => this.toggleBook()
    // HUD yang bisa diminimalkan (ingat pilihan; di layar sentuh kecil default terlipat)
    let st = null
    try { st = JSON.parse(localStorage.getItem('melody.hud') || 'null') } catch { /* abaikan */ }
    const small = (window.matchMedia && matchMedia('(pointer: coarse)').matches) || window.innerWidth < 760
    st = st || { quest: small, btns: small }
    const applyHud = () => {
      $('hud-quest').classList.toggle('min', st.quest); $('quest-caret').innerHTML = st.quest ? '&#9656;' : '&#9662;'
      $('hud-buttons').classList.toggle('min', st.btns); $('btn-hudmenu').innerHTML = st.btns ? '&#9776;' : '&#10005;'
      try { localStorage.setItem('melody.hud', JSON.stringify(st)) } catch { /* abaikan */ }
    }
    $('quest-head').onclick = () => { st.quest = !st.quest; applyHud() }
    $('btn-hudmenu').onclick = () => { st.btns = !st.btns; applyHud() }
    applyHud()
    $('book').onclick = (e) => { if (e.target.id === 'book') this.toggleBook(false) }
    $('btn-notebook').onclick = () => showNotebook()
    const syncMute = () => { const st = Audio.settings(); $('btn-mute-m').classList.toggle('off', !st.music); $('btn-mute-s').classList.toggle('off', !st.sfx) }
    $('btn-mute-m').onclick = () => { Audio.setSetting('music', !Audio.settings().music); syncMute() }
    $('btn-mute-s').onclick = () => { Audio.setSetting('sfx', !Audio.settings().sfx); syncMute(); Audio.sfx('ui_click') }
    syncMute()
    $('btn-full').onclick = () => {
      const el = document.documentElement
      if (document.fullscreenElement) document.exitFullscreen?.()
      else el.requestFullscreen?.().catch(() => {})
    }
  }

  show() { $('hud').classList.remove('hidden') }
  hide() { $('hud').classList.add('hidden'); this.closeDialog(); $('book').classList.add('hidden') }

  setProfile(p) {
    $('hud-avatar').src = `assets/img/avatar_${p.avatar}.png`
    $('hud-name').textContent = p.name
    $('hud-class').textContent = p.kelas
  }
  setIP(n) {
    const el = $('hud-ip')
    if (this.lastIp !== undefined && n > this.lastIp) Audio.sfx('ip_gain')
    this.lastIp = n
    el.textContent = n
  }

  setQuest(q) {
    $('quest-title').textContent = q.title
    const ul = $('quest-list')
    ul.innerHTML = ''
    for (const t of q.tasks) {
      const li = document.createElement('li')
      li.textContent = t.text
      if (t.done) li.classList.add('done')
      ul.appendChild(li)
    }
  }

  toast(text, ms = 2600) {
    const el = $('toast')
    el.textContent = text
    el.classList.add('show')
    clearTimeout(this.toastTimer)
    this.toastTimer = setTimeout(() => el.classList.remove('show'), ms)
  }

  // ---- dialog bertahap dengan efek mengetik ----
  isDialogOpen() { return !$('dialog').classList.contains('hidden') }
  openDialog(name, lines, onEnd) {
    this.dialogLines = lines
    this.dialogIndex = 0
    this.onDialogEnd = onEnd
    $('dialog-name').textContent = name
    $('dialog').classList.remove('hidden')
    Audio.sfx('dlg_open')
    this.type(lines[0])
  }
  type(text) {
    const el = $('dialog-text')
    clearInterval(this.typer)
    el.textContent = ''
    this.typing = true
    let i = 0
    this.typer = setInterval(() => {
      i += 1
      el.textContent = text.slice(0, i)
      if (i % 3 === 0 && text[i - 1] !== ' ') Audio.blip()
      if (i >= text.length) { clearInterval(this.typer); this.typing = false }
    }, 22)
  }
  advanceDialog() {
    if (!this.isDialogOpen()) return
    if (this.typing) {
      clearInterval(this.typer)
      this.typing = false
      $('dialog-text').textContent = this.dialogLines[this.dialogIndex]
      return
    }
    this.dialogIndex += 1
    Audio.sfx('dlg_next')
    if (this.dialogIndex >= this.dialogLines.length) { this.closeDialog(true); return }
    this.type(this.dialogLines[this.dialogIndex])
  }
  closeDialog(finished = false) {
    clearInterval(this.typer)
    this.typing = false
    $('dialog').classList.add('hidden')
    const cb = this.onDialogEnd
    this.onDialogEnd = null
    if (finished && cb) cb()
  }

  // ---- Buku Rapor ----
  isBookOpen() { return !$('book').classList.contains('hidden') || isNotebookOpen() }
  toggleBook(force) {
    if (isNotebookOpen()) return
    const el = $('book')
    const open = force ?? el.classList.contains('hidden')
    if (open) {
      const prog = Storage.getProgress()
      $('book-list').innerHTML = MISSIONS.map((m) => {
        const ok = prog.missions[m.id]
        return `<div class="book-row"><span>${m.id}. ${m.title} <small>(${m.place})</small></span><span class="st ${ok ? 'ok' : ''}">${ok ? 'Selesai' : 'Belum'}</span></div>`
      }).join('') + `<div class="book-row"><b>Total Insight Points</b><b class="st">${prog.ip} IP</b></div>`
    }
    el.classList.toggle('hidden', !open)
  }
}
