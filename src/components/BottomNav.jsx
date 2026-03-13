import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, UserPlus, UserCircle } from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/students', icon: Users, label: 'Students' },
  { to: '/students/add', icon: UserPlus, label: 'Add', accent: true },
  { to: '/profile', icon: UserCircle, label: 'Profile' },
]

export default function BottomNav() {
  const location = useLocation()
  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: 'var(--bottom-h)',
      background: 'rgba(255,255,255,0.97)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50,
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      boxShadow: '0 -4px 20px rgba(15,30,53,0.06)',
      gap: 0,
    }}>
      {/* inner wrapper — capped width so items don't stretch too wide on desktop */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        width: '100%', maxWidth: 680,
      }}>
        {navItems.map(({ to, icon: Icon, label, accent }) => {
          const active = isActive(to)

          if (accent) {
            return (
              <NavLink key={to} to={to} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textDecoration: 'none', gap: 4,
              }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 16,
                  background: active
                    ? 'linear-gradient(135deg, var(--amber), var(--amber2))'
                    : 'linear-gradient(135deg, var(--navy3), var(--navy))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: active
                    ? '0 4px 16px rgba(245,158,11,0.45)'
                    : '0 4px 16px rgba(15,30,53,0.28)',
                  transform: 'translateY(-10px)',
                  transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                }}>
                  <Icon size={21} color={active ? 'var(--navy)' : '#fff'} strokeWidth={2.2} />
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 600,
                  color: active ? 'var(--amber2)' : 'var(--text-muted)',
                  marginTop: -6, transition: 'color 0.15s',
                }}>{label}</span>
              </NavLink>
            )
          }

          return (
            <NavLink key={to} to={to} end={to === '/'} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 4, textDecoration: 'none', padding: '8px 20px',
              minWidth: 64,
            }}>
              <div style={{
                width: 34, height: 34,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 11,
                background: active ? 'var(--navy-light)' : 'transparent',
                transition: 'all 0.18s cubic-bezier(0.34,1.56,0.64,1)',
                transform: active ? 'scale(1.1)' : 'scale(1)',
              }}>
                <Icon
                  size={19}
                  color={active ? 'var(--navy3)' : 'var(--text-faint)'}
                  strokeWidth={active ? 2.5 : 2}
                />
              </div>
              <span style={{
                fontSize: 10, fontWeight: active ? 700 : 500,
                color: active ? 'var(--navy3)' : 'var(--text-faint)',
                transition: 'all 0.15s',
              }}>{label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}