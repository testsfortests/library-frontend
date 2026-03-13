import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, LogOut, User, X, BookOpen } from 'lucide-react'

const routeTitles = {
  '/':             { title: 'Dashboard',     sub: 'Overview' },
  '/students':     { title: 'Students',      sub: 'All members' },
  '/students/add': { title: 'Add Student',   sub: 'New enrollment' },
  '/profile':      { title: 'My Profile',    sub: 'Account settings' },
}

function getPageMeta(pathname) {
  if (routeTitles[pathname]) return routeTitles[pathname]
  if (pathname.includes('/edit')) return { title: 'Edit Student', sub: 'Update details' }
  if (pathname.startsWith('/students/')) return { title: 'Student Details', sub: 'Member profile' }
  return { title: 'LibraryOS', sub: '' }
}

const notifications = [
  { msg: '3 students have pending fees', time: '2h ago', dot: '#F59E0B' },
  { msg: 'New student enrolled: Rahul Sharma', time: '5h ago', dot: '#10B981' },
  { msg: 'Monthly report is ready', time: '1d ago', dot: '#7A92B4' },
]

export default function Navbar({ sidebarWidth = 0, className = '' }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const meta = getPageMeta(location.pathname)
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  const closeAll = () => { setNotifOpen(false); setProfileOpen(false) }

  return (
    <>
      <header
        className={className}
        style={{
          position: 'fixed', top: 0, left: sidebarWidth, right: 0,
          height: 'var(--nav-h)',
          background: 'rgba(240,244,250,0.94)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center',
          padding: '0 18px', gap: 12, zIndex: 40,
          transition: 'left 0.3s ease',
        }}
      >
        {/* Logo mark — mobile only */}
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, var(--navy3), var(--navy))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
          className="lib-sidebar"
          /* hidden on desktop via CSS since sidebar has logo */
        >
          <BookOpen size={16} color="var(--amber)" />
        </div>

        {/* Title */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18, color: 'var(--text-primary)',
            lineHeight: 1, letterSpacing: '-0.2px',
          }}>{meta.title}</p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{today}</p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

          {/* Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setNotifOpen(o => !o); setProfileOpen(false) }}
              style={{
                background: notifOpen ? 'var(--bg2)' : 'none',
                border: 'none', cursor: 'pointer',
                width: 40, height: 40, borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)', position: 'relative',
                transition: 'background 0.15s',
              }}
            >
              <Bell size={18} />
              <span style={{
                position: 'absolute', top: 9, right: 9,
                width: 8, height: 8,
                background: 'var(--amber)',
                borderRadius: '50%',
                border: '2px solid var(--bg)',
                animation: 'pulse-dot 2s infinite',
              }} />
            </button>

            {notifOpen && (
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 10px)',
                width: 300, background: 'var(--white)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-lg)', zIndex: 100,
                overflow: 'hidden', animation: 'fadeUp 0.18s ease both',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderBottom: '1px solid var(--border2)',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                    Notifications
                  </span>
                  <button onClick={closeAll} className="lib-btn-icon" style={{ width: 28, height: 28 }}>
                    <X size={14} />
                  </button>
                </div>
                {notifications.map((n, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      padding: '13px 16px', cursor: 'pointer',
                      borderBottom: i < notifications.length - 1 ? '1px solid var(--border2)' : 'none',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: n.dot, marginTop: 4, flexShrink: 0,
                    }} />
                    <div>
                      <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.45 }}>{n.msg}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setProfileOpen(o => !o); setNotifOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: profileOpen ? 'var(--bg2)' : 'none',
                border: 'none', cursor: 'pointer',
                padding: '5px 8px 5px 5px', borderRadius: 12,
                transition: 'background 0.15s',
              }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: 'linear-gradient(135deg, var(--navy3), var(--navy))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: '#fff',
              }}>LO</div>
              <div style={{ textAlign: 'left', display: window.innerWidth < 420 ? 'none' : 'block' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>Admin</p>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Library Owner</p>
              </div>
              <ChevronDown size={13} color="var(--text-muted)" />
            </button>

            {profileOpen && (
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 10px)',
                width: 200, background: 'var(--white)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-lg)', zIndex: 100,
                overflow: 'hidden', animation: 'fadeUp 0.18s ease both',
              }}>
                {[
                  { label: 'My Profile', icon: User, action: () => { navigate('/profile'); closeAll() }, danger: false },
                  { label: 'Sign Out', icon: LogOut, action: closeAll, danger: true },
                ].map(({ label, icon: Icon, action, danger }, i, arr) => (
                  <React.Fragment key={label}>
                    {i > 0 && <div style={{ height: 1, background: 'var(--border2)' }} />}
                    <button
                      onClick={action}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        width: '100%', padding: '12px 16px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
                        color: danger ? 'var(--red)' : 'var(--text-primary)',
                        textAlign: 'left', transition: 'background 0.12s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = danger ? 'var(--red-light)' : 'var(--bg)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <Icon size={15} /> {label}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {(notifOpen || profileOpen) && (
        <div onClick={closeAll} style={{ position: 'fixed', inset: 0, zIndex: 39 }} />
      )}
    </>
  )
}