# ⚡ QUICK START GUIDE - 5 MENIT

**Untuk**: Semua orang yang ingin langsung jalankan sistem  
**Durasi**: 5 menit reading + 10 menit setup  
**Status**: ✅ Siap Production

---

## ⏱️ 5 MENIT - BACA INI DULU

### 📊 Apa Itu Sistem Ini?
Sistem Informasi Manajemen Klinik Sentosa - aplikasi lengkap untuk:
- ✅ Manajemen pasien & antrian
- ✅ Rekam medis & diagnosis dokter
- ✅ Manajemen resep & obat
- ✅ Proses pembayaran
- ✅ Admin dashboard & laporan

### 📊 Siapa Bisa Pakai?
6 role dengan akses berbeda:
- **Admin** - Dashboard & manajemen sistem
- **Dokter** - Periksa pasien, buat resep
- **Resepsionis** - Buat antrian, daftar pasien
- **Apoteker** - Approve resep, kelola obat
- **Kasir** - Proses pembayaran
- **Pasien** - Lihat antrian, riwayat

### 💻 Yang Dipakai
```
Backend:  Node.js + Express + PostgreSQL
Frontend: React + Vite + Tailwind CSS
Database: PostgreSQL 12+
```

---

## 🚀 10 MENIT - SETUP PERTAMA KALI

### Prasyarat
```
✓ Node.js 14+ (check: node --version)
✓ PostgreSQL 12+ (check: psql --version)
✓ Git (optional, untuk clone)
```

### Jika tidak punya PostgreSQL
[Download & Install PostgreSQL](https://www.postgresql.org/download/)

### Setup Database (2 menit)
```bash
# Terminal baru
# Buat database
createdb klinik_sentosa

# Jalankan schema
psql -U postgres -d klinik_sentosa -f database/schema.sql

# Jalankan seed data (test accounts + data)
psql -U postgres -d klinik_sentosa -f database/seeds_sql.sql

# Verifikasi (optional)
psql -U postgres -d klinik_sentosa
# Ketik: SELECT COUNT(*) FROM users;
# Seharusnya 9 users
# Ketik: \q untuk exit
```

### Setup Backend (2 menit)
```bash
# Terminal 1
cd backend
npm install
npm run dev

# Expected output:
# ✅ Database connected successfully
# 🚀 Backend running on http://localhost:5000
```

### Setup Frontend (2 menit)
```bash
# Terminal 2 (terminal baru)
cd frontend
npm install
npm run dev

# Expected output:
# ➜  Local:   http://localhost:5174/
# Browser akan open otomatis
```

### Test System (1 menit)
```
1. Browser opened to http://localhost:5174
2. Login dengan:
   - Email: admin@klinik.com
   - Password: admin123
3. Click "Login"
4. Dashboard should appear
5. Done! ✅
```

---

## 🎯 BASIC WORKFLOW

### Admin Dashboard
```
Login → See statistics → Manage users/medicines → View reports
```

### Receptionist Queue
```
Login → Create new queue → Select patient → System generate queue number (A001, A002, etc)
→ Update status when needed (menunggu → dipanggil → selesai)
```

### Doctor Exam
```
Login → See patient queue → Select patient → Fill exam form (diagnosis, symptoms)
→ Create medical record → Automatically create prescription → Done
```

### Pharmacist Approval
```
Login → See prescriptions → Approve/Reject each one → When approved: Dispense medicine
→ Medicine stock automatically deducted
```

### Cashier Payment
```
Login → See pending payments → Click to process → Select payment method
→ Confirm payment → Transaction recorded → Done
```

### Patient View
```
Login → See queue status (antrian sudah dipanggil atau belum?)
→ View past visits → View profile
```

---

## 📱 FULL WORKFLOW EXAMPLE

### Scenario: Pasien Datang ke Klinik

**Step 1: Resepsionis**
```
1. Patient arrives
2. Resepsionis login → Create new queue
3. System generate unique number (e.g., "A025")
4. Patient gets queue number
```

**Step 2: Dokter**
```
1. Call patient "A025"
2. Dokter login → Select from queue
3. Fill exam form
4. Create prescription (e.g., Paracetamol 500mg x 10)
5. Submit
```

**Step 3: Apoteker**
```
1. Resep appears di Pharmacy dashboard
2. Apoteker review & approve
3. Dispense medicine to patient
4. Stock automatically deducted
```

**Step 4: Kasir**
```
1. Patient goes to cashier
2. Kasir process payment
3. Select method (cash/card/transfer)
4. Record transaction
5. Patient leave clinic
```

**Result:**
- ✅ Patient medical record created
- ✅ Prescription dispensed
- ✅ Payment recorded
- ✅ Report updated

---

## 🔐 LOGIN ACCOUNTS

### Sudah ada 9 test accounts:

```
ROLE          EMAIL                        PASSWORD
────────────────────────────────────────────────────
Admin         admin@klinik.com            admin123
Doctor        dokter@klinik.com           dokter123
Receptionist  resepsionis@klinik.com     resepsionis123
Pharmacist    apoteker@klinik.com        apoteker123
Cashier       kasir@klinik.com           kasir123
Patient 1     pasien1@klinik.com         pasien123
Patient 2     pasien2@klinik.com         pasien123
Patient 3     pasien3@klinik.com         pasien123
Staff (extra) staff@klinik.com           staff123
```

Coba login dengan masing-masing role untuk explore!

---

## 🛠️ TROUBLESHOOTING QUICK FIX

### Backend Won't Start
```bash
# Error: Port 5000 already in use
# Fix: Kill process
taskkill /F /IM node.exe

# Or change port in backend/.env
PORT=5001
```

### Frontend Won't Start
```bash
# Error: Module not found
# Fix:
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Can't Connect to Database
```bash
# Error: Database connection failed
# Fix: Check PostgreSQL running
psql -U postgres  # Should work

# If not: Start PostgreSQL service
# Windows: psql -U postgres -d klinik_sentosa
```

### Login Not Working
```bash
# Error: Invalid credentials
# Fix: Verify seed data loaded
psql -U postgres -d klinik_sentosa
SELECT * FROM users;
# Should see admin@klinik.com

# If empty: Run seed again
psql -U postgres -d klinik_sentosa -f database/seeds_sql.sql
```

---

## 📚 NEXT STEPS

### Mau Tahu Lebih Detail?
```
→ Read FINAL_SUMMARY.md (5 min read)
→ Read TECHNICAL.md (untuk developer)
→ Read SETUP.md (untuk instalasi lengkap)
```

### Mau Test Semua Fitur?
```
→ Read LAUNCH_CHECKLIST.md
→ Follow testing guide
→ Test dengan 6 role berbeda
```

### Mau Deploy ke Production?
```
→ Read SETUP.md deployment section
→ Setup SSL/HTTPS
→ Configure environment variables
→ Deploy!
```

### Mau Tambah Fitur?
```
→ Read TECHNICAL.md untuk understand architecture
→ Lihat existing code sebagai template
→ Add di backend dulu, kemudian frontend
→ Test thoroughly
```

---

## 🎯 CHECKLIST SETUP

```
[✓] PostgreSQL installed
[✓] Database created (createdb klinik_sentosa)
[✓] Schema loaded (schema.sql)
[✓] Test data seeded (seeds_sql.sql)
[✓] Backend running (npm run dev)
[✓] Frontend running (npm run dev)
[✓] Browser shows system (http://localhost:5174)
[✓] Can login with admin@klinik.com
[✓] Can access dashboard
[✓] System ready to use!
```

---

## ⚡ SUPER QUICK COMMANDS

```bash
# One-time setup
createdb klinik_sentosa
psql -U postgres -d klinik_sentosa -f database/schema.sql
psql -U postgres -d klinik_sentosa -f database/seeds_sql.sql

# Every time you start
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev

# Then open
http://localhost:5174

# Login
admin@klinik.com / admin123
```

---

## 💡 TIPS & TRICKS

### 1. Check Backend is Running
```bash
curl http://localhost:5000/api/health
# Should return: connection ok or similar
```

### 2. Check Database
```bash
psql -U postgres -d klinik_sentosa
\dt                    # Show all tables
SELECT * FROM users;   # Show users
\q                     # Exit
```

### 3. View Logs
```bash
# Backend logs shown in Terminal 1 (npm run dev output)
# Frontend logs shown in Terminal 2 (npm run dev output)
# Browser console: F12 → Console tab
```

### 4. Reset Everything
```bash
# If something breaks, reset database
dropdb klinik_sentosa
createdb klinik_sentosa
psql -U postgres -d klinik_sentosa -f database/schema.sql
psql -U postgres -d klinik_sentosa -f database/seeds_sql.sql
# Then restart backend & frontend
```

---

## 🎓 LEARN BY DOING

### Try This Workflow:

1. **Login as Admin**
   - admin@klinik.com / admin123
   - See dashboard statistics

2. **Login as Receptionist**
   - resepsionis@klinik.com / resepsionis123
   - Create a queue for a patient
   - Update queue status

3. **Login as Doctor**
   - dokter@klinik.com / dokter123
   - See patient queue
   - Create medical record for patient
   - Create prescription

4. **Login as Pharmacist**
   - apoteker@klinik.com / apoteker123
   - See pending prescriptions
   - Approve and dispense

5. **Login as Cashier**
   - kasir@klinik.com / kasir123
   - Process payment
   - See transaction history

6. **Login as Patient**
   - pasien1@klinik.com / pasien123
   - View queue status
   - See visit history

---

## 🚀 YOU'RE READY!

Sistem sudah:
- ✅ Setup complete
- ✅ Database ready
- ✅ Test data loaded
- ✅ Backend running
- ✅ Frontend running
- ✅ Ready to use!

### Mari Mulai!
```
1. Open http://localhost:5174
2. Login dengan admin@klinik.com / admin123
3. Explore sistem
4. Coba dengan role lain
5. Done! 🎉
```

---

## 🤔 QUESTIONS?

### Baca Dokumentasi:
- **DOCS_INDEX.md** - Navigation untuk semua docs
- **FINAL_SUMMARY.md** - Complete overview
- **SETUP.md** - Detailed setup guide
- **TECHNICAL.md** - Technical details
- **LAUNCH_CHECKLIST.md** - Testing & troubleshooting

### Common Issues:
- Can't connect to DB? → Check PostgreSQL running
- Backend won't start? → Check port 5000 free
- Frontend won't load? → Check npm install success
- Login not working? → Check database has seed data

---

## 📌 REMEMBER

```
Backend:  http://localhost:5000
Frontend: http://localhost:5174
Database: localhost, port 5432
```

**Default Credentials**:
```
Email:    admin@klinik.com
Password: admin123
```

**Report issues?**
- Check logs: Terminal output
- Check browser: F12 console
- Check database: psql queries
- Read troubleshooting: LAUNCH_CHECKLIST.md

---

**Selamat menggunakan Sistem Informasi Klinik Sentosa! 🎉**

**Version 1.0.0 | November 24, 2025 | Production Ready**
