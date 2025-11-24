import React, { useState, useEffect } from 'react';
import { cashierService } from '../../services/patientService.js';

export default function PaymentQueue() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [formData, setFormData] = useState({
    payment_method: 'tunai'
  });

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const res = await cashierService.getPendingPayments();
      setTransactions(res.data.transactions || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal memuat pembayaran pending');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowForm(true);
  };

  const handleProcessPayment = async () => {
    if (!selectedTransaction) {
      setError('Pilih transaksi terlebih dahulu');
      return;
    }

    try {
      await cashierService.processTransaction({
        patient_id: selectedTransaction.patient_id,
        medical_record_id: selectedTransaction.medical_record_id,
        total: selectedTransaction.total,
        payment_method: formData.payment_method
      });

      setShowForm(false);
      setSelectedTransaction(null);
      setError('');
      fetchPendingPayments();
      alert('Pembayaran berhasil diproses');
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal memproses pembayaran');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Pembayaran Menunggu</h1>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Daftar Pembayaran</h2>
            </div>

            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : transactions.length === 0 ? (
              <div className="p-6 text-center text-gray-600">Tidak ada pembayaran menunggu</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Pasien
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold">{transaction.patient?.user?.name}</p>
                            <p className="text-sm text-gray-600">{transaction.patient?.user?.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold">
                          Rp {parseFloat(transaction.total).toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleSelectTransaction(transaction)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                          >
                            Proses
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div>
          {showForm && selectedTransaction && (
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Proses Pembayaran</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Pasien</p>
                  <p className="font-semibold">{selectedTransaction.patient?.user?.name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Total Pembayaran</p>
                  <p className="text-2xl font-bold text-blue-600">
                    Rp {parseFloat(selectedTransaction.total).toLocaleString('id-ID')}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Metode Pembayaran
                  </label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="tunai">Tunai</option>
                    <option value="transfer">Transfer Bank</option>
                    <option value="ewallet">E-Wallet</option>
                  </select>
                </div>

                <button
                  onClick={handleProcessPayment}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Konfirmasi Pembayaran
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}