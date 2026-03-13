import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users, IndianRupee, AlertCircle, UserCheck,
  ArrowRight, BookOpen, Plus, TrendingUp,
} from 'lucide-react'
import StudentCard from '../components/StudentCard'
import { studentAPI } from '../services/api'

const MOCK_STATS = {
  totalStudents: 142,
  totalFees: 284000,
  pendingFees: 32000,
  activeStudents: 138,
}

const MOCK_RECENT = [
  { _id: '1', name: 'Priya Sharma',  phone: '9876543210', fee: 2000, enrollmentDate: '2024-03-01', status: 'active' },
  { _id: '2', name: 'Rahul Verma',   phone: '9123456780', fee: 1500, enrollmentDate: '2024-03-05', status: 'active' },
  { _id: '3', name: 'Ananya Singh',  phone: '9234567891', fee: 2500, enrollmentDate: '2024-03-08', status: 'pending' },
  { _id: '4', name: 'Karan Mehta',   phone: '9345678902', fee: 2000, enrollmentDate: '2024-03-10', status: 'active' },
  { _id: '5', name: 'Sneha Patel',   phone: '9456789013', fee: 1800, enrollmentDate: '2024-03-12', status: 'pending' },
]

function fmt(val) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`
  if (val >= 1000)   return `₹${(val / 1000).toFixed(1)}K`
  return `₹${val}`
}

function initials(name = '') {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

const avatarColors = [
  ['#1E3557','#2A4570'],
  ['#065F46','#047857'],
  ['#92400E','#B45309'],
  ['#7C3AED','#6D28D9'],
  ['#BE123C','#9F1239'],
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats]   = useState(MOCK_STATS)
  const [recent, setRecent] = useState(MOCK_RECENT)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    studentAPI.getAll({ limit: 5, sort: '-enrollmentDate' })
      .then(res => {
        if (res?.data) {
          const students = res.data.students || res.data
          setRecent(students.slice(0, 5))
          const total = res.data.total || students.length
          const collected = students.reduce((s, st) => s + (st.fee || 0), 0)
          setStats(p => ({ ...p, totalStudents: total, totalFees: collected }))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const pendingCount = recent.filter(s => s.status === 'pending').length

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Welcome Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy3) 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px 22px',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(15,30,53,0.22)',
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', right: -30, top: -30,
          width: 160, height: 160, borderRadius: '50%',
          background: 'rgba(245,158,11,0.08)',
        }} />
        <div style={{
          position: 'absolute', right: 30, bottom: -50,
          width: 120, height: 120, borderRadius: '50%',
          background: 'rgba(245,158,11,0.05)',
        }} />
        <div style={{
          position: 'absolute', right: 20, top: 16,
          opacity: 0.06,
        }}>
          <BookOpen size={80} color="#fff" />
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(245,158,11,0.15)',
            border: '1px solid rgba(245,158,11,0.25)',
            borderRadius: 99, padding: '4px 12px',
            marginBottom: 12,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--amber)',
              animation: 'pulse-dot 2s infinite',
            }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--amber)', letterSpacing: '0.3px' }}>
              Good morning 👋
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 26, color: '#fff',
            lineHeight: 1.2, letterSpacing: '-0.3px',
          }}>Welcome back,<br />Admin!</h2>

          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 8, lineHeight: 1.5, maxWidth: 260 }}>
            You have{' '}
            <span style={{ color: 'var(--amber)', fontWeight: 600 }}>
              {pendingCount} pending fee collections
            </span>{' '}
            that need attention.
          </p>

          <button
            className="lib-btn lib-btn-amber"
            onClick={() => navigate('/students')}
            style={{ marginTop: 16, fontSize: 13, padding: '10px 18px' }}
          >
            View Students <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 12,
      }}>
        {[
          { title: 'Total Students', value: stats.totalStudents, subtitle: 'Registered', icon: Users,       color: 'navy',  trendLabel: '+12 this month' },
          { title: 'Active Members', value: stats.activeStudents, subtitle: 'Enrolled',   icon: UserCheck,  color: 'green', trendLabel: '97% retention' },
          { title: 'Fees Collected', value: fmt(stats.totalFees),  subtitle: 'Revenue',    icon: IndianRupee,color: 'amber', trendLabel: '+8% vs last month' },
          { title: 'Pending Fees',   value: fmt(stats.pendingFees),subtitle: 'Overdue',    icon: AlertCircle,color: 'red',   trendLabel: '4 overdue' },
        ].map((card, i) => (
          <div key={i} style={{ animationDelay: `${i * 0.06}s` }}>
            <StudentCard {...card} trend={card.color === 'red' ? 'down' : 'up'} />
          </div>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div style={{
        background: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid var(--border2)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-primary)' }}>
            Quick Actions
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
          {[
            { label: 'Enroll Student', icon: Plus,       action: () => navigate('/students/add'), bg: 'var(--amber-pale)',  iconBg: 'var(--amber-light)', iconColor: 'var(--amber2)' },
            { label: 'View Students',  icon: Users,      action: () => navigate('/students'),     bg: 'var(--navy-light)', iconBg: 'rgba(30,53,87,0.10)', iconColor: 'var(--navy3)' },
            { label: 'Collect Fees',   icon: IndianRupee,action: () => navigate('/students'),     bg: '#FFF1F2',           iconBg: '#FFE4E6',             iconColor: '#BE123C' },
          ].map(({ label, icon: Icon, action, bg, iconBg, iconColor }, i) => (
            <button
              key={i}
              onClick={action}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 8, padding: '18px 8px',
                background: bg, border: 'none', cursor: 'pointer',
                borderRight: i < 2 ? '1px solid var(--border2)' : 'none',
                transition: 'filter 0.15s',
                fontFamily: 'var(--font-body)',
              }}
              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.96)'}
              onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 13,
                background: iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={18} color={iconColor} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.3 }}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Fee Progress ── */}
      <div style={{
        background: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        padding: '18px 18px 20px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-primary)' }}>
            Fee Overview
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--green)', fontWeight: 600 }}>
            <TrendingUp size={12} /> 89.9% collected
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 10, background: 'var(--bg2)', borderRadius: 99, overflow: 'hidden', marginBottom: 14 }}>
          <div style={{
            height: '100%',
            width: '89.9%',
            background: 'linear-gradient(90deg, var(--navy3), var(--amber))',
            borderRadius: 99,
            transition: 'width 1s ease',
          }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Collected', val: stats.totalFees,  color: 'var(--navy3)', bg: 'var(--navy-light)' },
            { label: 'Pending',   val: stats.pendingFees, color: '#BE123C',    bg: '#FFF1F2' },
          ].map(({ label, val, color, bg }) => (
            <div key={label} style={{
              background: bg, borderRadius: 12, padding: '12px 14px',
            }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 4 }}>{label}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, color, fontWeight: 700 }}>
                {fmt(val)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Enrollments ── */}
      <div style={{
        background: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 18px', borderBottom: '1px solid var(--border2)',
        }}>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text-primary)' }}>
              Recent Enrollments
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Latest students joined</p>
          </div>
          <button
            onClick={() => navigate('/students')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 600, color: 'var(--navy3)',
              display: 'flex', alignItems: 'center', gap: 4,
              fontFamily: 'var(--font-body)',
            }}
          >
            View all <ArrowRight size={13} />
          </button>
        </div>

        <div>
          {(loading ? Array(4).fill(null) : recent).map((student, i) => (
            loading ? (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: i < 3 ? '1px solid var(--border2)' : 'none' }}>
                <div className="lib-skeleton" style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="lib-skeleton" style={{ height: 13, width: '55%', marginBottom: 6 }} />
                  <div className="lib-skeleton" style={{ height: 11, width: '35%' }} />
                </div>
                <div className="lib-skeleton" style={{ height: 22, width: 60, borderRadius: 99 }} />
              </div>
            ) : (
              <div
                key={student._id}
                onClick={() => navigate(`/students/${student._id}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 18px',
                  borderBottom: i < recent.length - 1 ? '1px solid var(--border2)' : 'none',
                  cursor: 'pointer', transition: 'background 0.12s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <div className="lib-avatar" style={{
                  width: 40, height: 40, fontSize: 14,
                  background: `linear-gradient(135deg, ${avatarColors[i % avatarColors.length][0]}, ${avatarColors[i % avatarColors.length][1]})`,
                }}>
                  {initials(student.name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1 }}>
                    {student.name}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{student.phone}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                    ₹{student.fee?.toLocaleString()}
                  </p>
                  <span className={`lib-badge ${student.status === 'active' ? 'lib-badge-active' : 'lib-badge-pending'}`}
                    style={{ marginTop: 4 }}>
                    {student.status || 'active'}
                  </span>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

    </div>
  )
}