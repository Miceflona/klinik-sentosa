// frontend/src/pages/patient/History.jsx
import React, { useState, useEffect } from 'react';
import { patientService } from '../../services/patientService.js';

export default function History() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await patientService.getVisits();
        // API returns { visits: [...] }, so we need to access res.data.visits
        const visitsData = res.data?.visits || res.data || [];
        setVisits(Array.isArray(visitsData) ? visitsData : []);
      } catch (err) {
        console.error('Error fetching visits:', err);
        setError(err.response?.data?.error || 'Gagal memuat riwayat kunjungan');
        setVisits([]); // Ensure visits is always an array
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
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Memuat riwayat kunjungan...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : visits.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="py-8">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-600 text-lg mb-2">Belum ada riwayat kunjungan</p>
            <p className="text-gray-500 text-sm mb-4">
              Riwayat kunjungan Anda akan muncul di sini setelah melakukan pemeriksaan
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {visits.map((visit) => (
            <div key={visit.id} className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {visit.doctor?.name || visit.doctor_name || 'Dokter'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {visit.doctor?.specialization || 'Dokter Umum'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {visit.createdAt 
                      ? new Date(visit.createdAt).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : visit.created_at 
                      ? new Date(visit.created_at).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : '-'}
                  </p>
                  <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                    visit.status === 'selesai' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {visit.status === 'selesai' ? 'Selesai' : 'Menunggu'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Keluhan</h4>
                  <p className="text-gray-600 text-sm">{visit.complaint || '-'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Diagnosa</h4>
                  <p className="text-gray-600 text-sm">{visit.diagnosis || '-'}</p>
                </div>
              </div>

              {visit.notes && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium text-gray-700 mb-1">Catatan Dokter</h4>
                  <p className="text-gray-600 text-sm">{visit.notes}</p>
                </div>
              )}

              {visit.queue && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Nomor Antrian:</span> {visit.queue.queue_number}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}