# 🏥 Sistem Informasi Manajemen Klinik

Aplikasi web-based untuk manajemen klinik yang modern, efisien, dan user-friendly. Dibangun dengan React + Vite (Frontend) dan Node.js + Express (Backend).

## 🎯 Fitur Utama

### 👤 Manajemen Pasien
- Registrasi dan login pasien
- Profil pasien dengan riwayat medis
- Tracking status antrian real-time
- Riwayat kunjungan dan pemeriksaan

### 📋 Manajemen Antrian
- Resepsionis dapat mendaftar pasien dan membuat antrian
- Sistem nomor antrian otomatis
- Update status antrian (menunggu, dipanggil, selesai)

### 👨‍⚕️ Manajemen Pemeriksaan Dokter
- Dokter melihat antrian pasien yang menunggu
- Buat rekam medis dengan diagnosa
- Keluhan, diagnosa, dan catatan pemeriksaan

### 💊 Manajemen Apotek
- Apoteker melihat resep yang menunggu persetujuan
- Approve/reject resep
- Dispense obat dengan update stok otomatis
- Manajemen stok obat

### 💰 Manajemen Pembayaran
- Kasir melihat pembayaran yang menunggu
- Proses pembayaran dengan berbagai metode
- Riwayat transaksi

### 📊 Dashboard Admin
- Statistik klinik (total pasien, kunjungan, pendapatan)
- Manajemen user (CRUD)
- Manajemen obat (CRUD)
- Laporan kunjungan dan transaksi

## 🛠️ Tech Stack

### Frontend
- React 18.3
- Vite 5.4
- React Router DOM 6
- Axios
- Tailwind CSS (dari package.json)

### Backend
- Node.js + Express 4.19
- PostgreSQL 12+
- Sequelize ORM 6.37
- JWT Authentication
- Bcrypt untuk hashing password
- CORS & Dotenv

## 📦 Instalasi dan Setup

### Prasyarat
- Node.js v16 atau lebih tinggi
- PostgreSQL v12 atau lebih tinggi
- npm atau yarn

### Step 1: Setup Database

```bash
# Buat database PostgreSQL
createdb klinik_sentosa

# Login ke PostgreSQL
psql -U postgres -d klinik_sentosa

# Jalankan schema (gunakan sql dari database/schema.sql)
\i database/schema.sql

# Jalankan seeder (opsional, untuk data demo)
\i database/seeds.sql
```

### Step 2: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Buat file .env
# Isi dengan konfigurasi database Anda:
# PORT=5000
# NODE_ENV=development
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASS=yourpassword
# DB_NAME=klinik_sentosa
# JWT_SECRET=klinik_sentosa_super_secret_2025
# JWT_EXPIRES_IN=7d

# Jalankan server
npm start
# atau dengan nodemon untuk development:
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

### Step 3: Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Frontend akan membuka di `http://localhost:5174`

## 🔐 Test Account

Untuk testing, gunakan akun demo berikut:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@klinik.com | admin123 |
| Dokter | dokter@klinik.com | dokter123 |
| Resepsionis | resepsionis@klinik.com | resepsionis123 |
| Apoteker | apoteker@klinik.com | apoteker123 |
| Kasir | kasir@klinik.com | kasir123 |
| Pasien | pasien@klinik.com | pasien123 |

**Note:** Akun test harus dibuat manual melalui seeder atau admin panel. Jalankan seeder dengan:
```bash
psql -U postgres -d klinik_sentosa -f database/seeds.sql
```

## 📝 Struktur Project

```
backend/
├── src/
│   ├── app.js              # Express app setup
│   ├── config/
│   │   └── db.js           # Database configuration
│   ├── controllers/        # Business logic
│   ├── models/            # Database models (Sequelize)
│   ├── routes/            # API routes
│   ├── middleware/        # Auth & RBAC middleware
│   └── utils/             # Utility functions
├── server.js              # Entry point
├── package.json
└── .env                   # Environment variables

frontend/
├── src/
│   ├── pages/             # Route pages per role
│   ├── components/        # Reusable components
│   ├── contexts/          # React Context (Auth)
│   ├── hooks/             # Custom hooks
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   └── App.jsx            # Main component
├── index.html
├── vite.config.js
├── package.json
└── .env                   # Environment variables

database/
├── schema.sql             # Database schema
└── seeds.sql              # Demo data
```

## 🔗 API Endpoints

### Auth
- `POST /api/auth/register` - Register pasien baru
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout

### Pasien
- `GET /api/patients/me` - Get profil pasien
- `PUT /api/patients/me` - Update profil pasien
- `GET /api/patients/me/visits` - Get riwayat kunjungan
- `GET /api/patients/me/queue` - Get status antrian

### Resepsionis
- `POST /api/receptionist/queue` - Buat antrian baru
- `GET /api/receptionist/queues/today` - Get antrian hari ini
- `PATCH /api/receptionist/queue/:id` - Update status antrian
- `POST /api/receptionist/patients` - Register pasien baru
- `GET /api/receptionist/patients` - List semua pasien

### Dokter
- `GET /api/doctor/queue` - Get antrian pasien
- `POST /api/doctor/records` - Buat rekam medis
- `PATCH /api/doctor/records/:id/complete` - Selesaikan pemeriksaan

### Apoteker
- `GET /api/pharmacist/prescriptions` - Get daftar resep
- `PATCH /api/pharmacist/prescriptions/:id/approve` - Setujui resep
- `PATCH /api/pharmacist/prescriptions/:id/reject` - Tolak resep
- `POST /api/pharmacist/prescriptions/:id/dispense` - Berikan obat
- `GET/POST/PUT/DELETE /api/pharmacist/medicines` - Manage obat

### Kasir
- `GET /api/cashier/pending` - Get pembayaran menunggu
- `POST /api/cashier/transactions` - Proses pembayaran
- `GET /api/cashier/transactions` - Get riwayat transaksi

### Admin
- `GET /api/admin/dashboard` - Get statistik
- `GET/POST/PUT/DELETE /api/admin/users` - Manage user
- `GET/POST/PUT/DELETE /api/admin/medicines` - Manage obat

### Reports
- `GET /api/reports/dashboard` - Get report dashboard
- `GET /api/reports/visits` - Get laporan kunjungan
- `GET /api/reports/transactions` - Get laporan transaksi
- `GET /api/reports/medicine-usage` - Get laporan penggunaan obat

## 🧪 Workflow Lengkap (Demo Alur)

### 1. Pasien Mendaftar dan Login
```
Register → Email Verification → Login → Masuk Dashboard
```

### 2. Pasien Membuat Antrian
```
Receptionist Add Queue → Pasien Dapat No Antrian → Status: Menunggu
```

### 3. Dokter Melayani Pasien
```
Dokter Lihat Queue → Panggil Pasien → Pemeriksaan → Input Diagnosa & Resep
```

### 4. Apoteker Proses Resep
```
Apoteker Lihat Resep → Review → Approve → Dispense Obat (Update Stok)
```

### 5. Kasir Proses Pembayaran
```
Kasir Lihat Pembayaran Menunggu → Input Metode Pembayaran → Konfirmasi → Transaksi Selesai
```

## 🐛 Troubleshooting

### Backend tidak bisa connect ke database
- Pastikan PostgreSQL sudah running
- Cek konfigurasi .env di folder backend
- Pastikan database `klinik_sentosa` sudah dibuat
- Pastikan username dan password PostgreSQL benar

### Frontend error "Module not found"
- Jalankan `npm install` di folder frontend
- Hapus folder `node_modules` dan `.yarn` lalu install ulang
- Pastikan file `.env` sudah ada di folder frontend

### CORS error
- Backend sudah di-configure dengan `cors()` middleware
- Pastikan frontend URL benar di `.env.local` frontend
- Default: `VITE_API_BASE=http://localhost:5000/api`

### Port sudah terpakai
- Backend default port 5000, ubah di `.env`
- Frontend default port 5174, ubah di `vite.config.js`

## 📚 Dokumentasi Lebih Lanjut

Untuk dokumentasi API lengkap, buka:
- [API Documentation](./API.md)
- [Database Schema](./DATABASE.md)
- [Architecture Guide](./ARCHITECTURE.md)

## 🤝 Kontribusi

Untuk berkontribusi, silakan fork repository ini dan buat pull request dengan deskripsi yang jelas.

## 📄 Lisensi

Proyek ini dilisensikan di bawah MIT License.

## 👨‍💼 Support

Untuk pertanyaan atau bantuan, silakan buat issue di repository ini.

---

**Dibuat dengan ❤️ untuk Klinik Sentosa**  
Last Updated: November 2025
