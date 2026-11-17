import { Storage } from './Storage.js'

// 7 bab (modul) dan misi yang membentuk nilainya. Persen bab = rata-rata skor misi di bab itu (0 bila belum selesai).
export const CHAPTERS = [
  { name: 'Musik Nusantara', m: [1, 2] },
  { name: 'Genre Musik', m: [3, 4] },
  { name: 'Musik Etnik Modern', m: [4] },
  { name: 'Apresiasi Musik', m: [5] },
  { name: 'Teknik Kibor', m: [6, 7] },
  { name: 'Kreasi Melodi', m: [8, 9] },
  { name: 'Manajemen Pagelaran', m: [10, 11] },
]
export const TOP_STATUS = 'Maestro Harmoni Muda'

export function buildReport(profile, progress) {
  const chapters = CHAPTERS.map((c) => ({ name: c.name, pct: Math.round(c.m.reduce((a, id) => a + (progress.missions[id]?.score ?? 0), 0) / c.m.length) }))
  const done = Object.keys(progress.missions).length
  const status = done >= 11 ? TOP_STATUS : done >= 8 ? 'Penata Nada' : done >= 4 ? 'Penjelajah Melodi' : 'Murid Melodi'
  return { name: profile.name, kelas: profile.kelas, avatar: profile.avatar, chapters, ip: progress.ip, done, status }
}

// simpan/perbarui satu baris hasil siswa (nama + kelas) untuk Dashboard Guru
export function syncRecord() {
  const profile = Storage.getProfile()
  if (!profile) return
  const r = buildReport(profile, Storage.getProgress())
  Storage.upsertRecord({ name: r.name, kelas: r.kelas, chapters: r.chapters.map((c) => c.pct), ip: r.ip, done: r.done, status: r.status })
}
