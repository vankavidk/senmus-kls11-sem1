import { Storage } from '../systems/Storage.js'
import { CHAPTERS } from '../systems/Report.js'

const $ = (id) => document.getElementById(id)
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

// Dashboard Guru tersembunyi: klik logo Melody Academy 5x di menu.
const header = () => ['Nama', 'Kelas', ...CHAPTERS.map((c, i) => `Bab ${i + 1} ${c.name} (%)`), 'Total IP', 'Misi Selesai', 'Status', 'Terakhir Main']
const rowOf = (r) => [r.name, r.kelas, ...CHAPTERS.map((_, i) => r.chapters?.[i] ?? 0), r.ip, `${r.done}/11`, r.status, r.time ? new Date(r.time).toLocaleString('id-ID') : '']

export function toTsv(records) { return [header(), ...records.map(rowOf)].map((r) => r.join('\t')).join('\n') }

export function toCsv(records) {
  const q = (v) => `"${String(v).replace(/"/g, '""')}"`
  return '﻿' + [header(), ...records.map(rowOf)].map((r) => r.map(q).join(',')).join('\r\n')
}

function render() {
  const recs = Storage.getRecords()
  $('tc-table').innerHTML = recs.length
    ? `<tr>${['Nama', 'Kelas', ...CHAPTERS.map((_, i) => `B${i + 1}`), 'IP', 'Misi', 'Status'].map((h) => `<th>${h}</th>`).join('')}</tr>` +
      recs.map((r) => `<tr><td>${esc(r.name)}</td><td>${esc(r.kelas)}</td>${CHAPTERS.map((_, i) => `<td>${r.chapters?.[i] ?? 0}%</td>`).join('')}<td>${r.ip}</td><td>${r.done}/11</td><td>${esc(r.status)}</td></tr>`).join('')
    : '<tr><td>Belum ada data siswa di perangkat ini.</td></tr>'
  $('tc-count').textContent = `${recs.length} siswa`
}

export function openTeacher() { render(); $('teacher').classList.remove('hidden') }

export function initTeacher() {
  let armed = false
  $('tc-close').onclick = () => { $('teacher').classList.add('hidden'); $('tc-copybox').classList.add('hidden') }
  $('tc-csv').onclick = () => {
    const recs = Storage.getRecords()
    try {
      const blob = new Blob([toCsv(recs)], { type: 'text/csv;charset=utf-8' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `hasil-melody-academy-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a); a.click(); a.remove()
      setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    } catch { /* lanjut ke salin manual */ }
    $('tc-text').value = toTsv(recs)
    $('tc-copybox').classList.remove('hidden')
  }
  $('tc-copy').onclick = () => {
    const t = $('tc-text'); t.select()
    navigator.clipboard?.writeText(t.value).then(() => { $('tc-copy').textContent = 'Tersalin' }).catch(() => {})
  }
  // konfirmasi dua langkah (confirm() tidak tersedia di semua tampilan)
  $('tc-clear').onclick = () => {
    if (!armed) { armed = true; $('tc-clear').textContent = 'Ketuk lagi untuk menghapus'; setTimeout(() => { armed = false; $('tc-clear').textContent = 'Hapus data' }, 3000); return }
    armed = false; $('tc-clear').textContent = 'Hapus data'; Storage.clearRecords(); render()
  }
}
