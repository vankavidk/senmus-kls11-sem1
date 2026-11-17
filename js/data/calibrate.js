// Misi 5: Kalibrasi Apresiasi. target = nilai slider yang membuat lagu selaras (persen). Bisa diubah guru.
export const CALIB = [
  { key: 'nada', label: 'NADA (PITCH)', target: 75, start: 30 },
  { key: 'irama', label: 'IRAMA', target: 60, start: 85 },
  { key: 'melodi', label: 'MELODI', target: 90, start: 45 },
  { key: 'harmoni', label: 'HARMONI', target: 80, start: 15 },
]
export const CALIB_TOL = 4        // toleransi (±%) agar dianggap tepat
export const CALIB_HOLD = 1.2     // detik semua slider harus bertahan tepat
