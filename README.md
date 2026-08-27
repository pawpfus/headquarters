# HEADQUARTERS

Markas komando 8-bit — landing page seluruh tools dalam satu ruangan pixel-art,
dengan dinosaurus ungu yang bisa berjalan mengunjungi tiap meja kerja.

**Live:** https://headquarters-phi.vercel.app/

## Denah

Markas punya dua lantai yang dihubungkan **lift** di dinding utara, tepat di
samping stasiun EVIDENCE. Berdiri di depan pintunya lalu tekan ENTER (atau
ketuk pintunya dua kali di layar sentuh) untuk berpindah lantai; papan nama
lantai yang sedang dibuka tampil di bawah judul HEADQUARTERS.

| Lantai | Isi |
|---|---|
| **1 — Ruang kerja** | Tujuh stasiun tool, lorong tengah, kebun hidroponik, lounge (TV, sofa, jukebox), bengkel |
| **2 — Ruang arsip** | Serambi lift + aula arsip memanjang: PROJEKT-FER & PROJECT ROPS, rak ordner, mesin pemindai berkas, troli dokumen |

Peliharaan, robot pembersih, dan drone kargo hanya berkeliaran di lantai 1; lantai 2
punya robot arsiparis sendiri yang menyusuri lorong depan rak dan sesekali menarik
ordner keluar. Dari balik railing tepi dek, lantai kerja di bawah terlihat samar.
Cuaca (hujan, petir, kawanan burung, pelangi, bintang jatuh) tampak di jendela kedua
lantai, jadi keduanya terasa satu bangunan.

## Tools yang terhubung

| Stasiun | Lantai | Tujuan |
|---|---|---|
| DAYDAYREPORT | 1 | https://hari-hari-laporan-v2.vercel.app/ |
| EVIDENCE | 1 | https://evidenlcs.vercel.app/ |
| DIFFUSION REPORT | 1 | https://laporandiseminasi.vercel.app/ |
| AREA SAMPLING | 1 | https://ksapendampingan.vercel.app/ |
| ESC FORGE | 1 | https://skp-forge.vercel.app/ |
| COOPERSTOWN | 1 | https://hari-hari-laporan-v2.vercel.app/peta-poktan.html |
| WORKSHOP | 1 | https://drum-seeder-pm-aas.vercel.app/ |
| PROJEKT-FER | 2 | https://projekt-fer.vercel.app/ |
| PROJECT ROPS | 2 | https://project-rops.vercel.app/ |

## Kontrol

- **Panah / WASD** — berjalan (analog stick muncul otomatis di layar sentuh)
- **Ketuk/klik meja** — karakter mencari jalan sendiri ke meja itu
- **ENTER / tombol BUKA** — membuka tool saat berada di dekat meja
- **ENTER di depan lift** — naik/turun lantai
- **SPASI / Z** — lompat
- **M / ESC** — daftar akses cepat semua tools

## Menambah stasiun baru

Tiga hal yang perlu disentuh di `app.js`:

1. Entri baru di `TOOLS` (`id`, `name`, `desc`, `url`, `color`, `floor`, `lo`, `rect`).
   `floor` menentukan denah tempatnya berdiri; `lo` adalah tinggi overhang art-nya
   supaya label duduk pas di atas gambar.
2. Blok `furn(...)` + `anims.push(...)` untuk pixel-art-nya — ditulis di bagian
   lantai yang bersangkutan, karena `FURN`/`anims` ditukar per lantai oleh `setFloor()`.
3. Naikkan `VERSION` di `sw.js`, kalau tidak service worker akan tetap menyajikan
   `app.js` lama dari cache.
