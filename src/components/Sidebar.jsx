import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, UserPlus, UserCircle,
  ChevronLeft, ChevronRight, BookOpen,
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/students', icon: Users, label: 'Students' },
  { to: '/students/add', icon: UserPlus, label: 'Add Student' },
  { to: '/profile', icon: UserCircle, label: 'Profile' },
]

export default function Sidebar({ collapsed, onToggle, className = '' }) {
  const location = useLocation()
  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <aside
      className={className}
      style={{
        position: 'fixed', left: 0, top: 0,
        height: '100dvh',
        width: collapsed ? 72 : 250,
        background: 'var(--navy)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        zIndex: 50, overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{
        height: 'var(--nav-h)',
        display: 'flex', alignItems: 'center',
        padding: collapsed ? '0 18px' : '0 20px',
        gap: 12, flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11,
          background: 'var(--amber)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(245,158,11,0.40)',
        }}>
          <BookOpen size={18} color="var(--navy)" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 17, color: '#fff',
              whiteSpace: 'nowrap', lineHeight: 1,
            }}>LibraryOS</p>
            <p style={{
              fontSize: 9, color: 'rgba(255,255,255,0.30)',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              fontWeight: 600, marginTop: 3, whiteSpace: 'nowrap',
            }}>Management System</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{
        flex: 1, padding: '20px 10px',
        overflowY: 'auto', overflowX: 'hidden',
      }}>
        {!collapsed && (
          <p style={{
            fontSize: 9, fontWeight: 700,
            color: 'rgba(255,255,255,0.22)',
            textTransform: 'uppercase', letterSpacing: '0.14em',
            padding: '0 10px', marginBottom: 10, whiteSpace: 'nowrap',
          }}>Main Menu</p>
        )}

        {navItems.map(({ to, icon: Icon, label }) => {
          const active = isActive(to)
          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              title={collapsed ? label : undefined}
              style={{
                display: 'flex', alignItems: 'center',
                gap: collapsed ? 0 : 11,
                padding: collapsed ? '12px 0' : '11px 13px',
                borderRadius: 11, marginBottom: 3,
                justifyContent: collapsed ? 'center' : 'flex-start',
                position: 'relative', textDecoration: 'none',
                transition: 'background 0.15s',
                background: active
                  ? 'rgba(245,158,11,0.12)'
                  : 'none',
                color: active ? '#fff' : 'rgba(255,255,255,0.40)',
                fontSize: 13.5, fontWeight: active ? 600 : 500,
                fontFamily: 'var(--font-body)',
                whiteSpace: 'nowrap', overflow: 'hidden',
              }}
              onMouseEnter={e => {
                if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
              }}
              onMouseLeave={e => {
                if (!active) e.currentTarget.style.background = 'none'
                if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.40)'
              }}
            >
              {/* Active left bar */}
              {active && (
                <span style={{
                  position: 'absolute', left: 0, top: '50%',
                  transform: 'translateY(-50%)',
                  width: 3, height: 24,
                  background: 'var(--amber)',
                  borderRadius: '0 4px 4px 0',
                }} />
              )}

              <Icon
                size={17}
                strokeWidth={active ? 2.5 : 2}
                style={{
                  flexShrink: 0,
                  color: active ? 'var(--amber)' : 'inherit',
                  transition: 'color 0.15s',
                }}
              />
              {!collapsed && <span>{label}</span>}

              {/* Active dot indicator */}
              {active && collapsed && (
                <span style={{
                  position: 'absolute', right: 8, top: '50%',
                  transform: 'translateY(-50%)',
                  width: 5, height: 5,
                  background: 'var(--amber)', borderRadius: '50%',
                }} />
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div style={{
        padding: '12px 10px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        <button
          onClick={onToggle}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            gap: collapsed ? 0 : 8,
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '10px 0' : '10px 13px',
            borderRadius: 11, background: 'none', border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.25)',
            fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'none'
            e.currentTarget.style.color = 'rgba(255,255,255,0.25)'
          }}
        >
          {collapsed
            ? <ChevronRight size={16} />
            : <><ChevronLeft size={16} /><span>Collapse</span></>
          }
        </button>
      </div>
    </aside>
  )
}