import db from '../models/Index.js';
import { Op } from 'sequelize';

const { Patient, User, Queue, MedicalRecord } = db;

export const getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      where: { user_id: req.user.id },
      include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }]
    });

    if (!patient) return res.status(404).json({ error: 'Data pasien tidak ditemukan.' });

    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePatientProfile = async (req, res) => {
  const { medical_history, blood_type, emergency_contact, name, phone, address } = req.body;

  try {
    // Update Patient data
    await Patient.update(
      { medical_history, blood_type, emergency_contact },
      { where: { user_id: req.user.id } }
    );

    // Update User data
    await User.update(
      { name, phone, address },
      { where: { id: req.user.id } }
    );

    const patient = await Patient.findOne({
      where: { user_id: req.user.id },
      include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }]
    });

    res.json({ message: 'Profil berhasil diperbarui.', patient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPatientVisits = async (req, res) => {
  try {
    const visits = await MedicalRecord.findAll({
      where: { patient_id: req.user.id },
      include: [
        { model: Queue, as: 'queue' }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({ visits });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPatientQueueStatus = async (req, res) => {
  try {
    const queue = await Queue.findOne({
      where: {
        patient_id: req.user.id,
        status: { [Op.ne]: 'selesai' }
      }
    });

    res.json({ queue: queue || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
