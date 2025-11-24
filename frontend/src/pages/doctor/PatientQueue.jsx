import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/patientService.js';

export default function PatientQueue() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    complaint: '',
    diagnosis: '',
    notes: ''
  });

  useEffect(() => {
    fetchQueues();
  }, []);

  const fetchQueues = async () => {
    try {
      setLoading(true);
      const res = await doctorService.getQueue();
      setQueues(res.data.queues || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal memuat antrian');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQueue = (queue) => {
    setSelectedQueue(queue);
    setShowForm(true);
    setFormData({ complaint: '', diagnosis: '', notes: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitRecord = async () => {
    if (!selectedQueue || !formData.diagnosis) {
      setError('Isikan diagnosa terlebih dahulu');
      return;
    }

    try {
      await doctorService.createMedicalRecord({
        patient_id: selectedQueue.patient.user_id,
        queue_id: selectedQueue.id,
        complaint: formData.complaint,
        diagnosis: formData.diagnosis,
        notes: formData.notes
      });

      await doctorService.completeExamination(selectedQueue.id);
      
      setShowForm(false);
      setSelectedQueue(null);
      setError('');
      fetchQueues();
      alert('Rekam medis berhasil disimpan');
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal menyimpan rekam medis');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Antrian Pasien</h1>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Pasien Menunggu</h2>
            </div>

            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : queues.length === 0 ? (
              <div className="p-6 text-center text-gray-600">Tidak ada pasien menunggu</div>
            ) : (
              <div className="divide-y">
                {queues.map((queue) => (
                  <div
                    key={queue.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedQueue?.id === queue.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                    }`}
                    onClick={() => handleSelectQueue(queue)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-lg">{queue.queue_number}</p>
                        <p className="text-gray-600">{queue.patient.user.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(queue.createdAt).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          queue.status === 'dipanggil'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {queue.status === 'dipanggil' ? 'Dipanggil' : 'Menunggu'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          {showForm && selectedQueue && (
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Form Pemeriksaan</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-700">Pasien: {selectedQueue.patient.user.name}</p>
                  <p className="text-sm text-gray-600">No. Antrian: {selectedQueue.queue_number}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keluhan</label>
                  <textarea
                    name="complaint"
                    value={formData.complaint}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    rows="2"
                    placeholder="Keluhan pasien..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diagnosa *
                  </label>
                  <textarea
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    rows="2"
                    placeholder="Diagnosa..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    rows="2"
                    placeholder="Catatan lainnya..."
                  />
                </div>

                <button
                  onClick={handleSubmitRecord}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Selesaikan Pemeriksaan
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}