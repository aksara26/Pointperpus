# Perpustakaan Poin Web App

> Prototipe sistem presensi berbasis poin dan gamifikasi profil pemustaka.  
> Fokus utama: fitur reward yang dapat ditukar dengan poin, seperti **border avatar** dan **banner profil**.

**Pengembang:** Arya Wira Pratama  
**Program Studi:** Teknik Informatika, Semester 2  
**Institusi:** UPT Perpustakaan Universitas Darussalam Gontor

---

## 1. Masalah yang Dipilih

Aktivitas mahasiswa seperti berkunjung ke perpustakaan dan meminjam buku sering kali hanya menjadi rutinitas. Aktivitas tersebut memang tercatat, tetapi belum tentu memberikan umpan balik yang membuat mahasiswa melihat progres atau merasa termotivasi untuk kembali.

Proyek ini berangkat dari pertanyaan:

> Bagaimana membuat aktivitas literasi lebih terasa dihargai melalui sistem poin dan reward yang dapat dilihat langsung oleh pemustaka?

Di sisi lain, staf perpustakaan juga membutuhkan cara untuk mencatat aktivitas serta melihat ringkasan kunjungan dan peminjaman.

## 2. Siapa yang Terbantu?

| Pengguna | Manfaat |
|---|---|
| **Mahasiswa/pemustaka** | Mengumpulkan poin dari aktivitas perpustakaan, menukarkannya dengan atribut profil, dan mengelola reward yang telah dimiliki. |
| **Pustakawan/admin** | Mencatat aktivitas, memberikan poin, mengelola katalog reward, dan melihat riwayat penukaran. |
| **Perpustakaan** | Memiliki prototipe pendekatan gamifikasi untuk mendukung keterlibatan pemustaka dan budaya literasi. |

## 3. Bagaimana Solusi Bekerja?

Aplikasi menggunakan alur sederhana berikut:

1. Mahasiswa melakukan aktivitas kunjungan atau peminjaman buku.
2. Admin mencatat aktivitas tersebut dan memberikan poin.
3. Poin tersimpan pada profil mahasiswa.
4. Mahasiswa membuka katalog hadiah dan menukarkan poin dengan reward yang tersedia.
5. Reward yang telah dimiliki dapat dipasang atau dilepas dari profil.
6. Riwayat penukaran dapat dilihat oleh mahasiswa dan admin.

### Fitur yang tersedia

- **Login demo:** akses simulasi untuk admin dan mahasiswa.
- **Pencatatan aktivitas:** admin mencatat kunjungan dan peminjaman serta memberikan poin.
- **Dashboard:** ringkasan dan grafik tren kunjungan/peminjaman.
- **Katalog reward:** pilihan banner profil dan border avatar.
- **Manajemen reward:** admin dapat menambah, mengedit, menghapus, serta mengaktifkan atau menonaktifkan reward.
- **Koleksi mahasiswa:** mahasiswa dapat melihat reward yang dimiliki serta menggunakan tombol **Pakai** dan **Lepas**.
- **Riwayat penukaran:** transaksi penukaran dicatat dan dapat dilihat oleh mahasiswa maupun admin.
- **Penyimpanan lokal:** data prototipe disimpan menggunakan `localStorage` browser.

## 4. Cara Melihat dan Menjalankan

### Prasyarat

- Browser modern, seperti Google Chrome, Microsoft Edge, atau Mozilla Firefox.
- **VS Code** dan ekstensi **Live Server** (opsional, disarankan).
- **Git** (opsional, jika ingin meng-clone repositori).

### Langkah menjalankan

Clone repositori:

```bash
git clone https://github.com/aksara26/Pointperpus.git
cd pointperpus
```

Pilih salah satu cara berikut untuk membuka aplikasi:

**Cara A — Langsung melalui browser**

Buka file `index.html` menggunakan browser.

**Cara B — Menggunakan Live Server (disarankan)**

1. Buka folder proyek di VS Code.
2. Klik kanan file `index.html`.
3. Pilih **Open with Live Server**.
4. Browser akan terbuka pada alamat lokal, biasanya `http://127.0.0.1:5500`.

Aplikasi dibuat menggunakan HTML, CSS, dan JavaScript vanilla. Tidak memerlukan `npm install`, proses build, server backend, ataupun konfigurasi database.

### Akun demo

| Peran | Username | Password |
|---|---|---|
| Admin/pustakawan | `admin` | `123456` |
| Mahasiswa | `2022101234` | `123456` |

Tombol **Demo Admin** dan **Demo Mahasiswa** pada halaman login dapat digunakan untuk mengisi akun demo secara otomatis.

Akun mahasiswa demo bernama **Andi Pratama**. Akun ini memiliki 35 poin awal dan beberapa reward agar fitur koleksi dapat langsung dicoba.

> **Catatan:** password pada prototipe belum diverifikasi. Kolom password hanya diwajibkan terisi. Akun tersebut hanya untuk simulasi dan tidak boleh digunakan sebagai autentikasi sungguhan.

## 5. Hal yang Belum Selesai dan Asumsi

Proyek ini masih berupa prototipe. Beberapa batasan dan asumsi yang perlu diketahui:

- **Penyimpanan:** data pengguna, poin, reward, dan riwayat disimpan di `localStorage` browser. Data tidak tersinkron antarperangkat dan dapat hilang jika penyimpanan browser dihapus.
- **Data simulasi:** data pengguna dan aktivitas merupakan data dummy, bukan data riil perpustakaan.
- **Belum ada backend:** aplikasi belum terhubung ke database atau API internal perpustakaan.
- **Autentikasi terbatas:** login masih berupa simulasi. Belum tersedia verifikasi password, manajemen sesi, atau pembatasan akses yang aman.
- **Data dashboard:** sebagian angka dashboard dan grafik menggunakan data contoh, bukan statistik riil.
- **Filter tanggal:** date picker saat ini memengaruhi ringkasan bulan, tetapi belum memfilter seluruh tampilan grafik.
- **Penyimpanan gambar:** gambar reward disimpan sebagai base64 di `localStorage`, sehingga kapasitasnya mengikuti batas penyimpanan browser.
- **Tampilan mobile:** tampilan lebih diutamakan untuk desktop; penyesuaian untuk layar ponsel masih terbatas.

**Asumsi prototipe:** pencatatan aktivitas dan pemberian poin dilakukan oleh admin. Poin diberikan sebagai simulasi berdasarkan aktivitas dan belum terhubung otomatis dengan sistem presensi atau sirkulasi perpustakaan.

## 6. Langkah Berikutnya Jika Ada Waktu Lebih

Pengembangan berikutnya dapat difokuskan pada:

1. **Backend dan database:** membangun REST API dan menghubungkannya ke database agar data tersimpan secara terpusat.
2. **Autentikasi:** menerapkan hashing password, manajemen sesi, dan hak akses berdasarkan peran.
3. **Presensi QR/barcode:** mengintegrasikan pemindaian kartu mahasiswa agar pencatatan lebih praktis.
4. **Statistik aktual:** menggunakan data transaksi nyata agar dashboard dan grafik menampilkan informasi yang akurat.
5. **Ekspor laporan:** menyediakan unduhan rekap kunjungan, peminjaman, dan penukaran dalam format Excel atau PDF.
6. **Tampilan mobile:** menyempurnakan layout agar nyaman digunakan di ponsel.
7. **Gamifikasi lanjutan:** menambahkan badge pencapaian, gelar profil, leaderboard, dan streak kunjungan.

---

## Catatan Penggunaan AI

Pengembangan prototipe ini dibantu oleh:

- **Gemini AI:** membantu penyusunan awal struktur kode JavaScript, perbaikan logika `localStorage`, dan penyusunan konsep gamifikasi.
- **OpenCode:** membantu refactor fitur reward, penambahan validasi, perbaikan bug, dan penyusunan dokumentasi.

Arah proyek, pemilihan masalah, fitur yang menjadi fokus, alur demo, serta keputusan akhir pengembangan ditentukan oleh pengembang. AI digunakan sebagai alat bantu selama proses pengerjaan.

---

## Struktur Proyek

```text
Pointperpus/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── favicon.ico
└── Readme.md
```

## Status Implementasi

**Sudah tersedia:**

- Login demo admin dan mahasiswa.
- Pencatatan poin kunjungan dan peminjaman.
- Katalog reward border dan banner.
- Penukaran poin dengan konfirmasi.
- Fitur pakai dan lepas atribut profil.
- Filter koleksi reward mahasiswa.
- CRUD reward oleh admin, termasuk status aktif/nonaktif.
- Riwayat penukaran untuk mahasiswa dan admin.
- Migrasi data atribut dari format lama.
- Validasi upload gambar dan kompresi otomatis.

**Masih terbatas:**

- Password belum divalidasi.
- Sebagian angka grafik dan KPI masih berupa data dummy.
- Layout mobile belum sepenuhnya dioptimalkan.
- Belum tersedia backend, autentikasi nyata, atau penyimpanan gambar permanen.

---

*Dibuat oleh Arya Wira Pratama — Teknik Informatika, Semester 2.*  
*UPT Perpustakaan Universitas Darussalam Gontor.*
