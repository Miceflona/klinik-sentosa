import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';
import Layout from './components/layout/Layout.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';

// Pages per role
import PatientDashboard from './pages/patient/Dashboard.jsx';
import ReceptionistQueue from './pages/receptionist/TodayQueue.jsx';
import DoctorQueue from './pages/doctor/PatientQueue.jsx';
import PharmacistPrescriptions from './pages/pharmacy/PrescriptionList.jsx';
import CashierPayment from './pages/cashier/PaymentQueue.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';

// Guards
import RoleGuard from './components/RoleGuard.jsx';

function App() {
  const { loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Pasien */}
          <Route path="/dashboard" element={
            <RoleGuard roles={['pasien']}>
              <PatientDashboard />
            </RoleGuard>
          } />

          {/* Resepsionis */}
          <Route path="/receptionist" element={
            <RoleGuard roles={['resepsionis']}>
              <ReceptionistQueue />
            </RoleGuard>
          } />

          {/* Dokter */}
          <Route path="/doctor" element={
            <RoleGuard roles={['dokter']}>
              <DoctorQueue />
            </RoleGuard>
          } />

          {/* Apoteker */}
          <Route path="/pharmacist" element={
            <RoleGuard roles={['apoteker']}>
              <PharmacistPrescriptions />
            </RoleGuard>
          } />

          {/* Kasir */}
          <Route path="/cashier" element={
            <RoleGuard roles={['kasir']}>
              <CashierPayment />
            </RoleGuard>
          } />

          {/* Admin */}
          <Route path="/admin" element={
            <RoleGuard roles={['admin']}>
              <AdminDashboard />
            </RoleGuard>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;