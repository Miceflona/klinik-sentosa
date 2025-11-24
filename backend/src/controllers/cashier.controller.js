import db from '../models/Index.js';
import { Op } from 'sequelize';

const { Transaction, MedicalRecord, Patient, User } = db;

export const getPendingPayments = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { status: 'belum' },
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{ model: User, as: 'user' }]
        },
        {
          model: MedicalRecord,
          as: 'medicalRecord'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const processTransaction = async (req, res) => {
  const { patient_id, medical_record_id, total, payment_method } = req.body;
  const cashier_id = req.user.id;

  try {
    const transaction = await Transaction.create({
      patient_id,
      medical_record_id,
      cashier_id,
      total,
      payment_method,
      status: 'lunas'
    });

    res.status(201).json({
      message: 'Transaksi berhasil diproses.',
      transaction
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTransactionHistory = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { status: 'lunas' },
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{ model: User, as: 'user' }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTransactionStats = async (req, res) => {
  try {
    const total = await Transaction.sum('total', { where: { status: 'lunas' } });
    const count = await Transaction.count({ where: { status: 'lunas' } });

    res.json({
      total_transactions: count,
      total_revenue: total || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
