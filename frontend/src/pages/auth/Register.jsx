// frontend/src/pages/auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/patientService.js';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.register({
        ...formData,
        role: 'pasien'
      });
      alert('Pendaftaran berhasil! Silakan login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Pendaftaran gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">Daftar Akun Pasien</h1>
          <p className="text-gray-600">Buat akun untuk layanan kesehatan lebih mudah</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              required
              minLength="6"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. HP</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="081234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              rows="3"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium disabled:opacity-50"
          >
            {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Sudah punya akun?{' '}
            <a href="/login" className="text-primary font-medium hover:underline">
              Login di sini
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}