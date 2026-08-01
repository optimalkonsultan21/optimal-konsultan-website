# Optimal Konsultan - Web Application

Website Interaktif dan Ramah Pengguna untuk **Optimal Konsultan** — Konsultan Pajak UMKM, Startup, dan Pengusaha Muda.

---

## ⚡ Panduan Hosting / Deploy di Vercel

Proyek ini telah dikonfigurasi dan **100% Siap untuk Di-host di Vercel**. Ada 2 cara mudah untuk mendeploy website ini:

### Cara 1: Deploy via GitHub (Direkomendasikan)
1. Push repositori ini ke akun GitHub Anda.
2. Buka [Vercel Dashboard](https://vercel.com/dashboard) dan klik **"Add New Project"**.
3. Pilih repositori GitHub `gallant-hypatia` / `optimal-konsultan-website`.
4. Vercel akan secara otomatis mendeteksi proyek ini sebagai **Other / HTML Static Site**.
5. Klik **"Deploy"**. Website Anda akan langsung online dengan domain gratis Vercel (misal: `optimal-konsultan.vercel.app`) dan SSL Certificate (HTTPS) otomatis!

---

### Cara 2: Deploy via Vercel CLI (Lewat Terminal)
Jika Anda memiliki [Vercel CLI](https://vercel.com/cli) terinstal:
1. Buka terminal di folder proyek ini.
2. Jalankan perintah:
   ```bash
   npx vercel
   ```
3. Ikuti petunjuk singkat di layar (Tekan `Enter` untuk opsi default).
4. Untuk mendeploy langsung ke produksi:
   ```bash
   npx vercel --prod
   ```

---

## ⚙️ Konfigurasi Vercel yang Disediakan
- `vercel.json`: Konfigurasi *Clean URLs*, *Security Headers* (`X-Frame-Options`, `X-XSS-Protection`), dan *Asset Caching* otomatis.
- `package.json`: Skrip build statis untuk Vercel.
- `.gitignore`: Mengabaikan folder `.vercel/` dan temporary files.
