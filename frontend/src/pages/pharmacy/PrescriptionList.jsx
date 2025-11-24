// frontend/src/pages/pharmacist/PrescriptionList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PrescriptionList() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get('/api/pharmacist/prescriptions');
      setPrescriptions(res.data);
    } catch (err) {
      console.error('Gagal memuat resep:', err);
      alert('Gagal memuat data resep. Pastikan backend jalan.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(`/api/pharmacist/prescriptions/${id}/approve`);
      setPrescriptions(prev => 
        prev.map(p => p.id === id ? { ...p, status: 'disetujui' } : p)
      );
    } catch (err) {
      alert('Gagal menyetujui resep.');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(`/api/pharmacist/prescriptions/${id}/reject`);
      setPrescriptions(prev => 
        prev.map(p => p.id === id ? { ...p, status: 'ditolak' } : p)
      );
    } catch (err) {
      alert('Gagal menolak resep.');
    }
  };

  const handleDispense = async (id) => {
    try {
      await axios.post(`/api/pharmacist/prescriptions/${id}/dispense`);
      setPrescriptions(prev => 
        prev.map(p => p.id === id ? { ...p, status: 'diberikan' } : p)
      );
    } catch (err) {
      alert('Gagal menyerahkan obat.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Resep Obat</h1>
        <a 
          href="/pharmacist/stock"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Kelola Stok Obat
        </a>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          Memuat data resep...
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Tidak ada resep menunggu.</p>
          <p className="mt-2 text-sm">Resep akan muncul setelah dokter membuat pemeriksaan.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {prescriptions.map((pres) => (
            <div key={pres.id} className="bg-white rounded-lg shadow p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{pres.patient_name}</h3>
                  <p className="text-gray-600">Dokter: {pres.doctor_name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    #{pres.id} • {new Date(pres.created_at).toLocaleString('id-ID')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  pres.status === 'menunggu' ? 'bg-yellow-100 text-yellow-800' :
                  pres.status === 'disetujui' ? 'bg-green-100 text-green-800' :
                  pres.status === 'ditolak' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {pres.status}
                </span>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Daftar Obat:</h4>
                {pres.items && pres.items.length > 0 ? (
                  <ul className="space-y-1">
                    {pres.items.map((item, idx) => (
                      <li key={idx} className="text-sm">
                        • {item.medicine_name} ({item.dosage}) — {item.quantity}x — "{item.dosage_instruction}"
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Tidak ada obat.</p>
                )}
              </div>

              <div className="mt-4 flex space-x-3">
                {pres.status === 'menunggu' && (
                  <>
                    <button
                      onClick={() => handleApprove(pres.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Setujui
                    </button>
                    <button
                      onClick={() => handleReject(pres.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Tolak
                    </button>
                  </>
                )}
                {pres.status === 'disetujui' && (
                  <button
                    onClick={() => handleDispense(pres.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Serahkan Obat
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}