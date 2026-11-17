import { ERAS } from './era.js'

// Panah navigasi: untuk tiap tugas misi, di mana targetnya.
// home = ruangan tempat tugas dikerjakan; at[ruangan] = target di ruangan itu (npc: id NPC, spot: sebagian label, word: kata bercahaya terdekat).
export const DOOR_OF = { Gallery: 'galeri', Lab: 'lab', Lorong: 'lorong', Kedap: 'kedap', Kibor: 'kibor', Taman: 'taman', Aula: 'aula' }

const at = (home, spot) => ({ home, at: { [home]: spot } })
export const NAV = {
  ...Object.fromEntries(Object.entries({ galeri: 'Gallery', lab: 'Lab', lorong: 'Lorong', kedap: 'Kedap', kibor: 'Kibor', taman: 'Taman', aula: 'Aula' }).flatMap(([r, h]) => [[`film_${r}`, at(h, { spot: 'Layar Materi' })], [`kuis_${r}`, at(h, { spot: 'Layar Materi' })]])),
  meet_minang: { home: 'Gallery', at: { Game: { npc: 'minang' }, Gallery: { npc: 'minang2' } } },
  touch_saluang: at('Gallery', { spot: 'Saluang' }),
  hold_breath: at('Gallery', { spot: 'Saluang' }),
  talk_gamelan: at('Gallery', { npc: 'minang2' }),
  order_gamelan: at('Gallery', { spot: 'Panggung Gamelan' }),
  talk_detektif: { home: 'Lab', at: { Game: { npc: 'detektif' }, Lab: { npc: 'detektif2' } } },
  sort_genre: at('Lab', { spot: 'Karpet Genre' }),
  talk_ramuan: at('Lab', { npc: 'detektif2' }),
  mix_ramuan: at('Lab', { spot: 'Mixing Desk' }),
  ...Object.fromEntries(ERAS.map((e, i) => [`era_${i}`, at('Lorong', { spot: e.name })])),
  talk_penyimak: at('Kedap', { npc: 'penyimak' }),
  calibrate: at('Kedap', { spot: 'Meja Osiloskop' }),
  talk_virtuoso: at('Kibor', { npc: 'virtuoso2' }),
  posture: at('Kibor', { spot: 'Piano Besar' }),
  keys: at('Kibor', { spot: 'Metronom' }),
  talk_pujangga: at('Taman', { npc: 'pujangga2' }),
  collect_words: at('Taman', { word: true }),
  lyrics: at('Taman', { npc: 'pujangga2' }),
  grow: at('Taman', { spot: 'Pot Kaca Melodi' }),
  talk_manager: at('Aula', { npc: 'manager2' }),
  stage: at('Aula', { spot: 'Panel Panggung' }),
  talk_show: at('Aula', { npc: 'manager2' }),
  show: at('Aula', { spot: 'Meja Perancang' }),
}
