import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, IndianRupee, AlertCircle, UserCheck } from 'lucide-react'
import { studentAPI } from '../services/api'

const MOCK_STATS = {
  totalStudents: 142,
  activeStudents: 138,
  totalFees: 284000,
  pendingFees: 32000,
}

// Students whose due date has passed or is within 4 days
const MOCK_DUE = [
  { _id: '1', name: 'Priya Sharma',  phone: '9876543210', dueDate: '2026-03-10' },
  { _id: '2', name: 'Rahul Verma',   phone: '9123456780', dueDate: '2026-03-13' },
  { _id: '3', name: 'Ananya Singh',  phone: '9234567891', dueDate: '2026-03-16' },
  { _id: '4', name: 'Karan Mehta',   phone: '9345678902', dueDate: '2026-03-17' },
  { _id: '5', name: 'Sneha Patel',   phone: '9456789013', dueDate: '2026-03-18' },
]

function fmt(val) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`
  if (val >= 1000)   return `₹${(val / 1000).toFixed(1)}K`
  return `₹${val}`
}

function initials(name = '') {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

function getDueStatus(dueDateStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDateStr)
  due.setHours(0, 0, 0, 0)
  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24))
  return diffDays // negative = overdue, 0-4 = upcoming
}

function formatDueDate(dueDateStr) {
  return new Date(dueDateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

const avatarColors = [
  ['#1E3557','#2A4570'], ['#065F46','#047857'],
  ['#92400E','#B45309'], ['#6D28D9','#7C3AED'],
  ['#BE123C','#9F1239'],
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(MOCK_STATS)
  const [dueStudents, setDueStudents] = useState(MOCK_DUE)

  useEffect(() => {
    studentAPI.getAll()
      .then(res => {
        if (res?.data) {
          const students = res.data.students || res.data
          const total = res.data.total || students.length
          const active = students.filter(s => s.status === 'active').length
          const collected = students.reduce((s, st) => s + (st.fee || 0), 0)
          setStats({ totalStudents: total, activeStudents: active, totalFees: collected, pendingFees: MOCK_STATS.pendingFees })

          const today = new Date(); today.setHours(0,0,0,0)
          const cutoff = new Date(today); cutoff.setDate(today.getDate() + 4)
          const due = students.filter(s => {
            if (!s.dueDate) return false
            const d = new Date(s.dueDate); d.setHours(0,0,0,0)
            return d <= cutoff
          }).sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate))
          if (due.length) setDueStudents(due)
        }
      })
      .catch(() => {})
  }, [])

  const statCards = [
    { label: 'Active',         value: stats.activeStudents,icon: UserCheck,    bg: 'linear-gradient(135deg, #059669, #047857)',            iconBg: 'rgba(255,255,255,0.13)', iconColor: '#fff', textColor: '#fff', subColor: 'rgba(255,255,255,0.55)' },
    { label: 'Total Students', value: stats.totalStudents, icon: Users,        bg: 'linear-gradient(135deg, var(--navy3), var(--navy))',   iconBg: 'rgba(255,255,255,0.13)', iconColor: '#fff', textColor: '#fff', subColor: 'rgba(255,255,255,0.55)' },
    { label: 'Collected',      value: fmt(stats.totalFees), icon: IndianRupee, bg: 'linear-gradient(135deg, #F59E0B, #D97706)',            iconBg: 'rgba(255,255,255,0.20)', iconColor: '#0F1E35', textColor: '#0F1E35', subColor: 'rgba(15,30,53,0.50)' },
    { label: 'Pending',        value: fmt(stats.pendingFees),icon: AlertCircle,bg: 'linear-gradient(135deg, #EF4444, #DC2626)',            iconBg: 'rgba(255,255,255,0.15)', iconColor: '#fff', textColor: '#fff', subColor: 'rgba(255,255,255,0.55)' },
  ]

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* ── Welcome Box ── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy3) 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '22px 20px',
        boxShadow: '0 8px 28px rgba(15,30,53,0.20)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -24, top: -24, width: 120, height: 120, borderRadius: '50%', background: 'rgba(245,158,11,0.07)', pointerEvents: 'none' }} />
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 500, marginBottom: 4 }}>Welcome back 👋</p>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.2px' }}>
          Library Owner
        </p>
        <p style={{ fontSize: 14, color: 'var(--amber)', fontWeight: 600, marginTop: 6 }}>
          Library Junction
        </p>
      </div>

      {/* ── 4 Stat Cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 10,
      }}>
        {statCards.map(({ label, value, icon: Icon, bg, iconBg, iconColor, textColor, subColor }) => (
          <div key={label} style={{
            background: bg,
            borderRadius: 'var(--radius)',
            padding: '14px 13px',
            position: 'relative', overflow: 'hidden',
            boxShadow: 'var(--shadow)',
            minWidth: 0,
          }}>
            <div style={{ position: 'absolute', right: -12, top: -12, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
            <div style={{ width: 32, height: 32, borderRadius: 9, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Icon size={15} color={iconColor} strokeWidth={2} />
            </div>
            <p style={{ fontSize: 10, fontWeight: 600, color: subColor, textTransform: 'uppercase', letterSpacing: '0.35px', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {label}
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: textColor, lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Due / Overdue Students ── */}
      <div style={{
        background: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border2)', background: 'var(--bg)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-primary)' }}>
            Fee Due Alerts
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            Overdue &amp; due within 4 days
          </p>
        </div>

        {dueStudents.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>🎉 No dues right now!</p>
          </div>
        ) : (
          dueStudents.map((student, i) => {
            const diff = getDueStatus(student.dueDate)
            const overdue = diff < 0
            const today = diff === 0

            // color logic
            const tagBg    = overdue ? '#FEE2E2' : '#FEF3C7'
            const tagColor = overdue ? '#991B1B' : '#92400E'
            const tagLabel = overdue
              ? `${Math.abs(diff)}d overdue`
              : today
                ? 'Due today'
                : `Due in ${diff}d`

            return (
              <div
                key={student._id}
                onClick={() => navigate(`/students/${student._id}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '13px 18px',
                  borderBottom: i < dueStudents.length - 1 ? '1px solid var(--border2)' : 'none',
                  cursor: 'pointer', transition: 'background 0.12s',
                  borderLeft: `3px solid ${overdue ? 'var(--red)' : '#F59E0B'}`,
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                {/* Avatar */}
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: `linear-gradient(135deg, ${avatarColors[i % avatarColors.length][0]}, ${avatarColors[i % avatarColors.length][1]})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: '#fff',
                }}>
                  {initials(student.name)}
                </div>

                {/* Name + date */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {student.name}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                    {student.phone}
                  </p>
                </div>

                {/* Due tag */}
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <span style={{
                    display: 'inline-block',
                    background: tagBg, color: tagColor,
                    fontSize: 11, fontWeight: 700,
                    padding: '3px 9px', borderRadius: 99,
                    marginBottom: 4,
                  }}>
                    {tagLabel}
                  </span>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'right' }}>
                    {formatDueDate(student.dueDate)}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

    </div>
  )
}