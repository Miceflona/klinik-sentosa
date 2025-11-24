# 🔧 TECHNICAL DOCUMENTATION - IMPLEMENTATION DETAILS

**Last Updated**: November 24, 2025  
**Version**: 1.0.0

---

## 📋 TABLE OF CONTENTS
1. Backend Architecture
2. Frontend Architecture
3. API Endpoints
4. Database Schema
5. Authentication Flow
6. Error Handling
7. Code Patterns & Standards

---

## 1️⃣ BACKEND ARCHITECTURE

### Stack
- **Runtime**: Node.js (ES6 Modules)
- **Framework**: Express.js 4.19.2
- **Database ORM**: Sequelize 6.37.3
- **Database**: PostgreSQL 12+
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcrypt 5.1.1

### Directory Structure
```
backend/
├── src/
│   ├── app.js                 # Express app with middleware
│   ├── config/
│   │   └── db.js              # Database connection config
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── rbac.js            # Role-based access control
│   ├── models/
│   │   ├── Index.js           # Central model registry
│   │   └── *.js               # Individual models (factory pattern)
│   ├── controllers/
│   │   └── *.js               # Business logic
│   ├── routes/
│   │   └── *.js               # API route definitions
│   └── utils/
│       ├── queueGenerator.js  # Queue ID generation
│       └── pdfGenerator.js    # PDF report generation
├── server.js                  # Entry point
├── package.json
└── .env
```

### App Flow
```
Express App (app.js)
├── CORS Middleware
├── JSON Parser
├── Auth Middleware
├── Routes
│   ├── /auth/*
│   ├── /patients/*
│   ├── /receptionist/*
│   ├── /doctor/*
│   ├── /pharmacist/*
│   ├── /cashier/*
│   ├── /admin/*
│   └── /reports/*
├── 404 Handler
└── Error Handler
```

### Model Relationships
```
User (Central Entity)
├── hasOne Patient (patient_id)
├── hasOne Staff (staff_id)
└── Associations:
    ├── Patient
    │   ├── hasMany Queue
    │   ├── hasMany MedicalRecord
    │   └── hasMany Prescription
    ├── Staff
    │   ├── Doctor/Resepsionis/Apoteker/Kasir
    │   └── hasMany Queue (for receptionist)
    ├── Prescription
    │   ├── belongsTo MedicalRecord
    │   ├── hasMany PrescriptionItem
    │   └── belongsTo Patient
    ├── PrescriptionItem
    │   └── belongsTo Medicine
    ├── Medicine
    │   └── hasMany PrescriptionItem
    ├── Queue
    │   ├── belongsTo Patient
    │   └── belongsTo Staff (if assigned)
    ├── MedicalRecord
    │   ├── belongsTo Patient
    │   └── belongsTo Staff (doctor)
    └── Transaction
        └── belongsTo Patient
```

### Models Detail

**User Model**
```javascript
{
  id: UUID (PK),
  email: String (unique),
  password: String (bcrypt hashed),
  role: Enum['admin', 'pasien', 'resepsionis', 'dokter', 'apoteker', 'kasir'],
  name: String,
  phone: String,
  address: String,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Patient Model**
```javascript
{
  id: UUID (PK),
  user_id: UUID (FK to User),
  medical_history: Text,
  allergies: String,
  blood_type: String,
  emergency_contact: String,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Queue Model**
```javascript
{
  id: UUID (PK),
  queue_number: String (unique, e.g., "A001"),
  patient_id: UUID (FK to Patient),
  assigned_to: UUID (FK to Staff, nullable),
  status: Enum['menunggu', 'dipanggil', 'sedang_diperiksa', 'selesai', 'tidak_hadir'],
  created_date: Date,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**MedicalRecord Model**
```javascript
{
  id: UUID (PK),
  queue_id: UUID (FK to Queue),
  patient_id: UUID (FK to Patient),
  doctor_id: UUID (FK to Staff),
  diagnosis: Text,
  symptoms: Text,
  prescription: Text,
  notes: Text,
  status: Enum['pending', 'completed', 'cancelled'],
  completed_at: DateTime,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Prescription Model**
```javascript
{
  id: UUID (PK),
  medical_record_id: UUID (FK to MedicalRecord),
  patient_id: UUID (FK to Patient),
  doctor_id: UUID (FK to Staff),
  status: Enum['pending', 'approved', 'rejected', 'dispensed'],
  rejection_reason: Text (nullable),
  created_by: UUID (FK to Staff),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**PrescriptionItem Model**
```javascript
{
  id: UUID (PK),
  prescription_id: UUID (FK to Prescription),
  medicine_id: UUID (FK to Medicine),
  quantity: Integer,
  dosage: String,
  frequency: String,
  duration: Integer (dalam hari),
  notes: Text,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Medicine Model**
```javascript
{
  id: UUID (PK),
  name: String,
  description: Text,
  price: Decimal,
  stock: Integer,
  unit: Enum['tablet', 'capsule', 'ml', 'gram'],
  category: String,
  expiry_date: Date,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Transaction Model**
```javascript
{
  id: UUID (PK),
  patient_id: UUID (FK to Patient),
  total_amount: Decimal,
  payment_method: Enum['cash', 'card', 'transfer'],
  status: Enum['pending', 'completed', 'cancelled'],
  payment_date: DateTime,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 2️⃣ FRONTEND ARCHITECTURE

### Stack
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.10
- **Routing**: React Router DOM 6.26.2
- **HTTP Client**: Axios 1.7.7
- **State Management**: Context API
- **Styling**: Tailwind CSS
- **Node Version**: 14.0+

### Directory Structure
```
frontend/
├── public/                 # Static assets
├── src/
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   ├── index.css          # Global styles
│   ├── components/
│   │   ├── RoleGuard.jsx  # Route protection
│   │   └── layout/
│   │       ├── Layout.jsx
│   │       ├── Navbar.jsx
│   │       └── Sidebar.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useAuth.jsx
│   ├── pages/
│   │   ├── auth/
│   │   ├── admin/
│   │   ├── cashier/
│   │   ├── doctor/
│   │   ├── patient/
│   │   ├── pharmacy/
│   │   └── receptionist/
│   ├── services/
│   │   ├── api.js
│   │   └── patientService.js
│   └── utils/
│       └── roles.js
├── index.html
├── package.json
├── vite.config.js
├── .env
└── tailwind.config.js
```

### Service Layer Pattern

**patientService.js** exports 8 service objects:

```javascript
export const authService = {
  login(email, password),
  register(data),
  getProfile(),
  logout()
}

export const patientService = {
  getProfile(),
  updateProfile(data),
  getVisits(),
  getQueueStatus()
}

export const receptionistService = {
  createQueue(patientId),
  getTodaysQueues(),
  updateQueueStatus(queueId, status),
  registerPatient(data),
  listPatients()
}

export const doctorService = {
  getQueue(),
  getPatientRecords(patientId),
  createMedicalRecord(data),
  completeExamination(recordId, data)
}

export const pharmacistService = {
  getPrescriptions(),
  approvePrescription(prescriptionId),
  rejectPrescription(prescriptionId, reason),
  dispenseMedicine(prescriptionId),
  getAllMedicines(),
  createMedicine(data),
  updateMedicine(id, data),
  deleteMedicine(id)
}

export const cashierService = {
  getPendingPayments(),
  processTransaction(data),
  getTransactionHistory(),
  getTransactionStats()
}

export const adminService = {
  getDashboardStats(),
  getAllUsers(),
  createUser(data),
  updateUser(id, data),
  deleteUser(id),
  getAllMedicines(),
  createMedicine(data),
  updateMedicine(id, data),
  deleteMedicine(id)
}

export const reportService = {
  getDashboardStats(),
  getMedicineUsageReport(),
  getVisitsReport(),
  getTransactionsReport()
}
```

### API Interceptor

**api.js** provides axios instance with:

```javascript
// Auto-inject JWT token
interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-redirect on 401
interceptors.response.use(null, error => {
  if (error.response?.status === 401) {
    window.location.href = '/login'
  }
  return Promise.reject(error)
})
```

### Authentication Context

```javascript
const AuthContext = createContext()

function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    user: null,
    token: null,
    loading: true
  })

  // Methods
  login(email, password)
  register(formData)
  logout()
  getProfile()
}

// Usage
const { auth, login, logout, loading } = useAuth()
```

### Routing Structure

```
/
├── /login                    (public)
├── /register                 (public)
└── /dashboard/               (protected)
    ├── /admin/*              (requireRole: admin)
    ├── /receptionist/*       (requireRole: resepsionis)
    ├── /doctor/*             (requireRole: dokter)
    ├── /pharmacy/*           (requireRole: apoteker)
    ├── /cashier/*            (requireRole: kasir)
    └── /patient/*            (requireRole: pasien)
```

### Component Hierarchy

```
App
├── RoleGuard (wrapper)
├── Layout
│   ├── Navbar
│   │   ├── User Info
│   │   └── Logout Button
│   ├── Sidebar
│   │   └── Menu Items (per role)
│   └── Main Content
│       ├── Admin Pages
│       ├── Doctor Pages
│       ├── Pharmacist Pages
│       ├── Cashier Pages
│       ├── Receptionist Pages
│       └── Patient Pages
└── Auth Pages (when not logged in)
```

---

## 3️⃣ API ENDPOINTS

### Authentication (`/api/auth`)
```
POST   /register              Register new patient
POST   /login                 Login with email/password
GET    /me                    Get current user profile
POST   /logout                Logout
```

### Patient (`/api/patients`)
```
GET    /me                    Get patient profile
PUT    /me                    Update patient profile
GET    /me/visits             Get patient visits history
GET    /me/queue              Get queue status
```

### Receptionist (`/api/receptionist`)
```
POST   /queue                 Create new queue
GET    /queues/today          Get today's queues
PATCH  /queue/:id             Update queue status
POST   /patients              Register new patient
GET    /patients              List all patients
```

### Doctor (`/api/doctor`)
```
GET    /queue                 Get patient queue
GET    /patients/:id/records  Get patient medical records
POST   /records               Create medical record
PATCH  /records/:id/complete  Complete examination
```

### Pharmacist (`/api/pharmacist`)
```
GET    /prescriptions                      Get prescriptions
PATCH  /prescriptions/:id/approve          Approve prescription
PATCH  /prescriptions/:id/reject           Reject prescription
POST   /prescriptions/:id/dispense         Dispense medicine
GET    /medicines                          List medicines
POST   /medicines                          Create medicine
PUT    /medicines/:id                      Update medicine
DELETE /medicines/:id                      Delete medicine
```

### Cashier (`/api/cashier`)
```
GET    /pending               Get pending payments
POST   /transactions          Process transaction
GET    /transactions          Get transaction history
GET    /stats                 Get statistics
```

### Admin (`/api/admin`)
```
GET    /dashboard             Get dashboard stats
GET    /users                 List all users
POST   /users                 Create user
PUT    /users/:id             Update user
DELETE /users/:id             Delete user
GET    /medicines             List medicines
POST   /medicines             Create medicine
PUT    /medicines/:id         Update medicine
DELETE /medicines/:id         Delete medicine
```

### Reports (`/api/reports`)
```
GET    /dashboard             Get dashboard report
GET    /visits                Get visits report
GET    /transactions          Get transactions report
GET    /medicine-usage        Get medicine usage report
```

---

## 4️⃣ DATABASE SCHEMA

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Queues Table
```sql
CREATE TABLE queues (
  id UUID PRIMARY KEY,
  queue_number VARCHAR(50) UNIQUE NOT NULL,
  patient_id UUID NOT NULL,
  assigned_to UUID,
  status VARCHAR(50) DEFAULT 'menunggu',
  created_date DATE NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (assigned_to) REFERENCES staff(id)
);
```

### Complete Schema
See `database/schema.sql` for full schema definition.

---

## 5️⃣ AUTHENTICATION FLOW

### Login Flow
```
1. User enters email/password
2. Frontend: authService.login(email, password)
3. Backend: /api/auth/login
4. Backend: bcrypt.compare(password, hashedPassword)
5. Backend: Generate JWT token
6. Frontend: Store token in localStorage
7. Frontend: Set Authorization header
8. Redirect to dashboard
```

### JWT Token Structure
```javascript
Header: { alg: 'HS256', typ: 'JWT' }
Payload: { 
  userId: UUID,
  email: string,
  role: string,
  iat: timestamp,
  exp: timestamp
}
Signature: HMAC(secret)
```

### Protected Request Flow
```
1. Frontend: axios request
2. Interceptor: Add Authorization header
3. Header: "Authorization: Bearer <token>"
4. Backend: middleware/auth.js verifies token
5. If invalid: return 401
6. If valid: attach user info to request
7. Controller processes request
8. Response sent back
```

### Logout Flow
```
1. User clicks logout
2. Frontend: authService.logout()
3. Backend: /api/auth/logout (optional, just for audit)
4. Frontend: Remove token from localStorage
5. Frontend: Clear auth context
6. Frontend: Redirect to /login
```

---

## 6️⃣ ERROR HANDLING

### Backend Error Middleware
```javascript
// In app.js
app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'Internal Server Error'
  
  res.status(status).json({
    error: true,
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})
```

### Frontend Error Interceptor
```javascript
// In api.js
interceptors.response.use(null, error => {
  if (error.response?.status === 401) {
    // Redirect to login
    window.location.href = '/login'
  }
  // Pass error to component
  return Promise.reject(error)
})
```

### Error Response Format
```json
{
  "error": true,
  "status": 400,
  "message": "Invalid credentials"
}
```

### HTTP Status Codes Used
```
200 OK              - Successful request
201 Created         - Resource created
204 No Content      - Success, no body
400 Bad Request     - Invalid data
401 Unauthorized    - Invalid/missing token
403 Forbidden       - Insufficient permissions
404 Not Found       - Resource not found
500 Server Error    - Unexpected error
```

---

## 7️⃣ CODE PATTERNS & STANDARDS

### Controller Pattern
```javascript
// controllers/example.controller.js
export const getExample = async (req, res, next) => {
  try {
    const data = await db.Model.findAll()
    
    res.json({
      success: true,
      message: 'Data retrieved successfully',
      data
    })
  } catch (error) {
    next(error)
  }
}
```

### Service Method Pattern
```javascript
// services/patientService.js
export const exampleService = {
  async getExample() {
    try {
      const response = await api.get('/endpoint')
      return response.data
    } catch (error) {
      throw error
    }
  }
}
```

### Component Pattern (Functional)
```javascript
// pages/example/Example.jsx
import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { exampleService } from '../../services/patientService'

export default function Example() {
  const { auth } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const result = await exampleService.getExample()
      setData(result)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {/* Component JSX */}
    </div>
  )
}
```

### Model Association Pattern
```javascript
// models/User.js
export default function(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    // attributes
  })

  User.associate = (models) => {
    User.hasOne(models.Patient, {
      foreignKey: 'user_id'
    })
  }

  return User
}
```

### Route Pattern
```javascript
// routes/example.routes.js
import express from 'express'
import { authenticateToken } from '../middleware/auth.js'
import { requireRole } from '../middleware/rbac.js'
import * as controller from '../controllers/example.controller.js'

const router = express.Router()

router.get(
  '/',
  authenticateToken,
  requireRole('admin'),
  controller.getExample
)

export default router
```

---

## 🔐 SECURITY BEST PRACTICES

### Implemented
- ✅ JWT authentication with expiry (7 days)
- ✅ Bcrypt password hashing (10 rounds)
- ✅ CORS enabled with origins
- ✅ Role-based access control (RBAC)
- ✅ Input validation at controller level
- ✅ Error messages don't leak sensitive info
- ✅ Tokens in localStorage (could use httpOnly cookies for extra security)

### Recommendations for Production
- [ ] Use httpOnly cookies instead of localStorage for tokens
- [ ] Implement rate limiting (express-rate-limit)
- [ ] Add request validation with joi/yup
- [ ] Use HTTPS only
- [ ] Add helmet middleware for security headers
- [ ] Implement CORS whitelist
- [ ] Add logging (Morgan/Winston)
- [ ] Use environment variables for all secrets
- [ ] Regular security audits

---

## 📊 PERFORMANCE NOTES

### Database Optimization
- Add indexes on frequently queried columns (email, queue_number, patient_id)
- Use pagination for large result sets
- Consider caching for reports

### Frontend Optimization
- Lazy load page components with React.lazy()
- Use React.memo for expensive components
- Implement pagination for lists
- Use Vite's code splitting

### API Optimization
- Add response caching headers
- Implement pagination (limit, offset)
- Use database query optimization
- Consider GraphQL for flexible querying

---

**Status**: ✅ COMPLETE TECHNICAL DOCUMENTATION  
**Last Updated**: November 24, 2025  
**Version**: 1.0.0
