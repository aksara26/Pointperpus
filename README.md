# 📚 Perpustakaan Poin Web App
> **Eksperimentasi Gamifikasi Profil & Sistem Apresiasi Pemustaka**  
> Dibuat untuk Seleksi Staf IT Semester 2 — UPT Perpustakaan UNIDA Gontor.

---

## 📌 1. Cerita Dibalik Ide Ini (Kenapa Bikin Ini?)
Jujur saja, kalau kita bicara soal web perpustakaan, sistem pencatatan atau statistik kunjungan dasar itu biasanya sudah ada di web utama. Tapi dari sudut pandang mahasiswa, ada satu hal yang sering terasa hilang: **rasa seru dan apresiasi saat berkunjung.**

Seringkali berkunjung atau meminjam buku fisik terasa seperti rutinitas formal yang kaku. Kita datang, pinjam buku, baca, lalu pulang tanpa ada impresi khusus. Padahal, anak muda zaman sekarang sangat akrab dengan dunia game—di mana setiap tindakan kecil memberi kita poin, *leveling*, dan *reward* visual yang bikin bangga.

Dari situ timbul pertanyaan seru: *"Gimana kalau aktivitas ke perpustakaan dibikin kayak main game RPG?"*

Bukan cuma datang untuk menyelesaikan tugas, tapi mahasiswa punya motivasi ekstra: mengejar poin dari tiap kunjungan atau peminjaman buku, lalu menukarkannya dengan kustomisasi profil seperti **Border Avatar Glowing** dan **Banner Profil**. Ada perasaan puas dan bangga ketika akun perpustakaan kita kelihatan beda dan estetik dari yang lain!

---

## 🎯 2. Siapa yang Bakal Merasa Terbantu & Terhibur?
* **Mahasiswa / Pemustaka:** Mendapatkan pengalaman baru yang interaktif. Aktivitas literasi bukan lagi paksaan, melainkan petualangan mengumpulkan koleksi *border* dan *banner* eksklusif.
* **Staf IT / Pustakawan (Admin):** Memiliki alat bantu cepat untuk mengapresiasi keaktifan mahasiswa. Cukup memasukkan NIM mahasiswa dan memilih aktivitasnya, poin langsung bertambah secara *real-time*.

---

## 💡 3. Bagaimana Solusi Ini Bekerja?
Aplikasi dibangun dengan antarmuka modern berkonsep **Light Blue Glassmorphism** (nuansa es dan es biru dengan efek kaca transparan) yang memberikan kesan segar dan kekinian.

### Fitur Utama:
1. **Sistem Poin & Katalog Apresiasi (Gamifikasi Core):**
   * Mahasiswa mengumpulkan poin dari kunjungan atau peminjaman buku.
   * Poin dapat digunakan untuk membeli atribut profil di katalog.
   * Katalog diatur rapi: **Banner Profil** ditempatkan di posisi paling atas, disusul oleh variasi **Border Avatar** (Bronze, Silver, Gold Glowing, hingga Custom Image).
2. **Pengalaman langsung (*Buy & Equip*):**
   * Saat poin mencukupi, mahasiswa bisa menukarkan poin dan seketika memasang (*equip*) atribut tersebut ke profil akun mereka.
3. **Kalender Interaktif Admin (Date Picker):**
   * Staf perpustakaan dapat fleksibel memilih tanggal presensi saat mencatat aktivitas mahasiswa.
4. **Penyimpanan Lokal Sederhana (`localStorage`):**
   * Berjalan tanpa *backend* database yang rumit, menjaga prototipe tetap ringan, cepat, dan aman sesuai batasan seleksi.

---

## 🚀 4. Cara Menjalankan Aplikasi
Aplikasi ini bersifat *standalone web app* (HTML5, CSS3, JavaScript Vanilla) sehingga tidak memerlukan instalasi *dependency* Node.js maupun PHP.

1. **Clone Repositori ini:**
   ```bash
   git clone [https://github.com/aksara26/pointperpus.git](https://github.com/aksara26/pointperpus.git)
