// frontend/src/pages/patient/QueueStatus.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function QueueStatus() {
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await axios.get('/api/patients/me/queue');
        setQueue(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQueue();
  }, []);

  if (loading) return <div className="p-6">Memuat status antrian...</div>;

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Status Antrian Saya</h1>

      {queue ? (
        <div className="bg-white rounded-lg shadow text-center p-8">
          <div className="text-5xl font-bold text-primary mb-4">{queue.queue_number}</div>
          <p className="text-gray-600 mb-2">Anda dalam antrian</p>
          <p className="text-lg font-medium text-gray-800">{queue.patient_name}</p>
          
          <div className="mt-6">
            <span className={`inline-block px-4 py-2 rounded-full text-white ${
              queue.status === 'menunggu' ? 'bg-yellow-500' :
              queue.status === 'dipanggil' ? 'bg-blue-500' :
              'bg-green-500'
            }`}>
              {queue.status === 'menunggu' ? 'Menunggu' :
               queue.status === 'dipanggil' ? 'Sedang Dipanggil' : 'Selesai'}
            </span>
          </div>

          {queue.status === 'dipanggil' && (
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <p className="text-blue-800 font-medium">
                📢 Silakan menuju ruang pemeriksaan {queue.doctor_room || 'Dokter Umum'}.
              </p>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-500">
            <p>Waktu pendaftaran: {new Date(queue.created_at).toLocaleString('id-ID')}</p>
            {queue.estimated_time && (
              <p>Estimasi: ± {queue.estimated_time} menit</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow text-center p-8">
          <div className="text-5xl mb-4">❌</div>
          <h3 className="text-lg font-semibold text-gray-800">Tidak Ada Antrian Aktif</h3>
          <p className="text-gray-600 mt-2">Anda belum mendaftar kunjungan hari ini.</p>
          <button
            onClick={() => window.location.href = '/receptionist/register'}
            className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Daftar Kunjungan
          </button>
        </div>
      )}
    </div>
  );
}