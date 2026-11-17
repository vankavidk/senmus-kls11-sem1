// Misi 3: kartu instrumen. genre = karpet yang benar. sound = nama untuk Audio.play().
export const GENRE_ITEMS = [
  { key: 'gitar_akustik', name: 'Gitar Akustik', genre: 'pop', sound: 'strum', scale: 2, ket: 'Petikan bersih dan hangat, tempo menengah. Terasa rileks: itu Pop.' },
  { key: 'ukulele', name: 'Ukulele', genre: 'pop', sound: 'uke', scale: 2.2, ket: 'Ringan dan ceria, dinamika lembut. Suasana santai khas Pop.' },
  { key: 'tamborin', name: 'Tamborin', genre: 'pop', sound: 'tamb', scale: 2.4, ket: 'Gemerincing halus mengiringi ketukan menengah. Rileks, Pop.' },
  { key: 'gitar_elektrik', name: 'Gitar Elektrik', genre: 'rock', sound: 'power', scale: 2, ket: 'Distorsi tebal, akor menghentak, agresif. Itu Rock.' },
  { key: 'bass_elektrik', name: 'Bass Elektrik', genre: 'rock', sound: 'bass', scale: 1.8, ket: 'Dentuman rendah yang mendorong tenaga. Fondasi Rock.' },
  { key: 'drum_kit', name: 'Drum Kit', genre: 'rock', sound: 'drums', scale: 1.4, ket: 'Pukulan keras dan padat, tempo menghentak. Rock.' },
]
export const GENRES = {
  pop: { label: 'POP', sub: 'menengah · rileks' },
  rock: { label: 'ROCK', sub: 'menghentak · agresif' },
}
