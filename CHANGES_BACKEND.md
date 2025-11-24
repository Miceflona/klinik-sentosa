# 🟢 Perubahan Backend - Klinik Sentosa

Dokumentasi lengkap semua perubahan yang dilakukan pada bagian backend.

---

## 📁 File yang Dibuat Baru

### 1. `backend/.env`
**Status:** ✨ DIBUAT BARU  
**Tanggal:** 24 November 2025  
**Alasan:** File tidak ada, menyebabkan backend tidak bisa membaca konfigurasi database.

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

**Catatan Penting:**
- ⚠️ User harus mengubah `DB_PASS` sesuai password PostgreSQL mereka
- ⚠️ Jangan commit file ini ke repository (harus di `.gitignore`)

**Dampak:**
- Backend sekarang bisa membaca konfigurasi database
- Server bisa start dengan konfigurasi yang benar

---

## 📝 File yang Diperbaiki

### 2. `backend/server.js`
**Status:** 🔄 DIPERBAIKI BESAR-BESARAN  
**Masalah:** 
- Tidak ada test database connection
- Error handling kurang informatif
- Server crash tanpa informasi yang jelas

**Perubahan:**

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
    console.error('\n❌ Database connection error:');
    console.error('Error:', err.message);
    console.error('Error Code:', err.original?.code || 'N/A');
    console.error('\n💡 Checklist:');
    console.error('1. Pastikan PostgreSQL sudah running');
    console.error('2. Pastikan database "klinik_sentosa" sudah dibuat');
    console.error('3. Periksa file backend/.env dengan konfigurasi berikut:');
    console.error(`   DB_HOST=${process.env.DB_HOST || 'NOT SET'}`);
    console.error(`   DB_PORT=${process.env.DB_PORT || 'NOT SET'}`);
    console.error(`   DB_USER=${process.env.DB_USER || 'NOT SET'}`);
    console.error(`   DB_PASS=${process.env.DB_PASS ? '***' : 'NOT SET'}`);
    console.error(`   DB_NAME=${process.env.DB_NAME || 'NOT SET'}`);
    
    // Error-specific solutions
    if (err.original?.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Connection refused - PostgreSQL mungkin tidak running');
      console.error('   Windows: Buka Services dan start PostgreSQL service');
    } else if (err.original?.code === '3D000') {
      console.error('\n⚠️  Database tidak ditemukan');
      console.error('   Jalankan: psql -U postgres -c "CREATE DATABASE klinik_sentosa;"');
    } else if (err.original?.code === '28P01') {
      console.error('\n⚠️  Password authentication failed');
      console.error('   Periksa DB_PASS di file .env');
    }
    
    console.error('\n📝 Untuk membuat database, jalankan:');
    console.error('   psql -U postgres -c "CREATE DATABASE klinik_sentosa;"');
    console.error('\n📝 Untuk menjalankan schema, jalankan:');
    console.error('   psql -U postgres -d klinik_sentosa -f database/schema.sql');
    console.error('\n');
    process.exit(1);
  });
```

**Fitur Baru:**
1. ✅ Test database connection sebelum start server
2. ✅ Error message yang sangat informatif
3. ✅ Menampilkan nilai environment variables (password di-mask)
4. ✅ Error-specific solutions berdasarkan error code
5. ✅ Checklist lengkap untuk troubleshooting
6. ✅ Instruksi untuk membuat database dan menjalankan schema

**Dampak:**
- Server tidak akan start jika database tidak terkoneksi
- Developer mendapat informasi jelas tentang masalah yang terjadi
- Memudahkan troubleshooting

---

### 3. `backend/src/config/db.js`
**Status:** 🔄 DIPERBAIKI  
**Masalah:** 
- Tidak ada validasi environment variables
- Error handling kurang baik
- Tidak ada connection pool

**Perubahan:**

**Sebelum:**
```javascript
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

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

export default sequelize;
```

**Sesudah:**
```javascript
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

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

export default sequelize;
```

**Fitur Baru:**
1. ✅ Validasi environment variables saat startup
2. ✅ Default values untuk host dan port
3. ✅ Connection pool untuk performa lebih baik
4. ✅ Error message yang jelas jika konfigurasi tidak lengkap

**Dampak:**
- Error terdeteksi lebih awal (sebelum koneksi)
- Performa lebih baik dengan connection pool
- Konfigurasi lebih robust

---

### 4. `backend/src/controllers/auth.controller.js`
**Status:** 🔄 DIPERBAIKI  
**Masalah:** 
- Error handling kurang informatif
- Tidak ada validasi input
- Tidak ada pengecekan konfigurasi

**Perubahan pada fungsi `login`:**

**Sebelum:**
```javascript
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Email atau password salah.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Email atau password salah.' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.json({
      message: 'Login berhasil.',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
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
    if (!user) return res.status(401).json({ error: 'Email atau password salah.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Email atau password salah.' });

    // Pengecekan konfigurasi JWT
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET tidak ditemukan di environment variables');
      return res.status(500).json({ error: 'Konfigurasi server tidak lengkap.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    res.json({
      message: 'Login berhasil.',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ 
      error: err.message || 'Terjadi kesalahan saat login.',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};
```

**Fitur Baru:**
1. ✅ Validasi input (email dan password harus diisi)
2. ✅ Pengecekan konfigurasi JWT_SECRET
3. ✅ Error logging untuk debugging
4. ✅ Error details di development mode
5. ✅ Default value untuk JWT_EXPIRES_IN

**Dampak:**
- Error handling lebih baik
- Lebih mudah debugging
- Validasi input mencegah error yang tidak perlu

---

## 📊 Ringkasan Perubahan Backend

| Kategori | Jumlah |
|----------|--------|
| File Dibuat Baru | 1 |
| File Diperbaiki | 3 |

---

## ✅ Hasil Akhir

Setelah semua perubahan:
- ✅ Backend bisa membaca konfigurasi dari `.env`
- ✅ Database connection di-test sebelum start server
- ✅ Error handling sangat informatif
- ✅ Validasi konfigurasi lebih baik
- ✅ Login endpoint lebih robust

---

## 🔄 Cara Menggunakan Perubahan

1. **Edit file `.env`:**
   ```bash
   cd backend
   # Edit .env dan sesuaikan DB_PASS dengan password PostgreSQL Anda
   ```

2. **Restart backend server:**
   ```bash
   npm run dev
   ```

3. **Pastikan database sudah dibuat:**
   ```bash
   psql -U postgres -c "CREATE DATABASE klinik_sentosa;"
   ```

4. **Jalankan schema:**
   ```bash
   psql -U postgres -d klinik_sentosa -f database/schema.sql
   ```

---

## 🐛 Troubleshooting

Jika masih ada error, cek:
1. ✅ File `.env` sudah ada dan konfigurasi benar
2. ✅ PostgreSQL service berjalan
3. ✅ Database `klinik_sentosa` sudah dibuat
4. ✅ Schema sudah dijalankan
5. ✅ Password di `.env` sesuai dengan PostgreSQL

Error message di console sekarang sangat informatif dan akan memberikan solusi spesifik!

---

**Dokumentasi dibuat:** 24 November 2025

