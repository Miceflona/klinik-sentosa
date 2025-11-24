import db from '../models/Index.js';
import { Op } from 'sequelize';

const { Patient, User, Queue, MedicalRecord, Staff } = db;

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
    // Find patient record first
    const patient = await Patient.findOne({
      where: { user_id: req.user.id }
    });

    if (!patient) {
      return res.json({ visits: [] });
    }

    const visits = await MedicalRecord.findAll({
      where: { patient_id: patient.user_id },
      include: [
        { 
          model: Queue, 
          as: 'queue',
          attributes: ['id', 'queue_number', 'status']
        },
        {
          model: Staff,
          as: 'doctor',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name']
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Format response for frontend
    const formattedVisits = visits.map(visit => ({
      id: visit.id,
      createdAt: visit.createdAt,
      created_at: visit.createdAt, // Keep both for compatibility
      complaint: visit.complaint,
      diagnosis: visit.diagnosis,
      notes: visit.notes,
      status: visit.status,
      doctor: visit.doctor ? {
        id: visit.doctor.user_id,
        name: visit.doctor.user?.name || '-'
      } : null,
      doctor_name: visit.doctor?.user?.name || '-', // For backward compatibility
      queue: visit.queue ? {
        id: visit.queue.id,
        queue_number: visit.queue.queue_number,
        status: visit.queue.status
      } : null
    }));

    res.json({ visits: formattedVisits });
  } catch (err) {
    console.error('Error fetching patient visits:', err);
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
