import db from '../models/Index.js';
import { Op } from 'sequelize';
import { generateQueueNumber } from '../utils/queueGenerator.js';

const { Queue, Patient, User, Staff } = db;

export const createQueue = async (req, res) => {
  const { patientId } = req.body;
  const receptionistId = req.user.id;

  try {
    const patient = await Patient.findOne({
      where: { user_id: patientId },
      include: [{ model: User, as: 'user' }]
    });
    
    if (!patient) return res.status(404).json({ error: 'Pasien tidak ditemukan.' });

    const queueNumber = generateQueueNumber();
    const queue = await Queue.create({
      queue_number: queueNumber,
      patient_id: patientId,
      receptionist_id: receptionistId,
      status: 'menunggu'
    });

    res.status(201).json({
      message: 'Antrian berhasil dibuat.',
      queue: {
        id: queue.id,
        queue_number: queue.queue_number,
        patient_name: patient.user.name,
        created_at: queue.created_at
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTodaysQueues = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const queues = await Queue.findAll({
      where: {
        createdAt: { [Op.gte]: today }
      },
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{ model: User, as: 'user' }]
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    const formatted = queues.map(q => ({
      id: q.id,
      queue_number: q.queue_number,
      patient_name: q.patient.user.name,
      status: q.status,
      created_at: q.createdAt
    }));

    res.json({ queues: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateQueueStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const queue = await Queue.findByPk(id);
    if (!queue) return res.status(404).json({ error: 'Antrian tidak ditemukan.' });

    await queue.update({ status });
    res.json({ message: 'Status antrian berhasil diperbarui.', queue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const registerPatient = async (req, res) => {
  const { name, email, phone, address, medical_history, blood_type } = req.body;

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email sudah terdaftar.' });

    const user = await User.create({
      name,
      email,
      password: 'default123', // Default password
      phone,
      address,
      role: 'pasien'
    });

    await Patient.create({
      user_id: user.id,
      medical_history,
      blood_type
    });

    res.status(201).json({
      message: 'Pasien berhasil didaftarkan.',
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }]
    });

    res.json({ patients });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
