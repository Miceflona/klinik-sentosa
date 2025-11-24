// frontend/src/pages/patient/History.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function History() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const res = await axios.get('/api/patients/me/visits');
        setVisits(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVisits();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Riwayat Kunjungan</h1>

      {loading ? (
        <div className="p-6">Memuat...</div>
      ) : visits.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Belum ada riwayat kunjungan.</p>
          <button
            onClick={() => window.location.href = '/receptionist/register'}
            className="mt-4 text-primary hover:underline"
          >
            Daftar Kunjungan Baru
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {visits.map((visit) => (
            <div key={visit.id} className="bg-white rounded-lg shadow p-5">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{visit.doctor_name}</h3>
                  <p className="text-gray-600">{visit.specialization || 'Dokter Umum'}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    Rp {visit.total?.toLocaleString('id-ID') || '-'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(visit.created_at).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Keluhan</h4>
                  <p className="text-gray-600">{visit.complaint || '-'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Diagnosa</h4>
                  <p className="text-gray-600">{visit.diagnosis || '-'}</p>
                </div>
              </div>

              {visit.prescription?.items && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Resep Obat</h4>
                  <ul className="space-y-1">
                    {visit.prescription.items.map((item, idx) => (
                      <li key={idx} className="text-sm">
                        • {item.medicine_name} ({item.dosage}) — {item.quantity}x — "{item.dosage_instruction}"
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {visit.notes && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700">Catatan Dokter</h4>
                  <p className="text-gray-600">{visit.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}