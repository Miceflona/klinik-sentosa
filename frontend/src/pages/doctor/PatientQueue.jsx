import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/patientService.js';
import api from '../../services/api.js';
import { useNavigate } from 'react-router-dom';

export default function PatientQueue() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [showExaminationModal, setShowExaminationModal] = useState(false);
  const [formData, setFormData] = useState({
    complaint: '',
    diagnosis: '',
    notes: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchQueues();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchQueues, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchQueues = async () => {
    try {
      setLoading(true);
      const res = await doctorService.getQueue();
      setQueues(res.data?.queues || res.data || []);
    } catch (err) {
      console.error('Error fetching queues:', err);
      setError(err.response?.data?.error || 'Gagal memuat antrian');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQueue = (queue) => {
    setSelectedQueue(queue);
    setFormData({ complaint: '', diagnosis: '', notes: '' });
    setShowExaminationModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleViewPatientDetail = (queue) => {
    navigate(`/doctor/patient/${queue.patient.user_id || queue.patient_id}`);
  };

  const handleSubmitExamination = async () => {
    if (!selectedQueue || !formData.diagnosis) {
      setError('Diagnosa harus diisi');
      return;
    }

    try {
      setError('');
      await doctorService.createMedicalRecord({
        patient_id: selectedQueue.patient?.user_id || selectedQueue.patient_id,
        queue_id: selectedQueue.id,
        complaint: formData.complaint,
        diagnosis: formData.diagnosis,
        notes: formData.notes
      });
      
      setShowExaminationModal(false);
      setSelectedQueue(null);
      setFormData({ complaint: '', diagnosis: '', notes: '' });
      fetchQueues();
      alert('Pemeriksaan berhasil disimpan!');
    } catch (err) {
      console.error('Error saving examination:', err);
      setError(err.response?.data?.error || 'Gagal menyimpan pemeriksaan');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'dipanggil':
        return 'bg-blue-100 text-blue-800';
      case 'selesai':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'dipanggil':
        return 'Dipanggil';
      case 'selesai':
        return 'Selesai';
      default:
        return 'Menunggu';
    }
  };

  if (loading && queues.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Antrian Pasien</h1>
          <p className="text-gray-600 mt-1">Daftar pasien yang menunggu pemeriksaan</p>
        </div>
        <button
          onClick={fetchQueues}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {/* Queue List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">Pasien Menunggu</h2>
              <p className="text-sm text-gray-600 mt-1">{queues.length} pasien dalam antrian</p>
            </div>

            {queues.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">👨‍⚕️</div>
                <p className="text-gray-600 text-lg">Tidak ada pasien menunggu</p>
                <p className="text-gray-500 text-sm mt-2">Antrian pasien akan muncul di sini</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {queues.map((queue) => (
                  <div
                    key={queue.id}
                    className={`p-6 hover:bg-gray-50 transition ${
                      selectedQueue?.id === queue.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl font-bold text-blue-600">
                            {queue.queue_number}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {queue.patient?.user?.name || queue.patient_name || 'Pasien'}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(queue.status)}`}>
                            {getStatusLabel(queue.status)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Waktu:</span>{' '}
                            {queue.createdAt
                              ? new Date(queue.createdAt).toLocaleString('id-ID')
                              : queue.created_at
                              ? new Date(queue.created_at).toLocaleString('id-ID')
                              : '-'}
                          </div>
                          <div>
                            <span className="font-medium">No. HP:</span>{' '}
                            {queue.patient?.user?.phone || '-'}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleViewPatientDetail(queue)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                        >
                          👁️ Detail
                        </button>
                        <button
                          onClick={() => handleSelectQueue(queue)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                          disabled={queue.status === 'selesai'}
                        >
                          🩺 Periksa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistik Hari Ini</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Antrian</span>
                <span className="text-2xl font-bold text-blue-600">{queues.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Menunggu</span>
                <span className="text-xl font-semibold text-yellow-600">
                  {queues.filter(q => q.status === 'menunggu').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Dipanggil</span>
                <span className="text-xl font-semibold text-blue-600">
                  {queues.filter(q => q.status === 'dipanggil').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Examination Modal */}
      {showExaminationModal && selectedQueue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Form Pemeriksaan</h2>
                <button
                  onClick={() => {
                    setShowExaminationModal(false);
                    setSelectedQueue(null);
                    setError('');
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
              <div className="mt-2 bg-blue-50 p-3 rounded-lg">
                <p className="font-semibold text-gray-800">
                  Pasien: {selectedQueue.patient?.user?.name || selectedQueue.patient_name}
                </p>
                <p className="text-sm text-gray-600">No. Antrian: {selectedQueue.queue_number}</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keluhan Pasien
                </label>
                <textarea
                  name="complaint"
                  value={formData.complaint}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Masukkan keluhan yang disampaikan pasien..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosa *
                </label>
                <textarea
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Masukkan diagnosa..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan Tambahan
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Catatan, instruksi, atau tindak lanjut..."
                />
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSubmitExamination}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  ✅ Simpan Pemeriksaan
                </button>
                <button
                  onClick={() => {
                    setShowExaminationModal(false);
                    setSelectedQueue(null);
                    setError('');
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
