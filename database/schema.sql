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

CREATE TABLE patients (
  user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE staff (
  user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  specialization VARCHAR(100),
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE queues (
  id SERIAL PRIMARY KEY,
  queue_number VARCHAR(10) UNIQUE NOT NULL,
  patient_id INT NOT NULL REFERENCES patients(user_id),
  receptionist_id INT REFERENCES staff(user_id),
  status VARCHAR(20) DEFAULT 'menunggu' CHECK (status IN ('menunggu','dipanggil','selesai')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);