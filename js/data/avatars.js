// 12 avatar siswa: 6 putra, 6 putri. id = akhiran nama file aset (avatar_<id>.png, walk_<id>.png)
export const AVATARS = [
  ...[1, 2, 3, 4, 5, 6].map((n) => ({ id: `putra_${n}`, label: `Putra ${n}`, gender: 'L' })),
  ...[1, 2, 3, 4, 5, 6].map((n) => ({ id: `putri_${n}`, label: `Putri ${n}`, gender: 'P' })),
]
