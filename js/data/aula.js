// Aula Pagelaran Agung (peta 320x192, aula.png)
export const AULA = {
  w: 320, h: 192, spawn: { x: 160, y: 160 },
  colliders: [[0, 0, 320, 48], [0, 0, 8, 192], [312, 0, 8, 192], [0, 184, 144, 8], [176, 184, 144, 8], [16, 118, 112, 48], [192, 118, 112, 48], [14, 80, 16, 10], [290, 80, 16, 10], [108, 84, 10, 6], [196, 82, 18, 6], [232, 84, 18, 6], [61, 80, 8, 4], [251, 80, 8, 4]],
  exit: { x: 160, y: 180 }, panel: { x: 160, y: 92 }, desk: { x: 160, y: 134 },
}

// Misi 10 (final): akustik -> mikrofon, elektrik/digital -> kabel ke amplifier.
export const STAGE_ITEMS = [
  { key: 'gitar_akustik', name: 'Gitar akustik', ac: true },
  { key: 'synth', name: 'Synthesizer', ac: false },
  { key: 'saluang', name: 'Saluang', ac: true },
  { key: 'gitar_elektrik', name: 'Gitar elektrik', ac: false },
  { key: 'sampe', name: 'Sampe', ac: true },
  { key: 'drum_machine', name: 'Drum machine', ac: false },
]

export const MANAGER_INDOOR = {
  id: 'manager2', key: 'npc_house_manager', name: 'House Manager', x: 132, y: 100, quest: true,
  mark: (t) => !t.talk_manager || !t.stage || !t.talk_show || !t.show,
  lines: (t) => {
    if (!t.talk_manager) return [
      'Akhirnya ada yang datang! Satu jam lagi tirai terbuka dan panggung ini masih berantakan.',
      'Aku butuh telinga yang sudah terlatih. Kau sudah menjelajahi Nusantara, mengenali genre, menyimak, bahkan menumbuhkan melodi sendiri. Kini semuanya diuji.',
      'Aturannya sederhana: bunyi akustik ditangkap mikrofon, sedangkan alat listrik dan digital disambung kabel ke amplifier. Satu salah colok, penonton langsung tahu.',
      'Hampiri panel panggung di tengah. Pastikan misi 1 sampai 9 sudah tuntas, ya.',
    ]
    if (!t.stage) return ['Panel panggung ada di tengah. Akustik ke mikrofon, listrik dan digital ke amplifier. Jangan ragu, tapi jangan asal.']
    if (!t.talk_show) return [
      'Tirai terbuka dan penonton bertepuk tangan! Panggung ini terbukti aman di tanganmu.',
      'Tapi aku punya satu permintaan terakhir. Panggung ini butuh pagelaran milikmu sendiri, bukan sekadar dipasang alatnya.',
      'Di meja perancang tengah aula, pilihlah panggungnya, musiknya, gaya penampilannya, dan liriknya. Semakin senada pilihanmu, semakin kuat pesan pertunjukanmu. Tapi perpaduan yang berani pun boleh.',
    ]
    if (!t.show) return ['Meja Perancang ada di tengah aula. Pilih panggung, musik, penampilan, dan lirik, lalu tampilkan pagelaranmu.']
    return ['Itu pagelaran yang akan dikenang. Dari bambu Minang sampai panggung ini, kau telah menempuh perjalanan panjang, Maestro.', 'Buka Buku Catatan Seni lewat tombol Buku untuk melihat perjalananmu.']
  },
  onTalked: (scene, t) => { if (!t.talk_manager) scene.completeTask('talk_manager'); else if (t.stage && !t.talk_show) scene.completeTask('talk_show') },
}
