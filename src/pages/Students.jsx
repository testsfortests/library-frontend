import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Filter, ChevronRight, Phone, Mail, UserX } from 'lucide-react'
import { studentAPI } from '../services/api'

const MOCK_STUDENTS = [
  { _id: '1', name: 'Priya Sharma',  phone: '9876543210', email: 'priya@example.com',  fee: 2000, enrollmentDate: '2024-03-01', status: 'active' },
  { _id: '2', name: 'Rahul Verma',   phone: '9123456780', email: 'rahul@example.com',  fee: 1500, enrollmentDate: '2024-03-05', status: 'active' },
  { _id: '3', name: 'Ananya Singh',  phone: '9234567891', email: 'ananya@example.com', fee: 2500, enrollmentDate: '2024-03-08', status: 'pending' },
  { _id: '4', name: 'Karan Mehta',   phone: '9345678902', email: 'karan@example.com',  fee: 2000, enrollmentDate: '2024-03-10', status: 'active' },
  { _id: '5', name: 'Sneha Patel',   phone: '9456789013', email: 'sneha@example.com',  fee: 1800, enrollmentDate: '2024-03-12', status: 'pending' },
  { _id: '6', name: 'Dev Agarwal',   phone: '9567890124', email: 'dev@example.com',    fee: 2200, enrollmentDate: '2024-02-20', status: 'active' },
  { _id: '7', name: 'Pooja Nair',    phone: '9678901235', email: 'pooja@example.com',  fee: 1700, enrollmentDate: '2024-02-14', status: 'inactive' },
]

const avatarColors = [
  ['#1E3557','#2A4570'], ['#065F46','#047857'],
  ['#92400E','#B45309'], ['#6D28D9','#7C3AED'],
  ['#BE123C','#9F1239'], ['#0369A1','#0284C7'],
  ['#166534','#15803D'],
]

function initials(name = '') {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

const FILTERS = ['All', 'Active', 'Pending', 'Inactive']

export default function Students() {
  const navigate = useNavigate()
  const [students, setStudents] = useState(MOCK_STUDENTS)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    studentAPI.getAll()
      .then(res => { if (res?.data) setStudents(res.data.students || res.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = students.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = s.name?.toLowerCase().includes(q) || s.phone?.includes(q) || s.email?.toLowerCase().includes(q)
    const matchFilter = filter === 'All' || s.status?.toLowerCase() === filter.toLowerCase()
    return matchSearch && matchFilter
  })

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="lib-section-title">Students</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>
            {filtered.length} of {students.length} members
          </p>
        </div>
        <button
          className="lib-btn lib-btn-primary"
          onClick={() => navigate('/students/add')}
          style={{ padding: '10px 16px', fontSize: 13 }}
        >
          <Plus size={15} /> Add
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search size={16} style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-faint)', pointerEvents: 'none',
        }} />
        <input
          className="lib-input"
          style={{ paddingLeft: 42 }}
          placeholder="Search by name, phone or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              flexShrink: 0, padding: '7px 16px',
              borderRadius: 99, cursor: 'pointer',
              fontSize: 12, fontWeight: 600,
              fontFamily: 'var(--font-body)',
              background: filter === f ? 'var(--navy)' : 'var(--white)',
              color: filter === f ? '#fff' : 'var(--text-secondary)',
              border: filter === f ? '1.5px solid transparent' : '1.5px solid var(--border)',
              transition: 'all 0.18s',
              boxShadow: filter === f ? '0 2px 8px rgba(15,30,53,0.20)' : 'none',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Student list */}
      <div style={{
        background: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}>
        {loading ? (
          Array(5).fill(null).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '16px 18px', borderBottom: '1px solid var(--border2)' }}>
              <div className="lib-skeleton" style={{ width: 46, height: 46, borderRadius: 14, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="lib-skeleton" style={{ height: 14, width: '50%', marginBottom: 8 }} />
                <div className="lib-skeleton" style={{ height: 11, width: '70%' }} />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '60px 20px', gap: 12,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <UserX size={24} color="var(--text-faint)" />
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)' }}>No students found</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Try adjusting your search or filter</p>
          </div>
        ) : (
          filtered.map((student, i) => (
            <div
              key={student._id}
              onClick={() => navigate(`/students/${student._id}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: 13,
                padding: '14px 18px',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--border2)' : 'none',
                cursor: 'pointer', transition: 'background 0.12s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <div className="lib-avatar" style={{
                width: 46, height: 46, fontSize: 15,
                borderRadius: 14,
                background: `linear-gradient(135deg, ${avatarColors[i % avatarColors.length][0]}, ${avatarColors[i % avatarColors.length][1]})`,
              }}>
                {initials(student.name)}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                    {student.name}
                  </p>
                  <span className={`lib-badge ${
                    student.status === 'active' ? 'lib-badge-active'
                    : student.status === 'pending' ? 'lib-badge-pending'
                    : 'lib-badge-inactive'
                  }`}>
                    {student.status || 'active'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                    <Phone size={10} /> {student.phone}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                  ₹{student.fee?.toLocaleString()}
                </p>
                <ChevronRight size={14} color="var(--text-faint)" style={{ marginTop: 4 }} />
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}