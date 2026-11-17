import { Audio } from '../systems/Audio.js'
import { Storage } from '../systems/Storage.js'
import { buildReport, TOP_STATUS } from '../systems/Report.js'

const $ = (id) => document.getElementById(id)

// Buku Catatan Seni: rapor akhir (nama, kelas, persen per bab, total IP, status).
export function isNotebookOpen() { return !$('notebook').classList.contains('hidden') }

export function showNotebook(celebrate = false) {
  const prof = Storage.getProfile()
  if (!prof) return
  const r = buildReport(prof, Storage.getProgress())
  $('nb-avatar').src = `assets/img/avatar_${r.avatar}.png`
  $('nb-name').textContent = r.name
  $('nb-class').textContent = r.kelas
  $('nb-bars').innerHTML = r.chapters.map((c, i) => `<div class="nb-row"><span>Bab ${i + 1}. ${c.name}</span><div class="nb-bar"><i style="width:${c.pct}%"></i></div><b>${c.pct}%</b></div>`).join('')
  $('nb-ip').textContent = `${r.ip} IP`
  $('nb-done').textContent = `${r.done}/11 misi`
  const st = $('nb-status')
  st.textContent = r.status
  st.classList.toggle('top', r.status === TOP_STATUS)
  $('nb-title').textContent = celebrate && r.done >= 11 ? 'Selamat! Pagelaranmu sukses' : 'Buku Catatan Seni'
  $('notebook').classList.remove('hidden')
  if (celebrate && r.done >= 11) Audio.sfx('fanfare')
}

export function hideNotebook() { $('notebook').classList.add('hidden') }

export function initNotebook() {
  $('nb-close').onclick = hideNotebook
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isNotebookOpen()) hideNotebook() })
}
