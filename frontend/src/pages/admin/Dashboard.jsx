import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/admin/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-blue-600 text-xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Pasien</p>
              <p className="text-2xl font-bold">{stats.totalPatients || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pemeriksaan Hari Ini</p>
              <p className="text-2xl font-bold">{stats.todayVisits || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-purple-600 text-xl">💊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Obat Stok Rendah</p>
              <p className="text-2xl font-bold text-danger">{stats.lowStockCount || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-yellow-600 text-xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pendapatan Hari Ini</p>
              <p className="text-2xl font-bold">
                Rp {(stats.todayRevenue || 0).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-5 border-b">
            <h3 className="text-lg font-semibold">10 Obat Terlaris (Bulan Ini)</h3>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              {stats.topMedicines?.map((med, idx) => (
                <div key={med.id} className="flex justify-between">
                  <span>{idx + 1}. {med.name}</span>
                  <span className="font-medium">{med.usage_count}x</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-5 border-b">
            <h3 className="text-lg font-semibold">Dokter Teraktif</h3>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              {stats.topDoctors?.map((doc) => (
                <div key={doc.id} className="flex justify-between">
                  <span>{doc.name}</span>
                  <span className="font-medium">{doc.visit_count} kunjungan</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}