import db from '../models/Index.js';

const { Queue, Patient, MedicalRecord, User, Prescription } = db;

export const getDoctorQueue = async (req, res) => {
  try {
    const queues = await Queue.findAll({
      where: { status: 'dipanggil' },
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{ model: User, as: 'user' }]
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.json({ queues });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPatientRecords = async (req, res) => {
  const { id } = req.params;

  try {
    const records = await MedicalRecord.findAll({
      where: { patient_id: id },
      order: [['createdAt', 'DESC']]
    });

    res.json({ records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createMedicalRecord = async (req, res) => {
  const { patient_id, queue_id, complaint, diagnosis, notes } = req.body;
  const doctor_id = req.user.id;

  try {
    const record = await MedicalRecord.create({
      patient_id,
      doctor_id,
      queue_id,
      complaint,
      diagnosis,
      notes,
      status: 'selesai'
    });

    res.status(201).json({
      message: 'Rekam medis berhasil dibuat.',
      record
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const completeExamination = async (req, res) => {
  const { id } = req.params;

  try {
    const record = await MedicalRecord.findByPk(id);
    if (!record) return res.status(404).json({ error: 'Rekam medis tidak ditemukan.' });

    await record.update({ status: 'selesai' });
    
    // Update queue status to selesai
    await Queue.update({ status: 'selesai' }, { where: { id: record.queue_id } });

    res.json({ message: 'Pemeriksaan berhasil diselesaikan.', record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
