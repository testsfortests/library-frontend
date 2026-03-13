import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, ChevronRight, Phone, UserX, IndianRupee } from 'lucide-react'
import { studentAPI, totalPaid, totalDue } from '../services/api'

/* ── Mock data — matches the new payment model ── */
const MOCK = [
  { _id: '1', name: 'Priya Sharma',  phone: '9876543210', email: 'priya@example.com',  status: 'active',   monthlyFee: 2000, payments: [{ _id: 'p1', amount: 2000, date: '2025-03-01' }] },
  { _id: '2', name: 'Rahul Verma',   phone: '9123456780', email: 'rahul@example.com',  status: 'active',   monthlyFee: 1500, payments: [{ _id: 'p2', amount: 1000, date: '2025-03-05' }] },
  { _id: '3', name: 'Ananya Singh',  phone: '9234567891', email: 'ananya@example.com', status: 'pending',  monthlyFee: 2500, payments: [] },
  { _id: '4', name: 'Karan Mehta',   phone: '9345678902', email: 'karan@example.com',  status: 'active',   monthlyFee: 2000, payments: [{ _id: 'p3', amount: 1500, date: '2025-03-10' }, { _id: 'p4', amount: 500, date: '2025-03-12' }] },
  { _id: '5', name: 'Sneha Patel',   phone: '9456789013', email: 'sneha@example.com',  status: 'pending',  monthlyFee: 1800, payments: [{ _id: 'p5', amount: 800, date: '2025-03-12' }] },
  { _id: '6', name: 'Dev Agarwal',   phone: '9567890124', email: 'dev@example.com',    status: 'active',   monthlyFee: 2200, payments: [{ _id: 'p6', amount: 2200, date: '2025-02-20' }] },
  { _id: '7', name: 'Pooja Nair',    phone: '9678901235', email: 'pooja@example.com',  status: 'inactive', monthlyFee: 1700, payments: [] },
]

const AVATAR_COLORS = [
  ['#1E3557','#2A4570'], ['#065F46','#047857'], ['#92400E','#B45309'],
  ['#6D28D9','#7C3AED'], ['#BE123C','#9F1239'], ['#0369A1','#0284C7'],
  ['#166534','#15803D'],
]

function initials(name = '') {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

const FILTERS = ['All', 'Active', 'Pending', 'Inactive']

export default function Students() {
  const navigate = useNavigate()
  const [students, setStudents] = useState(MOCK)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('All')
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    setLoading(true)
    studentAPI.getAll()
      .then(res => { if (res?.data) setStudents(res.data.students || res.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  /* ── Derived totals shown in summary bar ── */
  const totalStudents    = students.length
  const totalCollected   = students.reduce((sum, s) => sum + totalPaid(s), 0)

  /* ── Filtered list ── */
  const filtered = students.filter(s => {
    const q = search.toLowerCase()
    const matchSearch =
      s.name?.toLowerCase().includes(q) ||
      s.phone?.includes(q) ||
      s.email?.toLowerCase().includes(q)
    const matchFilter =
      filter === 'All' || s.status?.toLowerCase() === filter.toLowerCase()
    return matchSearch && matchFilter
  })

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="lib-section-title">Students</h1>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {filtered.length} of {totalStudents} members
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

      {/* ── Summary strip ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 10,
      }}>
        {[
          { label: 'Total Students',    value: totalStudents,                 icon: UserX,         bg: 'var(--navy-light)', color: 'var(--navy3)' },
          { label: 'Total Collected',   value: `₹${totalCollected.toLocaleString()}`, icon: IndianRupee, bg: '#D1FAE5',           color: '#065F46'      },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} style={{
            background: bg, borderRadius: 'var(--radius)',
            padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9, flexShrink: 0,
              background: 'rgba(255,255,255,0.60)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={15} color={color} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 10, fontWeight: 600, color, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</p>
              <p style={{ fontSize: 18, fontWeight: 700, color, fontFamily: 'var(--font-display)', lineHeight: 1.1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div style={{ position: 'relative' }}>
        <Search size={15} style={{
          position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-faint)', pointerEvents: 'none',
        }} />
        <input
          className="lib-input"
          style={{ paddingLeft: 40 }}
          placeholder="Search by name, phone or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Filter pills ── */}
      <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 2 }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              flexShrink: 0, padding: '6px 15px', borderRadius: 99,
              cursor: 'pointer', fontSize: 12, fontWeight: 600,
              fontFamily: 'var(--font-body)',
              background: filter === f ? 'var(--navy)' : 'var(--white)',
              color: filter === f ? '#fff' : 'var(--text-secondary)',
              border: filter === f ? '1.5px solid transparent' : '1.5px solid var(--border)',
              transition: 'all 0.18s',
              boxShadow: filter === f ? '0 2px 8px rgba(15,30,53,0.18)' : 'none',
            }}
          >{f}</button>
        ))}
      </div>

      {/* ── Student list ── */}
      <div style={{
        background: 'var(--white)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
      }}>
        {loading ? (
          Array(5).fill(null).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '15px 18px', borderBottom: '1px solid var(--border2)' }}>
              <div className="lib-skeleton" style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="lib-skeleton" style={{ height: 13, width: '50%', marginBottom: 7 }} />
                <div className="lib-skeleton" style={{ height: 11, width: '75%' }} />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '52px 20px', gap: 10 }}>
            <UserX size={28} color="var(--text-faint)" />
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>No students found</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Try adjusting your search or filter</p>
          </div>
        ) : (
          filtered.map((student, i) => {
            const paid = totalPaid(student)
            const due  = totalDue(student)
            const fee  = student.monthlyFee || student.fee || 0

            return (
              <div
                key={student._id}
                onClick={() => navigate(`/students/${student._id}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '13px 16px',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border2)' : 'none',
                  cursor: 'pointer', transition: 'background 0.12s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                {/* Avatar */}
                <div className="lib-avatar" style={{
                  width: 44, height: 44, fontSize: 14, borderRadius: 13, flexShrink: 0,
                  background: `linear-gradient(135deg, ${AVATAR_COLORS[i % AVATAR_COLORS.length][0]}, ${AVATAR_COLORS[i % AVATAR_COLORS.length][1]})`,
                }}>
                  {initials(student.name)}
                </div>

                {/* Name + phone + fee info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {student.name}
                    </p>
                    <span className={`lib-badge ${
                      student.status === 'active'   ? 'lib-badge-active'
                      : student.status === 'pending' ? 'lib-badge-pending'
                      : 'lib-badge-inactive'
                    }`} style={{ flexShrink: 0 }}>
                      {student.status}
                    </span>
                  </div>
                  {/* Phone + fee row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--text-muted)' }}>
                      <Phone size={10} /> {student.phone}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--text-faint)' }}>·</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
                      ₹{fee.toLocaleString()}/mo
                    </span>
                  </div>
                  {/* Paid / Due mini bar */}
                  <div style={{ marginTop: 6 }}>
                    <div style={{ height: 4, background: 'var(--bg2)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 99,
                        width: fee > 0 ? `${Math.min(100, (paid / fee) * 100)}%` : '0%',
                        background: due === 0 ? 'var(--green)' : paid > 0 ? 'var(--amber)' : 'var(--red)',
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                </div>

                {/* Paid + Due amounts */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                    ₹{paid.toLocaleString()}
                  </p>
                  <p style={{ fontSize: 10, color: due > 0 ? 'var(--red)' : 'var(--green)', fontWeight: 600, marginTop: 3 }}>
                    {due > 0 ? `₹${due.toLocaleString()} due` : '✓ Paid'}
                  </p>
                  <ChevronRight size={13} color="var(--text-faint)" style={{ marginTop: 4 }} />
                </div>
              </div>
            )
          })
        )}
      </div>

    </div>
  )
}