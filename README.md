# Melody Academy: The Inner Symphony — Tahap 1

Cara menjalankan (wajib lewat server lokal, karena memakai ES module):

    cd melody-academy
    python3 -m http.server 8000      # atau: npx serve
    # buka http://localhost:8000 di browser

Untuk uji di HP: satu Wi-Fi, buka http://<IP-laptop>:8000 (putar ke landscape).
Untuk dipakai siswa: unggah seluruh folder ke hosting statis (GitHub Pages, Netlify, dll).

## Kontrol
PC: WASD / panah = jalan, E = bicara, ENTER = lanjut dialog, TAB = Buku Rapor.
HP: joystick (sentuh area kiri), tombol tangan kanan-bawah = interaksi.

## Struktur
js/config.js            konstanta (resolusi 384x216, kecepatan, daftar kelas)
js/data/                avatars, npcs (dialog), world (collider, pintu, misi)
js/scenes/              Boot, Splash, Menu, Game
js/objects/             Player, Npc
js/ui/                  Hud (DOM), VirtualJoystick, InteractButton
js/systems/Storage.js   LocalStorage (profil, IP, progres, records untuk dashboard guru)
assets/                 sprite hasil pxl (sumber: academy.px.js)

## Tahap 2 (Galeri Etnik)
- Masuk Galeri: berdiri di depan pintu Galeri Etnik lalu tekan E (atau tombol tangan di HP).
- Misi 1: sentuh Saluang. Tahan SPASI/E/sentuh layar untuk meniup, lepas di zona hijau, tahan lagi cepat.
- Misi 2: setelah Maestro bercerita, hampiri Panggung Gamelan. Fase 1 dengarkan, fase 2 susun Gong sampai Ceng-ceng.
- Suara disintesis lewat WebAudio (tanpa file audio); bunyi baru aktif setelah pemain menekan/menyentuh sesuatu.
- Tugas baru: js/scenes/WorldScene.js (kelas dasar ruang), GalleryScene, MiniSaluangScene, MiniGamelanScene; data/quests.js.

## Tahap 3 (Lab DNA Genre)
- Masuk Lab: berdiri di depan pintu Lab DNA Genre (kedua dari kiri, baris atas), tekan E.
- Misi 3: bicara dengan Detektif Nada, lalu hampiri Karpet Genre. Ketuk instrumen untuk mendengar, seret ke karpet Pop (menengah, rileks) atau Rock (menghentak, agresif).
- Misi 4: setelah Detektif memberi teka-teki, hampiri Mixing Desk. Track 1 & 2 = instrumen digital presisi, Track 3 = instrumen tradisional ber-human error. Tekan PUTAR RACIKAN: ketukan mesin lurus di grid, napas manusia melenceng.
- Tambahan kode: scenes/LabScene.js, MiniGenreScene.js, MiniMixScene.js; data/genre.js, data/mix.js, data/lab.js; Audio.mixLoop().
- Panel misi kini menampilkan misi yang sedang dikerjakan (bisa urutan bebas antar ruangan).

## Tahap 4 — Lorong Waktu Evolusi & Ruang Kedap Apresiasi (Misi 5)
- **Lorong Waktu Evolusi**: 4 piringan era (Tradisi, Keroncong, Pop-Rock, Elektronik). Putar tiap piringan: +25 IP per era.
- **Ruang Kedap Apresiasi**: bicara dengan Penyimak Hening dulu, lalu pakai meja osiloskop.
- **Misi 5 (Kalibrasi Apresiasi)**: 4 slider (Nada 75, Irama 60, Melodi 90, Harmoni 80). Tahan toleransi ±4 selama 1,2 dtk. Skor turun 10 per petunjuk / per 20 dtk lewat 60 dtk (min 60). IP maks 350.
- Target & slider dapat diubah di `js/data/calibrate.js` (Irama & Harmoni adalah pilihan desain; spesifikasi hanya menetapkan Nada & Melodi).

## Tahap 5 — Panggung Latihan Kibor (Misi 6 & 7)
- Masuk lewat pintu Panggung Latihan Kibor (bangunan bawah, kedua dari kiri). Bicara dengan Sang Virtuoso dulu.
- **Misi 6 (Postur Sang Maestro)**: E di Piano Besar. Klik 4 sendi yang perlu diatur (Bahu, Siku, Pergelangan, Punggung); Lutut & Telapak kaki sudah benar. Salah klik -15 skor (min 60). IP maks 300.
- **Misi 7 (Puzzle Tuts Raksasa)**: E di Metronom, lalu injak tuts lantai 1-5 sesuai 3 pola (1-2-3-4-5, 5-4-3-2-1, 1-3-5-3-1). Salah injak: pola mulai dari awal, -10 skor per salah (min 60). IP maks 350.
- File baru: scenes/KiborScene.js, scenes/MiniPostureScene.js, data/kibor.js.

## Tahap 6 — Taman Kaca Karya, Aula Pagelaran Agung, Buku Catatan Seni, Dashboard Guru (GAME LENGKAP)
- **Taman Kaca Karya**: bicara dengan Pujangga, sentuh 8 kata bercahaya, lalu susun syair (Misi 8, IP maks 350). Pot kaca di kanan: seret blok Motif, Frasa, Kalimat Lagu dari bawah ke atas (Misi 9, IP maks 350).
- **Aula Pagelaran Agung**: bicara dengan House Manager. Misi 10 (final, IP maks 500) hanya terbuka bila Misi 1-9 tuntas. Seret instrumen: akustik ke mikrofon, listrik/digital ke amplifier (kabel).
- **Buku Catatan Seni**: muncul otomatis setelah Misi 11 (Pagelaran Impian), juga lewat Buku > "Buku Catatan Seni". Berisi nama, kelas, persen 7 bab, total IP, status. 11/11 misi = "Maestro Harmoni Muda".
- **Dashboard Guru**: di menu awal klik judul/logo "Melody Academy" 5x dalam 3 detik. Tabel [HASIL SISWA] + [DOWNLOAD CSV] (UTF-8, siap dibuka di Excel) + hapus data. Data ada di LocalStorage perangkat yang dipakai siswa, jadi guru membuka dashboard di perangkat yang sama (atau tiap siswa mengirim CSV dari perangkatnya).
- Persen bab = rata-rata skor misi di bab itu. Pemetaan bab: 1 Nusantara (M1-2), 2 Genre (M3), 3 Etnik Modern (M4), 4 Apresiasi (M5), 5 Kibor (M6-7), 6 Kreasi (M8-9), 7 Pagelaran (M10). Ubah di js/systems/Report.js.

## Pembaruan: zoom, kamera, dan Layar Materi
- **Kamera**: default lebih dekat (zoom 1,8) dan selalu mengikuti karakter. Zoom berjenjang bilangan bulat (1x-4x, default 2x) lewat roda mouse, cubit dua jari, tombol + / - di layar, atau keyboard + / -; supaya piksel tetap tajam dan tidak berbayang. Kamera mengikuti karakter tanpa jeda.
- **Layar Materi**: di tiap rumah ada layar kecil dekat pintu (tekan E). Film pendek memutar materi bab terkait; saat narasi menyebut sebuah benda (saluang, gong, osiloskop, kabel, amplifier, dst.), benda itu muncul dan menyala di layar. Ketuk/ENTER untuk lanjut, "Lewati" untuk keluar. Menamatkan film memberi +30 IP (sekali). Isi film ada di `js/data/films.js` (penanda `[id:kata]`), ilustrasinya di `js/ui/filmProps.js`.
- Bab 2 (Genre) kini mencakup Misi 3 dan 4, sesuai master prompt (Misi 4 memakai Materi 2 dan 3).

## Pembaruan: musik dan efek suara
- Musik latar per lokasi (Menu, Alun-alun, Galeri, Lab, Lorong, Kedap, Kibor, Taman, Aula, film materi), pindah halus (crossfade). Saat mini-game, musik diredam supaya bunyi latihan terdengar jelas.
- Efek baru: langkah kaki, pintu, interaksi, dialog (ketikan), dapat IP, tugas/misi selesai, benda muncul di film, fanfare Buku Catatan, dan klik tombol.
- Tombol **MUS** dan **SFX** di HUD menyalakan/mematikan musik dan efek; pilihan diingat.
- Sumber: `assets/audio/` (mp3 musik, wav efek), dibuat dari `melody-audio/sounds.cx.js` dengan chirp.

## Pembaruan: Mixing Deck, melodi pot kaca, Misi 11
- **Mixing Deck (Misi 4)**: tiap track punya pemilih `< chip >` dengan 4 pilihan (Ritme, Harmoni, Melodi). Semua chip berada pada satu tangga nada dan rangkaian akor (Am-F-C-G) sehingga kombinasi apa pun enak. Mengganti chip langsung terdengar tanpa putus irama. Skor 70 + 10 untuk tiap track yang dijelajahi.
- **Pot Kaca (Misi 9)**: Motif, Frasa, dan Kalimat Lagu kini satu lagu yang tumbuh (E G A G, lalu jawabannya, lalu kontras dan penutup di C), lengkap dengan iringan. Tekan blok untuk mendengarnya.
- **Misi 11 Pagelaran Impian** (Aula, Meja Perancang): pilih panggung, musik, penampilan, dan lirik, lalu tampilkan. Penilaian dari kesenadaan nuansa (tradisi, modern, klasik, santai); fusi tradisi-modern juga dihargai.
