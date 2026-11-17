// Interior Galeri Etnik Nusantara (peta 320x192, galeri.png)
export const GALERI = {
  w: 320, h: 192,
  spawn: { x: 160, y: 156 },
  colliders: [
    [0, 0, 320, 52], [0, 0, 8, 192], [312, 0, 8, 192], [0, 184, 144, 8], [176, 184, 144, 8],
    [24, 56, 128, 68],          // panggung gamelan
    [220, 56, 32, 48],          // penyangga saluang
    [264, 40, 32, 28],          // beringin
    [16, 172, 16, 10], [288, 172, 16, 10],
  ],
  exit: { x: 160, y: 180 },
  pedestal: { x: 236, y: 112 },
  gamelan: { x: 88, y: 134 },
}
