# 🛒 Order Management System (Toko Online & Kasir)

Halo! Selamat datang di repositori **Order Management System**. Proyek ini adalah aplikasi *fullstack* toko online yang mencakup manajemen inventaris produk, buku pelanggan, pencatatan transaksi kasir secara *real-time* dengan validasi stok atomik, riwayat pesanan dengan filter tanggal, serta dashboard eksekutif untuk memantau omzet penjualan toko.

---

## 💡 Kenapa Memilih Tech Stack Ini?

Untuk pemilihan teknologi, fokus utamanya adalah efisiensi, performa yang lincah, dan kemudahan saat *maintenance* tanpa perlu *overhead* berlebih:

* **Backend: Express.js (dibanding NestJS / Laravel)**  
  Express dipilih karena ringan, fleksibel, dan *to the point*. Kita bisa mengontrol alur *middleware* (seperti autentikasi JWT dan penanganan error) secara transparan tanpa harus terbebani struktur *boilerplate* atau *opinionated architecture* yang berat seperti di NestJS atau ekosistem PHP Laravel.
* **ORM: Prisma ORM (dibanding Drizzle / TypeORM)**  
  Prisma punya *type safety* yang sangat solid langsung dari skema database ke TypeScript. Selain itu, fitur migrasinya rapi dan API transaksi interaktifnya (`prisma.$transaction`) sangat bisa diandalkan untuk urusan *atomic rollback* stok barang.
* **Database: PostgreSQL (dibanding MySQL / MongoDB)**  
  Karena aplikasi ini mengelola transaksi keuangan dan inventaris toko, kepatuhan ACID (*Atomicity, Consistency, Isolation, Durability*) adalah hal wajib. PostgreSQL punya integritas relasi yang sangat kuat dan performa agregasi data yang cepat untuk kalkulasi laporan penjualan.
* **Frontend: Vue 3 + Vite + Vuetify 3 (dibanding React / Next.js / Nuxt)**  
  Vue 3 Composition API menawarkan cara penulisan kode yang bersih, reaktif, dan mudah dipahami tanpa masalah *unnecessary re-renders* yang sering ditemui pada React. Dikombinasikan dengan Vite untuk build yang super ngebut, serta Vuetify 3 yang sudah menyediakan komponen enterprise siap pakai seperti *data table* server-side dan *date range picker*. Karena ini adalah aplikasi kasir internal yang bersifat *private* (butuh login), arsitektur SPA murni jauh lebih pas dan efisien dibanding SSR (Next.js/Nuxt).

---

## 🚀 Cara Menjalankan Aplikasi

Kamu bisa menjalankan aplikasi ini dengan dua cara mudah berikut:

### Opsi A: Cara Paling Praktis — Pakai Docker Compose
Kalau di komputermu sudah terpasang Docker dan Docker Compose, kamu tinggal jalankan perintah ini di root folder:

```bash
docker compose up --build
```

Perintah di atas akan otomatis mengurus semuanya untukmu:
1. Menyiapkan database PostgreSQL dan healthcheck.
2. Menjalankan backend: otomatis menjalankan migrasi skema Prisma, mengisi data *seed*, dan menyalakan server di port `3000`.
3. Menjalankan frontend: menyajikan aplikasi web lewat Nginx di port `80` (dan port `5173`) lengkap dengan *proxy* `/api` ke backend.

* 🌐 **Aplikasi Web**: Buka di peramban [http://localhost](http://localhost) atau [http://localhost:5173](http://localhost:5173)
* 📖 **Swagger API Docs**: Buka di [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

### Opsi B: Jalankan Lokal via PNPM Workspace
Kalau lebih suka menjalankan langsung di mesin lokal, pastikan sudah terpasang Node.js (>= 20), PNPM (>= 9), dan PostgreSQL lokal yang aktif. Cukup ikuti 6 langkah ini:

```bash
# 1. Salin template konfigurasi environment
cp backend/.env.example backend/.env && cp frontend/.env.example frontend/.env

# 2. Pasang semua dependensi workspace dari root
pnpm install

# 3. Jalankan migrasi database
pnpm db:migrate

# 4. Masukkan data awal demo (Admin, 20 Produk, 15 Pelanggan, 30 Transaksi)
pnpm db:seed

# 5. Jalankan backend dan frontend bersamaan dari root
pnpm dev
```

### 🔑 Akun Login Demo (Data Seeder):
* **Email**: `admin@admin.com`
* **Password**: `admin123`

---

## 🧠 Gimana Logika Transaksi & Stok Bekerja?

1. **Transaksi Kasir Atomik & Rollback Total (`prisma.$transaction`)**:  
   Semua proses *checkout* pesanan dibungkus dalam satu transaksi atomik. Sebelum memotong stok barang, sistem akan memeriksa ketersediaan stok untuk semua item sekaligus. Kalau ada **satu saja item** yang stoknya kurang, transaksi langsung dibatalkan total (*rollback*). Jadi tidak akan ada kasus stok kepotong sebagian!
2. **Format Error Spesifik Dot-Notation**:  
   Saat stok tidak mencukupi, server mengirimkan respons error `422 Unprocessable Entity` dengan format *dot-notation* yang rapi. Pesan error ini langsung dikaitkan ke baris tabel item yang bermasalah di layar kasir:
   ```json
   {
     "success": false,
     "message": "Stok tidak mencukupi",
     "errors": {
       "items.1.quantity": ["Stok Apple iPad Air tersisa 18, diminta 20"]
     }
   }
   ```
3. **Snapshot Harga Historis (*Price Snapshotting*)**:  
   Harga satuan (`unit_price`) setiap barang diambil langsung dari data produk di database pada saat transaksi dibuat, bukan mengandalkan input dari client. Dengan begini, client tidak bisa memanipulasi harga, dan histori laporan keuangan masa lalu tetap valid meskipun harga produk dinaikkan di kemudian hari.
4. **Dashboard Eksekutif & Riwayat dengan Filter Tanggal**:  
   Grafik tren penjualan 7 hari terakhir, daftar 5 produk terlaris, dan peringatan stok menipis ($< 5$) dihitung secara dinamis dari query agregasi database. Halaman riwayat juga dilengkapi filter rentang tanggal (`v-date-input`), pencarian teks, dan filter nama pelanggan.

---

## 🧪 Pengujian Otomatis (Automated Testing)

Aplikasi ini sudah dilengkapi dengan **121 automated tests** yang semuanya lulus uji (*green*):
* **Backend**: **78 tests** (Autentikasi JWT & refresh token, CRUD produk & soft delete, CRUD pelanggan, transaksi atomik kasir & error handling, kalkulasi analitik dashboard).
* **Frontend**: **43 tests** (Halaman login, katalog produk, buku pelanggan, form kasir interaktif & penanganan error stok, riwayat pesanan & filter tanggal, dashboard eksekutif).

Kamu bisa menjalankan test suite langsung dari *root directory*:
```bash
# Menjalankan seluruh pengujian otomatis (Backend + Frontend)
pnpm test

# Menjalankan pengujian backend saja
pnpm test:backend

# Menjalankan pengujian frontend saja
pnpm test:frontend
```

---

## 📚 Dokumentasi API (Swagger OpenAPI)

Dokumentasi interaktif OpenAPI 3.0 sudah disiapkan dan bisa dicoba langsung di browser:
* 🔗 [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Dokumentasi ini mencakup seluruh rute, skema payload, dan otentikasi Bearer Token:
* `/api/auth` (Login, Refresh Token, Profile, Logout)
* `/api/products` (Katalog, Pencarian, Multi-sort, Detail, Tambah, Edit, Soft Delete)
* `/api/customers` (Buku Pelanggan, Pencarian, Multi-sort, Detail, Tambah, Edit, Hapus)
* `/api/orders` (Riwayat Transaksi + Filter Tanggal, Detail Order + Snapshot Harga, Kasir Checkout Atomik)
* `/api/dashboard/summary` (KPI Ringkasan, Grafik Penjualan Harian, 5 Produk Terlaris, Peringatan Stok Kritis)

---

## 🤝 Catatan Transparansi Penggunaan AI (AI Usage Transparency)

Dalam proses pengerjaan proyek teknikal ini, *tools* AI (Google Antigravity / Gemini) digunakan secara terbuka dan beretika sebagai rekan *pair programming*:
* **Alat yang Digunakan**: Google Antigravity / Gemini.
* **Peran & Manfaat**:
  * Membantu pembuatan *scaffolding* awal (konfigurasi TypeScript, skema OpenAPI, struktur folder).
  * Membantu menyusun skenario *automated test* (Vitest, Supertest, Vue Test Utils) agar cakupan pengujian menyeluruh.
  * Membantu *brainstorming* dan *fine-tuning* styling antarmuka (SCSS responsif, grafik penjualan, dan penataan komponen Anti-Slop UI).
  * Seluruh arsitektur basis data, logika transaksi atomik, dan aturan bisnis tetap dipahami, dirancang, serta divalidasi langsung oleh pengembang agar sesuai dengan ketentuan teknikal.

---

Semoga dokumentasi ini membantu untuk mengeksplorasi dan mencoba aplikasinya. Selamat mencoba! 🚀
