import { GAME_W, GAME_H } from './config.js'
import { BootScene } from './scenes/BootScene.js'
import { SplashScene } from './scenes/SplashScene.js'
import { MenuScene } from './scenes/MenuScene.js'
import { GameScene } from './scenes/GameScene.js'
import { GalleryScene } from './scenes/GalleryScene.js'
import { MiniSaluangScene } from './scenes/MiniSaluangScene.js'
import { MiniGamelanScene } from './scenes/MiniGamelanScene.js'
import { LabScene } from './scenes/LabScene.js'
import { MiniGenreScene } from './scenes/MiniGenreScene.js'
import { MiniMixScene } from './scenes/MiniMixScene.js'
import { MiniShowScene } from './scenes/MiniShowScene.js'
import { KedapScene } from './scenes/KedapScene.js'
import { LorongScene } from './scenes/LorongScene.js'
import { KiborScene } from './scenes/KiborScene.js'
import { MiniPostureScene } from './scenes/MiniPostureScene.js'
import { TamanScene } from './scenes/TamanScene.js'
import { MiniLyricScene } from './scenes/MiniLyricScene.js'
import { MiniGrowScene } from './scenes/MiniGrowScene.js'
import { AulaScene } from './scenes/AulaScene.js'
import { MiniStageScene } from './scenes/MiniStageScene.js'
import { FilmScene } from './scenes/FilmScene.js'
import { initNotebook } from './ui/Notebook.js'
import { initTeacher } from './ui/Teacher.js'
import { MiniCalibrateScene } from './scenes/MiniCalibrateScene.js'
import { Audio } from './systems/Audio.js'
import { Storage } from './systems/Storage.js'

// Titik masuk. Resolusi logis 384x216, diskalakan FIT ke layar (pixel art, tanpa smoothing).
const start = () => {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: GAME_W,
    height: GAME_H,
    backgroundColor: '#c1aae8',
    pixelArt: true,
    roundPixels: true,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
    input: { activePointers: 3 },
    scene: [BootScene, SplashScene, MenuScene, GameScene, GalleryScene, MiniSaluangScene, MiniGamelanScene, LabScene, MiniGenreScene, MiniMixScene, KedapScene, LorongScene, MiniCalibrateScene, KiborScene, MiniPostureScene, TamanScene, MiniLyricScene, MiniGrowScene, AulaScene, MiniStageScene, MiniShowScene, FilmScene],
  })
  initNotebook(); initTeacher()
  window.__melody = { game, Storage }
}

// buka AudioContext pada gestur pertama (aturan autoplay browser)
for (const ev of ['pointerdown', 'keydown', 'touchstart']) window.addEventListener(ev, () => Audio.unlock(), { once: true })

// font piksel harus siap sebelum Phaser merender teks
Promise.all([document.fonts.load('8px Silkscreen'), document.fonts.load('16px "Pixelify Sans"')]).catch(() => {}).finally(start)
