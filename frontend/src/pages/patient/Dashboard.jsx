import React, { useState, useEffect } from 'react';
import { patientService } from '../../services/patientService.js';

export default function PatientDashboard() {
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
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Selamat Datang di Klinik Sentosa</h2>
        <p className="text-gray-600">
          Sistem kami memastikan pelayanan kesehatan cepat, aman, dan profesional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-blue-600 text-xl">🔢</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Antrian Saat Ini</p>
              <p className="text-2xl font-bold">A-007</p>
              <p className="text-sm text-gray-500">Sedang dipanggil</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pemeriksaan Terakhir</p>
              <p className="text-2xl font-bold">12 Nov 2025</p>
              <p className="text-sm text-gray-500">Influenza</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-purple-600 text-xl">💊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Resep Terakhir</p>
              <p className="text-2xl font-bold">3 obat</p>
              <p className="text-sm text-gray-500">Paracetamol, dll</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-5 border-b">
          <h3 className="text-lg font-semibold">Riwayat Kunjungan</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dokter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnosa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-red-500">
                    {error}
                  </td>
                </tr>
              ) : visits.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    Belum ada riwayat kunjungan
                  </td>
                </tr>
              ) : (
                visits.map((visit) => (
                  <tr key={visit.id}>
                    <td className="px-6 py-4 text-sm">
                      {visit.createdAt 
                        ? new Date(visit.createdAt).toLocaleDateString('id-ID')
                        : visit.created_at 
                        ? new Date(visit.created_at).toLocaleDateString('id-ID')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {visit.doctor?.user?.name || visit.doctor_name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">{visit.diagnosis || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        visit.status === 'selesai' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {visit.status === 'selesai' ? 'Selesai' : 'Menunggu'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}