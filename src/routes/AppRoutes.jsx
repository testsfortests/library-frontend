import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import Students from '../pages/Students'
import AddStudent from '../pages/AddStudent'
import EditStudent from '../pages/EditStudent'
import StudentDetails from '../pages/StudentDetails'
import OwnerProfile from '../pages/OwnerProfile'

function NotFound() {
  const navigate = useNavigate()
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', textAlign: 'center', padding: 32,
      animation: 'fadeUp 0.3s ease both',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 90, lineHeight: 1,
        color: 'var(--bg2)', letterSpacing: '-3px', marginBottom: 16,
        userSelect: 'none',
      }}>404</div>
      <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
        Page not found
      </p>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28, maxWidth: 260 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        className="lib-btn lib-btn-primary"
        onClick={() => navigate('/')}
      >
        Go to Dashboard
      </button>
    </div>
  )
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"                  element={<Dashboard />} />
      <Route path="/students"          element={<Students />} />
      <Route path="/students/add"      element={<AddStudent />} />
      <Route path="/students/:id"      element={<StudentDetails />} />
      <Route path="/students/:id/edit" element={<EditStudent />} />
      <Route path="/profile"           element={<OwnerProfile />} />
      <Route path="*"                  element={<NotFound />} />
    </Routes>
  )
}