# 📋 PANDUAN SETUP LENGKAP

## ✅ Checklist Pre-Installation

- [ ] Node.js v16+ terinstall (`node --version`)
- [ ] npm terinstall (`npm --version`)
- [ ] PostgreSQL v12+ terinstall
- [ ] Git terinstall (opsional)

## 🚀 INSTALLATION & RUNNING

### A. Setup Database PostgreSQL

#### Windows

**1. Install PostgreSQL**
- Download dari: https://www.postgresql.org/download/windows/
- Jalankan installer
- Set password untuk user `postgres` (ingat password ini!)
- Default port: 5432

**2. Buat Database**
- Buka SQL Shell (psql) atau pgAdmin
- Login dengan user `postgres` dan password yang sudah dibuat
- Jalankan command:

```sql
CREATE DATABASE klinik_sentosa;
\c klinik_sentosa

-- Copy isi dari file database/schema.sql dan paste di sini
```

Atau gunakan terminal:
```bash
psql -U postgres -d klinik_sentosa -f database/schema.sql
```

#### macOS / Linux

```bash
# Install PostgreSQL (macOS dengan Homebrew)
brew install postgresql

# Start PostgreSQL service
brew services start postgresql

# Create database
createdb klinik_sentosa

# Apply schema
psql klinik_sentosa < database/schema.sql
```

### B. Setup Backend

**1. Navigate ke folder backend**
```bash
cd backend
```

**2. Install dependencies**
```bash
npm install
```

**3. Create .env file**

Buat file `backend/.env` dengan isi:

```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_postgres_password_here
DB_NAME=klinik_sentosa

# JWT Configuration
JWT_SECRET=klinik_sentosa_super_secret_2025
JWT_EXPIRES_IN=7d
```

**Ganti `your_postgres_password_here` dengan password PostgreSQL Anda**

**4. Run Backend**

Development mode (dengan auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Jika berhasil, Anda akan melihat:
```
✅ Database connected.
🚀 Klinik Sentosa Backend running on http://localhost:5000
```

### C. Setup Frontend

**1. Navigate ke folder frontend** (buka terminal baru)
```bash
cd frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Create .env file**

Buat file `frontend/.env` dengan isi:

```env
VITE_API_BASE=http://localhost:5000/api
```

**4. Run Frontend**

```bash
npm run dev
```

Jika berhasil, browser akan membuka:
```
http://localhost:5174
```

## 🧪 Testing Aplikasi

### Login dengan Account Admin

1. Buka browser: `http://localhost:5174`
2. Click "Demo Account" pada halaman login
3. Gunakan credential:
   - Email: `admin@klinik.com`
   - Password: `admin123`

**CATATAN**: Akun demo harus dibuat terlebih dahulu. Lihat section "Membuat Test Account" di bawah.

### Membuat Test Account (Wajib)

**Opsi 1: Menggunakan psql**

```bash
psql -U postgres -d klinik_sentosa
```

Kemudian paste query berikut:

```sql
-- Insert admin user
INSERT INTO users (name, email, password, phone, address, role, "createdAt", "updatedAt") 
VALUES ('Admin Klinik', 'admin@klinik.com', '$2b$12$abc123...', '081234567890', 'Jl. Admin', 'admin', NOW(), NOW());

-- Insert staff profile
INSERT INTO staff (user_id, "createdAt", "updatedAt") 
VALUES ((SELECT id FROM users WHERE email='admin@klinik.com'), NOW(), NOW());

-- Insert doctor user
INSERT INTO users (name, email, password, phone, address, role, "createdAt", "updatedAt") 
VALUES ('Dr. Budi', 'dokter@klinik.com', '$2b$12$abc123...', '081234567891', 'Jl. Dokter', 'dokter', NOW(), NOW());

INSERT INTO staff (user_id, specialization, "createdAt", "updatedAt") 
VALUES ((SELECT id FROM users WHERE email='dokter@klinik.com'), 'Umum', NOW(), NOW());

-- Similar for receptionist, pharmacist, cashier
-- Copy structure di atas
```

**Opsi 2: Gunakan API (lebih mudah)**

1. Buka Postman atau Thunder Client
2. Gunakan endpoint `POST http://localhost:5000/api/auth/register`
3. Body:
```json
{
  "name": "Admin Klinik",
  "email": "admin@klinik.com",
  "password": "admin123",
  "phone": "081234567890",
  "address": "Jl. Admin",
  "role": "admin"
}
```

Lakukan hal yang sama untuk user lainnya.

## 🔍 Verifikasi Setup

### Backend Health Check

```bash
curl http://localhost:5000/api/auth/login
```

Seharusnya return error (itu normal, tidak ada authorization header):
```json
{
  "error": "Akses ditolak. Token tidak ditemukan."
}
```

### Frontend Check

Buka browser dev tools (F12), tab Network:
1. Buka `http://localhost:5174`
2. Cek apakah ada request ke `http://localhost:5000/api/...`

## 🐛 Troubleshooting

### Error: "connect ECONNREFUSED 127.0.0.1:5432"
**Solusi**: PostgreSQL tidak running
```bash
# Windows
pg_ctl -D "C:\Program Files\PostgreSQL\13\data" start

# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### Error: "database klinik_sentosa does not exist"
```bash
createdb klinik_sentosa
psql klinik_sentosa < database/schema.sql
```

### Error: "EADDRINUSE: address already in use :::5000"
Port 5000 sudah terpakai, ubah di `.env`:
```env
PORT=5001
```

### Error: "ERR_MODULE_NOT_FOUND" atau "Cannot find module"
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules
npm install
```

### Frontend tidak bisa connect ke backend
- Pastikan backend sudah running (`npm run dev` di folder backend)
- Cek file `.env` frontend:
  ```env
  VITE_API_BASE=http://localhost:5000/api
  ```
- Buka console browser (F12) dan cek error messages

### "CORS error" di console browser
Ini seharusnya sudah fixed oleh middleware backend, tapi jika masih terjadi:
- Pastikan backend menggunakan `cors()` middleware (sudah ada di `app.js`)
- Restart backend

## 📱 Akses Aplikasi

### Lokal Network (Testing di perangkat lain)

1. Cari IP address komputer Anda:
```bash
ipconfig  # Windows
ifconfig  # macOS/Linux
```

2. Update `.env` frontend:
```env
VITE_API_BASE=http://YOUR_IP:5000/api
```

3. Akses dari perangkat lain:
```
http://YOUR_IP:5174
```

## 📦 Build untuk Production

### Frontend

```bash
cd frontend
npm run build

# Hasil ada di folder dist/
# Upload ke hosting atau gunakan dengan static server
```

### Backend

Backend siap di-deploy ke server dengan:
```bash
npm install --production
NODE_ENV=production npm start
```

## 🔐 Security Notes

⚠️ **PENTING untuk Production**:

1. Update `.env`:
   ```env
   JWT_SECRET=use-very-long-random-string-here
   NODE_ENV=production
   ```

2. Update database credentials
3. Enable HTTPS/SSL
4. Setup firewall
5. Use environment variables manager (contoh: AWS Secrets Manager)

## ✨ Tips Development

### Auto-reload Backend
Gunakan nodemon (sudah di dev dependencies):
```bash
npm run dev
```

### Debug Backend
```bash
NODE_DEBUG=* npm start
```

### Clear Cache Browser
- Ctrl+Shift+Delete (Windows)
- Cmd+Shift+Delete (macOS)

### View Database
Menggunakan pgAdmin:
1. Buka `http://localhost:5050` (jika sudah install pgAdmin)
2. Register dan connect ke PostgreSQL lokal

Atau gunakan CLI:
```bash
psql -U postgres -d klinik_sentosa
\dt  # Lihat semua tabel
SELECT * FROM users;  # Lihat data users
```

## 📞 Support

Jika ada error atau pertanyaan, check:
1. File `.env` sudah benar
2. PostgreSQL sudah running
3. Ports 5000 dan 5174 tidak terpakai
4. Node.js dan npm version compatible

---

**Happy Coding! 🎉**

Untuk next steps, baca: `README.md`
