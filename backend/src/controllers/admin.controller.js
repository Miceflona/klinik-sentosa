import db from '../models/Index.js';
import bcrypt from 'bcrypt';

const { User, Medicine, Queue, MedicalRecord, Transaction, Staff, Patient } = db;

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalMedicines = await Medicine.count();
    const totalQueues = await Queue.count();
    const totalTransactions = await Transaction.count();
    const totalRevenue = await Transaction.sum('total', { where: { status: 'lunas' } });

    res.json({
      totalUsers,
      totalMedicines,
      totalQueues,
      totalTransactions,
      totalRevenue: totalRevenue || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['name', 'ASC']]
    });

    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, phone, address, role } = req.body;

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email sudah terdaftar.' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashed,
      phone,
      address,
      role
    });

    // Jika role adalah staff/dokter, buat Staff profile
    if (['dokter', 'apoteker', 'kasir', 'resepsionis'].includes(role)) {
      await Staff.create({ user_id: user.id });
    }

    // Jika role adalah pasien, buat Patient profile
    if (role === 'pasien') {
      await Patient.create({ user_id: user.id });
    }

    res.status(201).json({
      message: 'User berhasil dibuat.',
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, role, is_active } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan.' });

    await user.update({ name, email, phone, address, role });

    // Update Staff is_active if applicable
    if (is_active !== undefined) {
      await Staff.update({ is_active }, { where: { user_id: id } });
    }

    res.json({ message: 'User berhasil diperbarui.', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan.' });

    await user.destroy();

    res.json({ message: 'User berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.findAll({
      order: [['name', 'ASC']]
    });

    res.json({ medicines });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createMedicine = async (req, res) => {
  const { name, dosage, stock, price, min_stock } = req.body;

  try {
    const medicine = await Medicine.create({
      name,
      dosage,
      stock,
      price,
      min_stock
    });

    res.status(201).json({ message: 'Obat berhasil ditambahkan.', medicine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMedicine = async (req, res) => {
  const { id } = req.params;
  const { name, dosage, stock, price, min_stock } = req.body;

  try {
    const medicine = await Medicine.findByPk(id);
    if (!medicine) return res.status(404).json({ error: 'Obat tidak ditemukan.' });

    await medicine.update({ name, dosage, stock, price, min_stock });

    res.json({ message: 'Obat berhasil diperbarui.', medicine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMedicine = async (req, res) => {
  const { id } = req.params;

  try {
    const medicine = await Medicine.findByPk(id);
    if (!medicine) return res.status(404).json({ error: 'Obat tidak ditemukan.' });

    await medicine.destroy();

    res.json({ message: 'Obat berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
