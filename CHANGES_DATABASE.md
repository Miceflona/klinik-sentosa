# 🗄️ Perubahan Database - Klinik Sentosa

Dokumentasi lengkap semua perubahan yang dilakukan pada bagian database.

---

## 📝 File yang Diperbaiki

### 1. `database/schema.sql`
**Status:** 🔄 DIPERBAIKI BESAR-BESARAN  
**Tanggal:** 24 November 2025  
**Alasan:** 
- Schema tidak lengkap (hanya 4 tabel)
- Format timestamp tidak kompatibel dengan Sequelize
- Tidak ada indexes untuk performa
- Tidak ada DROP TABLE statements

---

## 🔄 Perubahan Detail

### Tabel yang Ditambahkan (5 tabel baru):

#### 1. `medicines` ✨ BARU
```sql
CREATE TABLE medicines (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  dosage VARCHAR(50),
  stock INTEGER DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  min_stock INTEGER DEFAULT 10,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);
```

**Alasan:** Tabel ini diperlukan untuk manajemen obat di apotek.

---

#### 2. `medical_records` ✨ BARU
```sql
CREATE TABLE medical_records (
  id SERIAL PRIMARY KEY,
  patient_id INT NOT NULL REFERENCES patients(user_id) ON DELETE CASCADE,
  doctor_id INT REFERENCES staff(user_id) ON DELETE SET NULL,
  queue_id INT REFERENCES queues(id) ON DELETE SET NULL,
  complaint TEXT,
  diagnosis TEXT,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'menunggu' CHECK (status IN ('menunggu','selesai')),
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);
```

**Alasan:** Tabel ini diperlukan untuk menyimpan rekam medis pasien.

---

#### 3. `prescriptions` ✨ BARU
```sql
CREATE TABLE prescriptions (
  id SERIAL PRIMARY KEY,
  medical_record_id INT NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
  pharmacist_id INT REFERENCES staff(user_id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'menunggu' CHECK (status IN ('menunggu','disetujui','ditolak','diberikan')),
  notes TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);
```

**Alasan:** Tabel ini diperlukan untuk menyimpan resep obat dari dokter.

---

#### 4. `prescription_items` ✨ BARU
```sql
CREATE TABLE prescription_items (
  id SERIAL PRIMARY KEY,
  prescription_id INT NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  medicine_id INT NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  dosage_instruction TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);
```

**Alasan:** Tabel ini diperlukan untuk menyimpan detail item dalam resep (many-to-many relationship).

---

#### 5. `transactions` ✨ BARU
```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  patient_id INT NOT NULL REFERENCES patients(user_id) ON DELETE CASCADE,
  cashier_id INT REFERENCES staff(user_id) ON DELETE SET NULL,
  medical_record_id INT REFERENCES medical_records(id) ON DELETE SET NULL,
  total DECIMAL(12,2) NOT NULL,
  payment_method VARCHAR(20) DEFAULT 'tunai' CHECK (payment_method IN ('tunai','transfer','ewallet')),
  status VARCHAR(20) DEFAULT 'lunas' CHECK (status IN ('lunas','belum')),
  receipt_url VARCHAR(255),
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);
```

**Alasan:** Tabel ini diperlukan untuk menyimpan transaksi pembayaran.

---

### Tabel yang Diperbaiki (4 tabel):

#### 1. `users`
**Perubahan:**
- Menambahkan `"createdAt"` dan `"updatedAt"` (sebelumnya hanya `created_at`)

**Sebelum:**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin','pasien','resepsionis','dokter','apoteker','kasir')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Sesudah:**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin','pasien','resepsionis','dokter','apoteker','kasir')),
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);
```

**Alasan:** Sequelize menggunakan format camelCase dengan quotes untuk timestamps.

---

#### 2. `patients`
**Perubahan:**
- Menambahkan kolom lengkap: `medical_history`, `blood_type`, `emergency_contact`
- Menambahkan `"createdAt"` dan `"updatedAt"`

**Sebelum:**
```sql
CREATE TABLE patients (
  user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE
);
```

**Sesudah:**
```sql
CREATE TABLE patients (
  user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  medical_history TEXT,
  blood_type VARCHAR(5),
  emergency_contact VARCHAR(20),
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);
```

**Alasan:** Kolom-kolom ini diperlukan untuk profil pasien yang lengkap.

---

#### 3. `staff`
**Perubahan:**
- Menambahkan kolom: `license_number`
- Menambahkan `"createdAt"` dan `"updatedAt"`

**Sebelum:**
```sql
CREATE TABLE staff (
  user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  specialization VARCHAR(100),
  is_active BOOLEAN DEFAULT true
);
```

**Sesudah:**
```sql
CREATE TABLE staff (
  user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  specialization VARCHAR(100),
  license_number VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);
```

**Alasan:** `license_number` diperlukan untuk dokter dan apoteker.

---

#### 4. `queues`
**Perubahan:**
- Menambahkan `"createdAt"` dan `"updatedAt"`

**Sebelum:**
```sql
CREATE TABLE queues (
  id SERIAL PRIMARY KEY,
  queue_number VARCHAR(10) UNIQUE NOT NULL,
  patient_id INT NOT NULL REFERENCES patients(user_id),
  receptionist_id INT REFERENCES staff(user_id),
  status VARCHAR(20) DEFAULT 'menunggu' CHECK (status IN ('menunggu','dipanggil','selesai')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Sesudah:**
```sql
CREATE TABLE queues (
  id SERIAL PRIMARY KEY,
  queue_number VARCHAR(10) UNIQUE NOT NULL,
  patient_id INT NOT NULL REFERENCES patients(user_id) ON DELETE CASCADE,
  receptionist_id INT REFERENCES staff(user_id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'menunggu' CHECK (status IN ('menunggu','dipanggil','selesai')),
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);
```

**Alasan:** 
- Format timestamp sesuai Sequelize
- Menambahkan ON DELETE CASCADE/SET NULL untuk foreign keys

---

## ✨ Fitur Baru

### 1. DROP TABLE Statements
**Ditambahkan di awal file:**
```sql
DROP TABLE IF EXISTS prescription_items CASCADE;
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS medical_records CASCADE;
DROP TABLE IF EXISTS queues CASCADE;
DROP TABLE IF EXISTS medicines CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

**Alasan:** Memudahkan fresh install tanpa error jika tabel sudah ada.

---

### 2. Indexes untuk Performa
**Ditambahkan di akhir file:**
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_queues_status ON queues(status);
CREATE INDEX idx_queues_patient_id ON queues(patient_id);
CREATE INDEX idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX idx_medical_records_doctor_id ON medical_records(doctor_id);
CREATE INDEX idx_prescriptions_status ON prescriptions(status);
CREATE INDEX idx_transactions_patient_id ON transactions(patient_id);
```

**Alasan:** Meningkatkan performa query untuk kolom yang sering digunakan.

---

### 3. Foreign Keys dengan ON DELETE
**Perubahan:**
- Semua foreign keys sekarang memiliki `ON DELETE CASCADE` atau `ON DELETE SET NULL`
- Mencegah orphaned records
- Data integrity lebih baik

**Contoh:**
```sql
patient_id INT NOT NULL REFERENCES patients(user_id) ON DELETE CASCADE,
doctor_id INT REFERENCES staff(user_id) ON DELETE SET NULL,
```

---

## 📊 Perbandingan Sebelum dan Sesudah

| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| Jumlah Tabel | 4 | 9 |
| Format Timestamp | `created_at` (snake_case) | `"createdAt"` (camelCase) |
| Indexes | 0 | 7 |
| DROP Statements | Tidak ada | Ada |
| Foreign Key Constraints | Basic | Lengkap dengan ON DELETE |
| Kompatibilitas Sequelize | ❌ Tidak | ✅ Ya |

---

## ✅ Struktur Lengkap Database

### Tabel Utama:
1. ✅ `users` - Data pengguna (admin, pasien, staff)
2. ✅ `patients` - Profil pasien
3. ✅ `staff` - Profil staff (dokter, apoteker, dll)
4. ✅ `medicines` - Data obat
5. ✅ `queues` - Antrian pasien
6. ✅ `medical_records` - Rekam medis
7. ✅ `prescriptions` - Resep obat
8. ✅ `prescription_items` - Detail item resep
9. ✅ `transactions` - Transaksi pembayaran

### Relasi:
- `users` → `patients` (1:1)
- `users` → `staff` (1:1)
- `patients` → `queues` (1:N)
- `patients` → `medical_records` (1:N)
- `medical_records` → `prescriptions` (1:1)
- `prescriptions` → `prescription_items` (1:N)
- `medicines` → `prescription_items` (1:N)
- `patients` → `transactions` (1:N)

---

## 🔄 Cara Menggunakan Schema Baru

### 1. Buat Database:
```bash
psql -U postgres -c "CREATE DATABASE klinik_sentosa;"
```

### 2. Jalankan Schema:
```bash
psql -U postgres -d klinik_sentosa -f database/schema.sql
```

### 3. (Opsional) Jalankan Seeds:
```bash
psql -U postgres -d klinik_sentosa -f database/seeds_sql.sql
```

---

## ⚠️ Catatan Penting

1. **Format Timestamp:**
   - Menggunakan `"createdAt"` dan `"updatedAt"` (dengan quotes)
   - Ini adalah format yang digunakan Sequelize
   - Jangan ubah ke `created_at` karena akan menyebabkan error

2. **DROP TABLE:**
   - Statement DROP TABLE akan menghapus semua data
   - Gunakan dengan hati-hati di production
   - Untuk production, hapus bagian DROP TABLE

3. **Indexes:**
   - Indexes akan meningkatkan performa query
   - Tapi juga akan memperlambat INSERT/UPDATE sedikit
   - Sudah dioptimasi untuk use case aplikasi

---

## ✅ Hasil Akhir

Setelah perubahan:
- ✅ Schema lengkap sesuai kebutuhan aplikasi
- ✅ Kompatibel dengan Sequelize ORM
- ✅ Semua relasi sudah benar
- ✅ Performa dioptimasi dengan indexes
- ✅ Data integrity terjaga dengan constraints

---

**Dokumentasi dibuat:** 24 November 2025

