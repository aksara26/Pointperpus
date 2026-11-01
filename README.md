# 📚 Perpustakaan Poin Web App
> **Prototipe Sistem Presensi Berbasis Poin & Gamifikasi Profil Pemustaka**  
> **Fokus inovasi:** fitur *reward* untuk menukar poin dengan border, banner, dan koleksi profil.  
> Ditujukan untuk Seleksi Staf IT Semester 2 — UPT Perpustakaan UNIDA Gontor.  
> **Disusun oleh:** Arya Wira Pratama — Teknik Informatika, Semester 2.

> *Bayangkan seorang mahasiswa datang ke perpustakaan, meminjam buku, lalu pulang seperti biasa. Tidak ada yang istimewa. Padahal kunjungan dan peminjaman itu bisa menjadi awal dari kebiasaan literasi yang lebih panjang. Dari pertanyaan sederhana itulah proyek ini dimulai: bagaimana membuat aktivitas perpustakaan terasa lebih berarti dan terlihat hasilnya?*

---

## 📌 1. Masalah yang Dipilih & Latar Belakang

Layanan digital perpustakaan tidak hanya soal ketersediaan katalog buku. Ada masalah lain yang sering luput: **bagaimana membuat pemustaka merasa bahwa kunjungan dan peminjaman mereka dihargai.**

Selama ini, berkunjung ke perpustakaan dan meminjam buku sering dianggap rutinitas biasa. Tidak ada *feedback* yang membuat mahasiswa ingin kembali, tidak ada progres yang terlihat, dan tidak ada alasan kecil untuk datang lagi selain kewajiban akademik. Di sisi lain, staf perpustakaan juga membutuhkan cara cepat untuk mencatat aktivitas harian serta melihat tren kunjungan dan peminjaman.

Dari dua sisi itu, saya memilih satu masalah yang lebih spesifik untuk dijadikan inovasi:

> **Aktivitas literasi mahasiswa sudah tercatat, tetapi belum diubah menjadi pengalaman yang memotivasi.**

**Permasalahan Utama:**
1. **Rendahnya Motivasi Pemustaka:** Kunjungan dan peminjaman sering dianggap rutinitas tanpa *engagement* atau *rewarding system*.
2. **Kebutuhan Pencatatan Staf:** Staf membutuhkan modul rekapitulasi cepat untuk melihat tren kunjungan dan peminjaman.
3. **Belum Ada Umpan Balik yang Terlihat:** Mahasiswa tidak punya alasan konkret untuk merasa bahwa aktivitas literasinya berdampak.

---

## 🎯 2. Siapa yang Terbantu?

* **Pemustaka / Mahasiswa:** Mendapatkan pengalaman interaktif melalui poin harian yang dapat ditukarkan dengan kustomisasi profil, seperti **Border Avatar** dan **Banner Profil**.
* **Staf IT / Pustakawan (Admin):** Mendapatkan modul untuk mencatat aktivitas, mengelola katalog *reward*, serta memantau riwayat penukaran.
* **Perpustakaan sebagai Institusi:** Memiliki cara baru untuk mendorong budaya literasi tanpa harus menambah banyak program manual.

---

## 💡 3. Bagaimana Solusi Bekerja

Aplikasi ini membayangkan alur sederhana:

1. Mahasiswa datang ke perpustakaan atau meminjam buku.
2. Admin mencatat aktivitas tersebut dan memberikan poin.
3. Poin terkumpul di profil mahasiswa.
4. Mahasiswa membuka katalog hadiah dan menukarkan poin.
5. Reward langsung terpasang di profil, sehingga usahanya terlihat.
6. Admin dapat memantau siapa menukar apa dan berapa poin yang digunakan.

Dengan alur itu, poin bukan sekadar angka. Poin menjadi **bukti kecil bahwa aktivitas literasi dihargai.**

### Fitur Utama:

1. **Kalender Interaktif (Date Picker Header):** Admin dapat memilih tanggal presensi secara fleksibel.
2. **Grafik Tren Kunjungan & Peminjaman (Chart.js):**
   * **Kurva Biru Muda:** Statistik kunjungan perpustakaan.
   * **Kurva Biru Tua:** Statistik peminjaman buku.
   * Grafik diperbarui saat aktivitas baru dicatat.
3. **Katalog Atribut Terurut:**
   * Menampilkan **Banner Profil** di bagian atas, diikuti **Border Avatar**.
   * Mahasiswa dapat menukar poin dan langsung memasang atribut ke profil.
4. **Manajemen Reward (Admin):**
   * Tambah, edit, hapus, serta aktif/nonaktifkan atribut.
   * Upload gambar divalidasi dan dikompres otomatis agar hemat penyimpanan.
   * Nama reward duplikat ditolak.
   * Penghapusan reward ikut membersihkan koleksi dan atribut yang sedang dipakai mahasiswa.
5. **Koleksi & Penukaran Mahasiswa:**
   * Filter **Koleksi Saya** untuk melihat reward yang sudah dimiliki.
   * Tombol **Pakai** dan **Lepas** untuk mengatur border/banner yang aktif.
   * Konfirmasi sebelum poin dipotong, sehingga penukaran tidak terjadi tanpa sengaja.
   * Riwayat penukaran tercatat untuk mahasiswa dan admin.
6. **Penyimpanan Sementara (Simulasi Dummy):** Data pengguna, reward, dan riwayat disimpan di `localStorage` browser.

### Yang Membuat Fitur Reward Ini Berbeda:

Fitur reward tidak hanya berhenti di “beli lalu pakai”. Ada beberapa hal yang saya sengaja tambahkan agar terasa seperti sistem, bukan sekadar katalog:

* **Admin bisa mengelola siklus hidup reward:** tambah, edit, aktif/nonaktif, dan hapus.
* **Mahasiswa punya kontrol:** bisa memakai, melepas, dan melihat koleksi sendiri.
* **Penukaran punya jejak:** poin yang keluar tercatat di riwayat, bukan hilang begitu saja.
* **Data lama tetap aman:** sistem memigrasikan data border/banner versi lama ke format ID yang baru.
* **Penghapusan tidak meninggalkan data menggantung:** reward yang dihapus juga dilepas dari profil mahasiswa.

---

## 🚀 4. Cara Menjalankan Aplikasi

Aplikasi ini adalah *standalone web app* berbasis HTML5, CSS3, dan JavaScript Vanilla. Tidak memerlukan instalasi Node.js, PHP, atau database.

### 4.1 Prasyarat

* Browser modern (Chrome, Edge, atau Firefox versi terbaru).
* **Git** — opsional, hanya jika ingin meng-clone repositori.
* **VS Code + extension Live Server** — opsional, tetapi direkomendasikan.

### 4.2 Langkah Menjalankan

**Cara 1 — Langsung dari file (paling cepat):**

1. Clone repositori:
   ```bash
   git clone https://github.com/aksara26/Pointperpus.git
   cd pointperpus
   ```
2. Buka file `index.html` dengan klik dua kali, atau klik kanan → *Open with* → browser.

**Cara 2 — Live Server (disarankan):**

1. Buka folder proyek di VS Code.
2. Klik kanan `index.html` → **Open with Live Server**.
3. Browser akan terbuka otomatis di alamat seperti `http://127.0.0.1:5500`.

> Tidak ada proses build, `npm install`, atau konfigurasi database. Seluruh data disimpan di `localStorage` browser.

### 4.3 Kode Admin & Mahasiswa

| Peran | Username | Password | Cara Login |
|---|---|---|---|
| **Admin / Pustakawan** | `admin` | `123456` | Isi form, atau klik tombol **`[Demo Admin]`** |
| **Mahasiswa** | `2022101234` | `123456` | Isi form, atau klik tombol **`[Demo Mahasiswa]`** |

Keterangan akun demo:

* **Admin** masuk sebagai pengelola: memberi poin, mengelola katalog reward, dan memantau riwayat penukaran.
* **Mahasiswa** masuk sebagai **Andi Pratama** dengan **35 poin** awal. Ia sudah memiliki *Border Perunggu*, *Border Emas Glowing*, dan *Banner Top Reader*, jadi alur **Pakai** dan **Lepas** bisa langsung dicoba tanpa menukar poin dulu.
* Tombol **`[Demo Admin]`** dan **`[Demo Mahasiswa]`** mengisi form sekaligus login otomatis. Ini cara paling aman dan cepat saat presentasi.

> **Catatan penting:** Password **tidak divalidasi** oleh sistem. Field password hanya wajib diisi agar form bisa dikirim, jadi gunakan `123456` supaya konsisten. Autentikasi nyata (hash password, session, dan pembatasan akses) masih masuk roadmap.

### 4.4 Skenario Demo 5 Menit

1. Login sebagai **Admin**.
2. Buka **Kelola Atribut Profil**.
3. Tambah atau edit reward, lalu tunjukkan status aktif/nonaktif.
4. Klik **Keluar** di sidebar, lalu login sebagai **Mahasiswa**.
5. Buka **Katalog Hadiah**, pilih reward, dan lakukan penukaran.
6. Tunjukkan poin berkurang dan reward langsung terpasang di profil.
7. Buka **Koleksi Saya**, coba tombol **Lepas** dan **Pakai**.
8. Login kembali sebagai **Admin** untuk menunjukkan **Riwayat Penukaran Reward**.

### 4.5 Reset Data Demo

Jika ingin mengulang demo dari kondisi awal, buka DevTools → **Application** → **Local Storage**, lalu hapus key berikut:

* `perpus_users`
* `perpus_rewards`
* `perpus_redemptions`
* `perpus_history`

Atau jalankan di console browser:

```js
localStorage.clear();
location.reload();
```

---

## ⚙️ 5. Asumsi & Batasan Prototipe

Sesuai dengan ruang lingkup seleksi staf IT:

* **Storage:** Data pengguna, riwayat poin, reward, dan riwayat penukaran disimpan sementara di `localStorage` browser.
* **Keamanan Data:** Seluruh data yang digunakan adalah data buatan (*dummy*) tanpa kredensial atau data riil perpustakaan.
* **Integrasi:** Tidak melakukan *fetching* langsung ke database/API server internal UNIDA Gontor.
* **Autentikasi:** Login masih berupa simulasi. Password belum diverifikasi, sehingga prototipe ini tidak boleh dianggap memiliki keamanan produksi.
* **Data Grafik:** Sebagian angka dashboard dan baseline grafik menggunakan data contoh untuk memperlihatkan pola tren. Angka tersebut bukan data riil perpustakaan.
* **Filter Tanggal:** Date picker saat ini memengaruhi ringkasan bulan, belum memfilter seluruh tampilan grafik.
* **Penyimpanan Gambar:** Gambar reward dikompres dan disimpan sebagai base64 di `localStorage`. Kapasitas browser tetap terbatas, sehingga untuk produksi perlu backend atau object storage.
* **Tampilan:** Prototipe dioptimalkan untuk layar desktop. Penyesuaian layout mobile masih terbatas.

---

## 🔮 6. Langkah Pengembangan Selanjutnya (Future Roadmap)

Jika diberikan waktu dan kesempatan pengembangan lebih lanjut:

1. **Integrasi REST API / Backend Server:** Menghubungkan poin, reward, dan riwayat penukaran ke database utama perpustakaan (misalnya PostgreSQL/MySQL).
2. **Presensi Barcode/QR Code:** Memungkinkan mahasiswa memindai KTM untuk input poin otomatis.
3. **Sistem Ekspor Laporan:** Menambahkan unduhan rekapitulasi kunjungan, peminjaman, dan penukaran reward ke Excel/PDF.
4. **Gelar Profil (Title):** Reward teks seperti *Pemustaka Aktif*, *Kutu Buku*, atau *Literasi Master* tanpa perlu aset gambar.
5. **Badge Pencapaian Otomatis:** Badge berdasarkan milestone, misalnya “Kunjungan Pertama”, “10 Kunjungan”, atau “25 Buku Dipinjam”.
6. **Voucher / Privilege Perpustakaan:** Bebas denda, tambahan kuota pinjam, atau prioritas ruang baca dengan sistem kode dan masa berlaku.
7. **Leaderboard & Streak:** Papan peringkat dan bonus konsistensi kunjungan untuk memperkuat sisi gamifikasi.
8. **Autentikasi & Keamanan Nyata:** Hash password, session management, dan pembatasan akses berbasis role.
9. **Tampilan Mobile:** Sidebar drawer, penyesuaian grid, dan tabel yang lebih nyaman di layar kecil.

---

## 🧭 7. Cerita di Balik Proyek

Awalnya saya melihat semua fitur yang diminta sudah ada di sistem perpustakaan. Kalau hanya menambah fitur yang sudah ada, proyek ini akan terasa seperti pengulangan. Karena itu saya memilih satu sudut pandang yang lebih spesifik: **bagaimana mengubah poin aktivitas menjadi pengalaman yang terlihat dan terasa.**

Saya sengaja memulai dari reward yang sederhana: border dan banner. Keduanya mudah dipahami, visual, dan langsung terlihat hasilnya saat demo. Tapi saya juga sadar bahwa reward kosmetik saja bisa terasa dangkal. Karena itu, di roadmap saya menambahkan gelar profil, badge pencapaian, dan voucher perpustakaan sebagai arah pengembangan berikutnya.

Fitur lain seperti presensi, poin, dan dashboard tetap saya pertahankan sebagai konteks. Mereka bukan fokus inovasi, tetapi tanpa mereka, fitur reward tidak punya cerita. Poin harus datang dari suatu aktivitas, dan reward harus punya alasan untuk ditukar.

Hal terpenting yang saya pelajari dari proyek ini bukan sekadar cara membuat katalog hadiah, tetapi cara merancang **loop motivasi**:

> aktivitas → poin → reward → profil terlihat → motivasi untuk kembali.

Kalau loop itu bisa dipahami penguji dalam beberapa menit demo, maka proyek ini sudah mencapai tujuan utamanya.

---

## 🤖 8. Catatan Penggunaan AI

Saya memilih untuk jujur: **prototipe ini tidak dikerjakan sepenuhnya secara manual.**

Saya menggunakan **AI** sebagai alat bantu, dan saya sebutkan dengan jelas alat apa saja:

* **Gemini AI** — membantu penyusunan awal struktur kode JavaScript, perbaikan logika `localStorage`, serta penyusunan konsep gamifikasi.
* **OpenCode (AI coding agent)** — membantu refactor fitur reward, menambah validasi, memperbaiki bug, dan membantu menyusun dokumentasi ini.

Arah proyek tetap saya tentukan: masalah yang dipilih, fitur reward yang ingin ditonjolkan, alur demo, dan keputusan akhir tentang apa yang layak ditampilkan. AI saya perlakukan seperti *pair programmer*, bukan pengganti pemahaman. Saya mencantumkan bagian ini secara terbuka agar penilaian mencerminkan proses yang sebenarnya, bukan hanya hasil akhirnya.

Jika ada kekurangan pada proyek ini, itu tetap menjadi tanggung jawab saya sebagai penyusun.

---

## 🗂️ 9. Struktur Proyek & Data

```text
Perpus/
├── index.html          # Struktur halaman, modal, dan form
├── css/
│   └── style.css       # Tampilan glassmorphism, reward card, modal
├── js/
│   └── script.js       # Logic login, poin, reward, penukaran, chart
├── favicon.ico
└── Readme.md
```

### Data yang Disimpan di `localStorage`

| Key | Isi |
|---|---|
| `perpus_users` | Data admin dan mahasiswa, poin, koleksi, serta atribut yang dipakai |
| `perpus_rewards` | Katalog reward: border, banner, harga, gambar, status aktif |
| `perpus_redemptions` | Riwayat penukaran reward oleh mahasiswa |
| `perpus_history` | Riwayat aktivitas kunjungan dan peminjaman |

---

## ✅ 10. Status Implementasi

**Sudah berjalan:**
* Login demo admin dan mahasiswa.
* Pencatatan poin kunjungan dan peminjaman.
* Katalog reward border dan banner.
* Penukaran poin dengan konfirmasi.
* Pakai dan lepas atribut profil.
* Filter Koleksi Saya.
* CRUD reward oleh admin, termasuk aktif/nonaktif.
* Riwayat penukaran untuk mahasiswa dan admin.
* Migrasi data atribut dari format lama.
* Validasi upload gambar dan kompresi otomatis.

**Diketahui masih terbatas:**
* Password belum divalidasi.
* Sebagian angka grafik/KPI masih dummy.
* Layout mobile belum sepenuhnya dioptimalkan.
* Belum ada backend, autentikasi nyata, atau penyimpanan gambar permanen.

---

*Dibuat oleh: **Arya Wira Pratama** — Teknik Informatika, Semester 2*  
*Dengan bantuan Gemini AI dan OpenCode sebagai alat bantu pengembangan.*  
*UPT Perpustakaan Universitas Darussalam Gontor*
