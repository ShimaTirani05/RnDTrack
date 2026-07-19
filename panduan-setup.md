# Panduan Setup — R&D Progress Tracker

Aplikasi ini terdiri dari **satu file** `index.html`. Semua data bisa diedit langsung di aplikasi, link Google Drive bisa diganti kapan saja, dan progress KPI dihitung otomatis.

Ada 3 hal yang perlu Anda putuskan:

| Kebutuhan | Perlu setup? | Bagian |
|---|---|---|
| Pakai aplikasi (data tersimpan di 1 perangkat) | Tidak, langsung jalan | A |
| Data **otomatis update antar-device** | Ya — Firebase (gratis) | B |
| **Reminder mingguan** via WhatsApp / Email | Ya — Google Apps Script (gratis) | C |

---

## A. Menjalankan aplikasi

**Cara paling cepat:** buka `index.html` lewat browser (klik dua kali). Aplikasi langsung berfungsi. Data tersimpan di perangkat itu (lewat penyimpanan browser).

**Agar bisa diakses & di-"install" di banyak HP/laptop**, aplikasi perlu di-hosting online (gratis). Pilih salah satu:

- **Netlify Drop** (paling mudah): buka https://app.netlify.com/drop lalu seret file `index.html` ke sana. Selesai — Anda dapat link seperti `namaanda.netlify.app`.
- **GitHub Pages**: buat repository, upload `index.html`, aktifkan Pages di Settings.
- **Vercel / Cloudflare Pages**: serupa, upload file.

Setelah online, buka link tersebut di HP → menu browser → **"Add to Home screen"** agar tampil seperti aplikasi terinstall.

> Tanpa langkah B, tiap perangkat menyimpan datanya **sendiri-sendiri**. Untuk data yang sama & sinkron di semua perangkat, lanjut ke bagian B.

---

## B. Sync otomatis antar-device (Firebase — gratis)

Firebase Firestore membuat semua perangkat melihat & mengedit **data yang sama secara real-time**. Perubahan di HP Shima langsung muncul di laptop Anda.

**Langkah:**

1. Buka https://console.firebase.google.com → **Add project** → beri nama (mis. `rnd-tracker`). Ikuti sampai selesai (Google Analytics boleh dimatikan).
2. Di menu kiri: **Build → Firestore Database → Create database** → pilih mode **Production** → lokasi `asia-southeast2 (Jakarta)`.
3. Masuk tab **Rules**, ganti isinya dengan aturan sederhana berikut lalu **Publish**:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /rnd/state {
         allow read, write: if true;
       }
     }
   }
   ```

   > Ini membuat data bisa dibaca/ditulis tanpa login — cocok untuk tim internal kecil. Bila ingin lebih aman, aktifkan Firebase Authentication lalu ubah `if true` menjadi `if request.auth != null`.

4. Kembali ke **Project Overview** → klik ikon **`</>` (Web)** → daftarkan app → salin objek `firebaseConfig` yang muncul.
5. Buka `index.html` dengan teks editor, cari bagian **`FIREBASE_CONFIG`** di dekat atas `<script>`, dan isi nilainya:

   ```js
   const FIREBASE_CONFIG = {
     apiKey: "AIza........",
     authDomain: "rnd-tracker.firebaseapp.com",
     projectId: "rnd-tracker",
     storageBucket: "rnd-tracker.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abcdef"
   };
   ```

6. Simpan, lalu upload ulang file ke hosting (bagian A).

Selesai. Indikator di kiri bawah akan berubah menjadi **"Tersinkron antar-device"** (titik hijau). Semua perangkat yang membuka link ini kini berbagi data yang sama.

> Kuota gratis Firebase (Spark plan) sangat besar untuk penggunaan tim kecil — praktis tidak berbayar.

---

## C. Reminder update mingguan (WhatsApp / Email)

Pengingat otomatis mingguan dikirim oleh **Google Apps Script** (gratis, jalan di server Google, tidak perlu komputer menyala). Cocok karena tim sudah memakai Google Drive.

File skrip: **`reminder.gs`** (disertakan). Skrip ini mengirim pesan ke tiap staff setiap minggu.

**Langkah:**

1. Buka https://script.google.com → **New project**.
2. Hapus isi default, **tempel seluruh isi `reminder.gs`**.
3. Isi bagian `STAFF` dengan nama, email, dan nomor WhatsApp masing-masing staff (format `62…`, tanpa `+` atau `0` di depan).
4. Pilih channel:
   - **Email** — langsung jalan, tidak perlu apa-apa lagi (pakai Gmail Anda).
   - **WhatsApp** — daftar gateway **Fonnte** (https://fonnte.com), sambungkan nomor pengirim, salin **token**-nya ke variabel `FONNTE_TOKEN`. (Alternatif lain: Twilio, Wablas — sesuaikan URL API.)
5. Klik **Save**. Jalankan fungsi `kirimReminder` sekali secara manual untuk memberi izin (authorize) dan mengetes.
6. Pasang jadwal otomatis: ikon jam **Triggers** (kiri) → **Add Trigger**:
   - Function: `kirimReminder`
   - Event source: **Time-driven** → **Week timer** → pilih hari (mis. **Senin**) & jam (mis. **08:00**).
   - Save.

Setiap minggu pada jadwal itu, tiap staff otomatis menerima pengingat untuk memperbarui datanya.

> Di dalam aplikasi juga sudah ada pengingat visual: banner kuning/merah muncul bila data suatu staff belum diperbarui ≥7 hari, dan sidebar menampilkan "update … hari lalu".

---

## Cadangan & pemulihan data

Di kiri bawah aplikasi ada tombol **Backup data (JSON)** dan **Pulihkan dari backup** — untuk berjaga-jaga atau memindahkan data antar setup.

## Ringkasan menu per staff

- **Shima** — Melon (GH Blok B & GH F: umur, tanam, panen, KPI), Nursery (stok), Karantina & Aklimatisasi (stok bibit + keterangan)
- **Muthia** — Pengajuan (MR/PR), Berita Acara, Forkom, Notulensi, Review, Risalah Riset, SPK & BAPP (semua link drive)
- **Dafit** — Biochar, Kompos, Vermicast, Vermijuice (stok, alokasi, produksi vs target KPI)
- **Thifa** — Nutrisi Organik (AAP/Bioenzim/POC/Biopestisida), Beneficial Microorganism (Trichoderma/Bacillus/Mikoriza/Metharizium), Analisa HPT
- **Huda** — Kondisi Iklim (curah & hari hujan per kebun, total otomatis), Monitoring Kebun (4 kebun: temuan HPT + kelembaban)
- **Sofyan** — Alpukat, Kelengkeng, Nangka, Pisang, Durian (populasi, forecast, panen vs target KPI per blok)
