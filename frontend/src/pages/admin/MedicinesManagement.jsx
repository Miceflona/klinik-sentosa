// frontend/src/pages/admin/MedicinesManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function MedicinesManagement() {
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({
    name: '',
    dosage: '',
    stock: '',
    price: '',
    min_stock: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await axios.get('/api/admin/medicines');
      setMedicines(res.data);
    } catch (err) {
      alert('Gagal memuat data obat.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await axios.put(`/api/admin/medicines/${editingId}`, form);
        setMedicines(prev => prev.map(m => m.id === editingId ? { ...m, ...form } : m));
      } else {
        const res = await axios.post('/api/admin/medicines', form);
        setMedicines([...medicines, res.data]);
      }
      resetForm();
      fetchMedicines();
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal menyimpan obat.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (medicine) => {
    setForm({
      name: medicine.name,
      dosage: medicine.dosage,
      stock: medicine.stock.toString(),
      price: medicine.price.toString(),
      min_stock: medicine.min_stock.toString()
    });
    setEditingId(medicine.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus obat ini?')) return;
    try {
      await axios.delete(`/api/admin/medicines/${id}`);
      setMedicines(medicines.filter(m => m.id !== id));
    } catch (err) {
      alert('Gagal menghapus obat.');
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      dosage: '',
      stock: '',
      price: '',
      min_stock: ''
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Obat</h1>
        <button
          onClick={resetForm}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Tambah Obat
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit Obat' : 'Tambah Obat Baru'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Nama Obat</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Dosis</label>
            <input
              type="text"
              name="dosage"
              value={form.dosage}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="500mg, 10ml, dll"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Stok Awal</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Harga (Rp)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Stok Minimum</label>
            <input
              type="number"
              name="min_stock"
              value={form.min_stock}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="md:col-span-2 flex space-x-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : editingId ? 'Update' : 'Simpan'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
              >
                Batal Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabel Obat */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dosis</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stok</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {medicines.map((med) => (
              <tr key={med.id}>
                <td className="px-6 py-4 whitespace-nowrap">{med.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{med.dosage}</td>
                <td className={`px-6 py-4 whitespace-nowrap ${
                  med.stock <= med.min_stock ? 'text-danger font-bold' : ''
                }`}>
                  {med.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Rp {med.price.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleEdit(med)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(med.id)}
                    className="text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}