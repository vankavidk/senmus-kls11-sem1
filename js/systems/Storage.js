import { STORAGE_KEY } from '../config.js'

// Penyimpanan LocalStorage (single-player). Struktur: { profile, progress, records[] }
const blank = () => ({ profile: null, progress: { ip: 0, tasks: {}, missions: {} }, records: [] })

function read() {
  try { return { ...blank(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } } catch { return blank() }
}
function write(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch { /* mode privat / penuh */ }
}

export const Storage = {
  getProfile: () => read().profile,
  saveProfile(profile) {
    const d = read()
    const changed = !d.profile || d.profile.name !== profile.name || d.profile.kelas !== profile.kelas
    d.profile = profile
    if (changed) d.progress = blank().progress
    write(d)
  },
  getProgress: () => read().progress,
  markTask(taskId) { const d = read(); d.progress.tasks[taskId] = true; write(d) },
  // skor tertinggi per misi; mengembalikan true jika ini penyelesaian pertama
  setMission(id, score) {
    const d = read(); const prev = d.progress.missions[id]
    d.progress.missions[id] = { score: Math.max(score, prev?.score ?? 0) }
    write(d); return !prev
  },
  // skor terbaik kuis Layar Materi per ruangan (0-100)
  setQuiz(id, score) { const d = read(); d.progress.quiz = d.progress.quiz || {}; d.progress.quiz[id] = Math.max(score, d.progress.quiz[id] || 0); write(d) },
  addIP(n) { const d = read(); d.progress.ip += n; write(d); return d.progress.ip },
  getRecords: () => read().records,
  // Dipakai Dashboard Guru (tahap berikutnya): satu baris hasil per siswa
  // satu baris per siswa (nama + kelas); diperbarui tiap misi selesai
  upsertRecord(rec) {
    const d = read()
    const i = d.records.findIndex((r) => r.name === rec.name && r.kelas === rec.kelas)
    const row = { ...rec, time: new Date().toISOString() }
    if (i >= 0) d.records[i] = row; else d.records.push(row)
    write(d)
  },
  clearRecords() { const d = read(); d.records = []; write(d) },
  addRecord(rec) { const d = read(); d.records.push({ ...rec, time: new Date().toISOString() }); write(d) },
}
