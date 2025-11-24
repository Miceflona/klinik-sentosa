// frontend/src/pages/admin/TransactionsReport.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TransactionsReport() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    paymentMethod: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('start', filters.startDate);
      if (filters.endDate) params.append('end', filters.endDate);
      if (filters.paymentMethod) params.append('method', filters.paymentMethod);

      const res = await axios.get(`/api/reports/transactions?${params}`);
      setTransactions(res.data);
    } catch (err) {
      alert('Gagal memuat laporan.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Laporan Transaksi</h1>
        <div className="text-lg font-bold text-success">
          Total: Rp {totalRevenue.toLocaleString('id-ID')}
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Dari Tanggal</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Sampai Tanggal</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Metode Bayar</label>
            <select
              name="paymentMethod"
              value={filters.paymentMethod}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Semua</option>
              <option value="tunai">Tunai</option>
              <option value="transfer">Transfer</option>
              <option value="ewallet">E-Wallet</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchTransactions}
              className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pasien</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bukti</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((t) => (
              <tr key={t.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {new Date(t.created_at).toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{t.patient_name}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  Rp {t.total.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-xs ${
                    t.payment_method === 'tunai' ? 'bg-gray-100' :
                    t.payment_method === 'transfer' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {t.payment_method}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {t.receipt_url && (
                    <a
                      href={t.receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Lihat PDF
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && !loading && (
          <div className="p-6 text-center text-gray-500">Tidak ada transaksi.</div>
        )}
      </div>
    </div>
  );
}