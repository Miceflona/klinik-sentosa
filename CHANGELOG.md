# 📝 Changelog - Perubahan pada Project Klinik Sentosa

Dokumentasi lengkap semua perubahan yang dilakukan untuk memperbaiki dan menyempurnakan project.

---

## 🗓️ Tanggal: 24 November 2025

### 🔧 Perbaikan Frontend

#### 1. **File: `frontend/index.html`** ✨ DIBUAT BARU
**Masalah:** File `index.html` tidak ada, menyebabkan error 404 saat akses frontend.

**Perubahan:**
- Membuat file `index.html` baru di folder `frontend/`
- Menambahkan struktur HTML dasar dengan React root
- Mengimpor `main.jsx` sebagai entry point

**File yang dibuat:**
```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Klinik Sentosa</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

#### 2. **File: `frontend/src/App.jsx`** 🔄 DIPERBAIKI
**Masalah:** Import path salah untuk `PrescriptionList.jsx` (menggunakan `pharmacist` padahal folder `pharmacy`).

**Perubahan:**
- Line 11: Mengubah import dari `./pages/pharmacist/PrescriptionList.jsx` 
- Menjadi: `./pages/pharmacy/PrescriptionList.jsx`

**Sebelum:**
```javascript
import PharmacistPrescriptions from './pages/pharmacist/PrescriptionList.jsx';
```

**Sesudah:**
```javascript
import PharmacistPrescriptions from './pages/pharmacy/PrescriptionList.jsx';
```

---

#### 3. **File: `frontend/src/components/RoleGuard.jsx`** 🔄 DIPERBAIKI
**Masalah:** 
- Import menggunakan ekstensi `.js` padahal file `.jsx`
- Import dari `hooks/useAuth.jsx` padahal seharusnya dari `contexts/AuthContext.jsx`

**Perubahan:**
- Line 3: Mengubah import dari `../hooks/useAuth.js` menjadi `../contexts/AuthContext.jsx`

**Sebelum:**
```javascript
import { useAuth } from '../hooks/useAuth.js';
```

**Sesudah:**
```javascript
import { useAuth } from '../contexts/AuthContext.jsx';
```

---

#### 4. **File: `frontend/src/contexts/AuthContext.jsx`** 🔄 DIPERBAIKI
**Masalah:** `AuthContext` tidak diekspor, menyebabkan error saat diimport di `useAuth.jsx`.

**Perubahan:**
- Line 5: Menambahkan `export` pada deklarasi `AuthContext`

**Sebelum:**
```javascript
const AuthContext = createContext();
```

**Sesudah:**
```javascript
export const AuthContext = createContext();
```

---

#### 5. **File: `frontend/src/pages/patient/Profile.jsx`** 🔄 DIPERBAIKI
**Masalah:** Import `useAuth` dari path yang salah.

**Perubahan:**
- Line 3: Mengubah import dari `../../hooks/useAuth.js` menjadi `../../contexts/AuthContext.jsx`

**Sebelum:**
```javascript
import { useAuth } from '../../hooks/useAuth.js';
```

**Sesudah:**
```javascript
import { useAuth } from '../../contexts/AuthContext.jsx';
```

---

#### 6. **File: `frontend/package.json`** ➕ DEPENDENCIES DITAMBAHKAN
**Masalah:** Tailwind CSS belum terinstall, menyebabkan styling tidak berfungsi.

**Perubahan:**
- Menambahkan devDependencies:
  - `tailwindcss@^4.1.17`
  - `postcss@^8.5.6`
  - `autoprefixer@^10.4.22`
  - `@tailwindcss/vite@^1.0.0`
  - `@tailwindcss/postcss@^4.1.17`

**Command yang dijalankan:**
```bash
npm install -D tailwindcss postcss autoprefixer @tailwindcss/vite @tailwindcss/postcss
```

---

#### 7. **File: `frontend/vite.config.js`** 🔄 DIPERBAIKI
**Masalah:** Tailwind CSS v4 memerlukan plugin Vite khusus.

**Perubahan:**
- Menambahkan import `@tailwindcss/vite`
- Menambahkan plugin Tailwind ke konfigurasi Vite

**Sebelum:**
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // ...
});
```

**Sesudah:**
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // ...
});
```

---

#### 8. **File: `frontend/src/index.css`** 🔄 DIPERBAIKI
**Masalah:** Sintaks Tailwind CSS v3 tidak kompatibel dengan v4.

**Perubahan:**
- Mengubah dari `@tailwind` directives ke `@import "tailwindcss"`
- Menambahkan `@theme` untuk custom colors

**Sebelum:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Sesudah:**
```css
@import "tailwindcss";

@theme {
  --color-primary: #1e40af;
  --color-secondary: #0ea5e9;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
}
```

---

#### 9. **File: `frontend/postcss.config.js`** ❌ DIHAPUS
**Masalah:** File tidak diperlukan karena menggunakan plugin Vite untuk Tailwind v4.

**Perubahan:**
- File dihapus karena Tailwind v4 menggunakan plugin Vite, bukan PostCSS

---

#### 10. **File: `frontend/.env`** 🔄 DIPERBAIKI
**Masalah:** Port API salah (5001 padahal backend di 5000).

**Perubahan:**
- Mengubah `VITE_API_BASE` dari `http://localhost:5001/api` menjadi `http://localhost:5000/api`

**Sebelum:**
```env
VITE_API_BASE=http://localhost:5001/api
```

**Sesudah:**
```env
VITE_API_BASE=http://localhost:5000/api
```

---

### 🔧 Perbaikan Backend

#### 11. **File: `backend/.env`** ✨ DIBUAT BARU
**Masalah:** File `.env` tidak ada, menyebabkan backend tidak bisa membaca konfigurasi database.

**Perubahan:**
- Membuat file `.env` baru dengan konfigurasi lengkap

**Isi file:**
```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=klinik_sentosa

# JWT Configuration
JWT_SECRET=klinik_sentosa_super_secret_2025
JWT_EXPIRES_IN=7d
```

**Catatan:** User harus mengubah `DB_PASS` sesuai password PostgreSQL mereka.

---

#### 12. **File: `backend/server.js`** 🔄 DIPERBAIKI
**Masalah:** 
- Tidak ada test database connection
- Error handling kurang informatif

**Perubahan:**
- Menambahkan import `sequelize` dari config
- Menambahkan test database connection sebelum start server
- Memperbaiki error handling dengan informasi lebih detail

**Sebelum:**
```javascript
import app from './src/app.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
```

**Sesudah:**
```javascript
import app from './src/app.js';
import dotenv from 'dotenv';
import sequelize from './src/config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected.');
    app.listen(PORT, () => {
      console.log(`✅ Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    // Error handling dengan informasi detail
    // ...
    process.exit(1);
  });
```

**Fitur baru:**
- Test koneksi database sebelum start server
- Error message yang lebih informatif
- Checklist dan solusi berdasarkan jenis error
- Menampilkan nilai environment variables (password di-mask)

---

#### 13. **File: `backend/src/config/db.js`** 🔄 DIPERBAIKI
**Masalah:** 
- Tidak ada validasi environment variables
- Error handling kurang baik

**Perubahan:**
- Menambahkan validasi environment variables
- Menambahkan connection pool configuration
- Memperbaiki format kode

**Sebelum:**
```javascript
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  }
);
```

**Sesudah:**
```javascript
// Validate environment variables
if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASS) {
  console.error('❌ Database configuration missing in .env file!');
  console.error('Required: DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT');
  process.exit(1);
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);
```

**Fitur baru:**
- Validasi environment variables saat startup
- Connection pool untuk performa lebih baik
- Default values untuk host dan port

---

#### 14. **File: `backend/src/controllers/auth.controller.js`** 🔄 DIPERBAIKI
**Masalah:** Error handling kurang informatif, tidak ada validasi input.

**Perubahan:**
- Menambahkan validasi input (email dan password harus diisi)
- Memperbaiki error handling dengan informasi lebih detail
- Menambahkan pengecekan JWT_SECRET

**Sebelum:**
```javascript
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    // ...
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

**Sesudah:**
```javascript
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password harus diisi.' });
    }

    const user = await User.findOne({ where: { email } });
    // ...

    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET tidak ditemukan di environment variables');
      return res.status(500).json({ error: 'Konfigurasi server tidak lengkap.' });
    }

    // ...
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ 
      error: err.message || 'Terjadi kesalahan saat login.',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};
```

**Fitur baru:**
- Validasi input
- Error logging untuk debugging
- Pengecekan konfigurasi JWT_SECRET
- Error details di development mode

---

### 🗄️ Perbaikan Database

#### 15. **File: `database/schema.sql`** 🔄 DIPERBAIKI BESAR-BESARAN
**Masalah:** 
- Schema tidak lengkap (hanya 4 tabel)
- Format timestamp tidak kompatibel dengan Sequelize
- Tidak ada indexes
- Tidak ada DROP TABLE statements

**Perubahan:**

**Tabel yang ditambahkan:**
- `medicines` (baru)
- `medical_records` (baru)
- `prescriptions` (baru)
- `prescription_items` (baru)
- `transactions` (baru)

**Tabel yang diperbaiki:**
- `users` - menambahkan `"createdAt"` dan `"updatedAt"`
- `patients` - menambahkan kolom lengkap dan timestamps
- `staff` - menambahkan kolom lengkap dan timestamps
- `queues` - menambahkan timestamps

**Format timestamp:**
- **Sebelum:** `created_at TIMESTAMPTZ` (snake_case)
- **Sesudah:** `"createdAt" TIMESTAMPTZ` dan `"updatedAt" TIMESTAMPTZ` (camelCase dengan quotes)

**Fitur baru:**
- DROP TABLE statements untuk fresh install
- Indexes untuk performa:
  - `idx_users_email`
  - `idx_queues_status`
  - `idx_queues_patient_id`
  - `idx_medical_records_patient_id`
  - `idx_medical_records_doctor_id`
  - `idx_prescriptions_status`
  - `idx_transactions_patient_id`
- Foreign keys dengan ON DELETE CASCADE/SET NULL
- CHECK constraints untuk enum values

**Struktur lengkap:**
```sql
-- 9 tabel lengkap
users
patients
staff
medicines
queues
medical_records
prescriptions
prescription_items
transactions
```

---

#### 16. **File: `database/SETUP_DATABASE.md`** ✨ DIBUAT BARU
**Masalah:** Tidak ada dokumentasi lengkap untuk setup database.

**Perubahan:**
- Membuat file dokumentasi lengkap untuk setup database
- Menambahkan langkah-langkah setup
- Menambahkan troubleshooting guide
- Menambahkan test accounts
- Menambahkan checklist

**Isi dokumentasi:**
- Langkah setup PostgreSQL
- Cara membuat database
- Cara menjalankan schema
- Cara menjalankan seeds
- Verifikasi database
- Troubleshooting common errors
- Checklist setup

---

## 📊 Ringkasan Perubahan

### File yang Dibuat Baru (3):
1. `frontend/index.html`
2. `backend/.env`
3. `database/SETUP_DATABASE.md`

### File yang Dihapus (1):
1. `frontend/postcss.config.js`

### File yang Diperbaiki (13):
1. `frontend/src/App.jsx`
2. `frontend/src/components/RoleGuard.jsx`
3. `frontend/src/contexts/AuthContext.jsx`
4. `frontend/src/pages/patient/Profile.jsx`
5. `frontend/package.json` (dependencies)
6. `frontend/vite.config.js`
7. `frontend/src/index.css`
8. `frontend/.env`
9. `backend/server.js`
10. `backend/src/config/db.js`
11. `backend/src/controllers/auth.controller.js`
12. `database/schema.sql` (perubahan besar)
13. `CHANGELOG.md` (file ini)

### Dependencies yang Ditambahkan:
- `tailwindcss@^4.1.17`
- `postcss@^8.5.6`
- `autoprefixer@^10.4.22`
- `@tailwindcss/vite@^1.0.0`
- `@tailwindcss/postcss@^4.1.17`

---

## ✅ Hasil Akhir

Setelah semua perubahan:
- ✅ Frontend bisa diakses tanpa error 404
- ✅ Tailwind CSS berfungsi dengan baik
- ✅ Import paths sudah benar
- ✅ Backend bisa connect ke database
- ✅ Error handling lebih informatif
- ✅ Database schema lengkap dan siap digunakan
- ✅ Dokumentasi lengkap tersedia

---

## 🔄 Cara Menggunakan Perubahan

1. **Frontend:**
   ```bash
   cd frontend
   npm install  # Install dependencies baru
   npm run dev  # Restart server
   ```

2. **Backend:**
   ```bash
   cd backend
   # Edit .env dan sesuaikan DB_PASS
   npm run dev  # Restart server
   ```

3. **Database:**
   ```bash
   # Buat database
   psql -U postgres -c "CREATE DATABASE klinik_sentosa;"
   
   # Jalankan schema
   psql -U postgres -d klinik_sentosa -f database/schema.sql
   
   # (Opsional) Jalankan seeds
   psql -U postgres -d klinik_sentosa -f database/seeds_sql.sql
   ```

---

**Dokumentasi dibuat:** 24 November 2025  
**Versi:** 1.0.0
