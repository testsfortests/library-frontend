import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, LogOut, User, X } from 'lucide-react'
import Logo from './Logo'

const routeTitles = {
  '/':             'Dashboard',
  '/students':     'Students',
  '/students/add': 'Add Student',
  '/profile':      'My Profile',
}

function getTitle(pathname) {
  if (routeTitles[pathname]) return routeTitles[pathname]
  if (pathname.includes('/edit')) return 'Edit Student'
  if (pathname.startsWith('/students/')) return 'Student Details'
  return 'Library Junction'
}

const notifications = [
  { msg: '3 students have pending fees', time: '2h ago', dot: '#F59E0B' },
  { msg: 'New student enrolled: Rahul Sharma', time: '5h ago', dot: '#10B981' },
  { msg: 'Monthly report is ready', time: '1d ago', dot: '#7A92B4' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const closeAll = () => { setNotifOpen(false); setProfileOpen(false) }

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 'var(--nav-h)',
        background: 'rgba(240,244,250,0.96)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        padding: '0 16px', gap: 10, zIndex: 40,
      }}>
        {/* Logo */}
        <Logo size={34} />

        {/* Title */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: 17,
            color: 'var(--text-primary)', lineHeight: 1,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{getTitle(location.pathname)}</p>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{today}</p>
        </div>

        {/* Bell */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button onClick={() => { setNotifOpen(o => !o); setProfileOpen(false) }} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            width: 38, height: 38, borderRadius: 11,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-secondary)', position: 'relative',
          }}>
            <Bell size={18} />
            <span style={{
              position: 'absolute', top: 8, right: 8,
              width: 8, height: 8, background: 'var(--amber)',
              borderRadius: '50%', border: '2px solid var(--bg)',
              animation: 'pulse-dot 2s infinite',
            }} />
          </button>

          {notifOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 10px)',
              width: 290, background: 'var(--white)',
              borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-lg)', zIndex: 100, overflow: 'hidden',
              animation: 'fadeUp 0.18s ease both',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: '1px solid var(--border2)' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Notifications</span>
                <button onClick={closeAll} className="lib-btn-icon" style={{ width: 26, height: 26 }}><X size={13} /></button>
              </div>
              {notifications.map((n, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 11,
                  padding: '12px 16px', cursor: 'pointer',
                  borderBottom: i < notifications.length - 1 ? '1px solid var(--border2)' : 'none',
                  transition: 'background 0.12s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: n.dot, marginTop: 4, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.45 }}>{n.msg}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button onClick={() => { setProfileOpen(o => !o); setNotifOpen(false) }} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '5px 6px 5px 5px', borderRadius: 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: 'linear-gradient(135deg, var(--navy3), var(--navy))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#fff',
            }}>LJ</div>
            <ChevronDown size={12} color="var(--text-muted)" />
          </button>

          {profileOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 10px)',
              width: 185, background: 'var(--white)',
              borderRadius: 'var(--radius)', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-lg)', zIndex: 100, overflow: 'hidden',
              animation: 'fadeUp 0.18s ease both',
            }}>
              {[
                { label: 'My Profile', icon: User, action: () => { navigate('/profile'); closeAll() }, danger: false },
                { label: 'Sign Out', icon: LogOut, action: closeAll, danger: true },
              ].map(({ label, icon: Icon, action, danger }, i) => (
                <React.Fragment key={label}>
                  {i > 0 && <div style={{ height: 1, background: 'var(--border2)' }} />}
                  <button onClick={action} style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    width: '100%', padding: '12px 15px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
                    color: danger ? 'var(--red)' : 'var(--text-primary)',
                    textAlign: 'left', transition: 'background 0.12s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = danger ? 'var(--red-light)' : 'var(--bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <Icon size={14} /> {label}
                  </button>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </header>

      {(notifOpen || profileOpen) && (
        <div onClick={closeAll} style={{ position: 'fixed', inset: 0, zIndex: 39 }} />
      )}
    </>
  )
}