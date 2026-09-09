# AI Cocok

Website sederhana: user pilih output yang mau dibuat (gambar, video, presentasi, tulisan, dsb), lalu aplikasi menampilkan AI gratis/freemium yang cocok — lengkap kelebihan, keterbatasan, dan tombol langsung ke tool-nya.

Dibangun sebagai PWA statis (HTML/CSS/JS polos, tanpa build step), pola yang sama seperti Syazani Kasir dan aplikasi anggaran: bisa langsung di-deploy ke GitHub Pages dan bisa di-install ke HP sebagai app.

## Struktur file

```
index.html          -> halaman utama
style.css            -> semua styling
script.js             -> logic: load data, filter, render
data/tools.json      -> database AI (edit file ini untuk update konten)
manifest.json        -> supaya bisa di-install sebagai PWA
sw.js                -> service worker untuk offline caching
assets/icon.svg      -> ikon aplikasi
```

## Cara deploy ke GitHub Pages

1. Buat repo baru di GitHub, misalnya `ai-cocok`.
2. Upload semua file di folder ini ke repo tersebut (pertahankan struktur foldernya).
3. Di repo, buka **Settings → Pages**.
4. Di bagian **Source**, pilih branch `main` dan folder `/ (root)`, lalu **Save**.
5. Tunggu 1-2 menit, situs akan aktif di:
   `https://<username-github>.github.io/ai-cocok/`

## Cara update daftar AI (rutin bulanan)

Landscape AI berubah cepat, jadi disarankan cek ulang tiap bulan. Semua konten ada di satu file: **`data/tools.json`**.

Tiap AI punya format seperti ini:

```json
{
  "id": "nama-unik",
  "name": "Nama AI yang ditampilkan",
  "categories": ["gambar", "video"],
  "multi": true,
  "pricing": "freemium",
  "free_limit": "Penjelasan singkat jatah gratisnya",
  "kelebihan": "1-2 kalimat kelebihan utama",
  "keterbatasan": "1-2 kalimat keterbatasan utama",
  "bahasa_indonesia": true,
  "tingkat": "pemula",
  "url": "https://link-ke-tool.com",
  "affiliate_url": null
}
```

Catatan field:
- `categories` — id kategori, cocokkan dengan daftar di bagian atas file (`gambar`, `video`, `presentasi`, `tulisan`, `dokumen`, `multi`).
- `multi` — isi `true` kalau AI ini bisa lebih dari satu kemampuan (akan tampil dengan label "Multi-fungsi" dan diprioritaskan muncul duluan).
- `pricing` — salah satu dari: `gratis`, `freemium`, `berbayar`.
- `affiliate_url` — isi link afiliasi di sini kalau ada program afiliasi untuk tool tersebut; kalau `null`, tombol akan mengarah ke `url` biasa.
- Jangan lupa update field `"updated"` di bagian paling atas file setiap kali selesai update, supaya tanggal di footer situs ikut berubah.

Untuk menambah kategori baru, tambahkan objek baru di array `"categories"` di bagian atas `tools.json` (butuh `id`, `label`, `hint`).

## Ide pengembangan lanjutan

- Tambah pencatatan klik per tool (misalnya lewat Google Analytics event) untuk tahu tool mana yang paling sering dipilih — datanya berguna untuk evaluasi maupun untuk bahan negosiasi sponsor/afiliasi ke depannya.
- Tambah field `"popularitas"` atau jumlah klik di `tools.json` kalau nanti mau urutkan otomatis berdasarkan yang paling laku.
- Tambah versi "quiz" singkat (2-3 pertanyaan) sebelum menampilkan kategori, untuk user yang benar-benar belum tahu mau mulai dari mana.
