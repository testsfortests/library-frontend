import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen, Mail, Phone, MapPin, Edit, LogOut,
  Shield, Bell, Moon, ChevronRight, CheckCircle,
} from 'lucide-react'

const PROFILE = {
  name: 'Library Admin',
  email: 'admin@libraryos.com',
  phone: '9800000001',
  location: 'Jaipur, Rajasthan',
  libraryName: 'City Central Library',
  memberSince: 'January 2024',
  plan: 'Pro',
}

export default function OwnerProfile() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 560 }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy3) 100%)',
        borderRadius: 'var(--radius-xl)', padding: '28px 22px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        position: 'relative', overflow: 'hidden', textAlign: 'center',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(245,158,11,0.06)' }} />
        <div style={{ position: 'absolute', left: -20, bottom: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(245,158,11,0.04)' }} />

        <div style={{
          width: 72, height: 72, borderRadius: 22,
          background: 'linear-gradient(135deg, var(--amber), var(--amber2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, fontWeight: 800, color: 'var(--navy)',
          boxShadow: '0 6px 24px rgba(245,158,11,0.45)',
          letterSpacing: 1,
        }}>LA</div>

        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#fff', lineHeight: 1.2 }}>
            {PROFILE.name}
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.50)', marginTop: 4 }}>
            {PROFILE.libraryName}
          </p>
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(245,158,11,0.15)',
          border: '1px solid rgba(245,158,11,0.30)',
          borderRadius: 99, padding: '5px 14px',
        }}>
          <Shield size={11} color="var(--amber)" />
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--amber)', letterSpacing: '0.3px' }}>
            {PROFILE.plan} Plan
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{
        background: 'var(--white)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border2)' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Account Info
          </p>
        </div>
        {[
          { icon: Mail,     label: 'Email',    value: PROFILE.email,       color: 'var(--amber2)' },
          { icon: Phone,    label: 'Phone',    value: PROFILE.phone,       color: 'var(--green)' },
          { icon: MapPin,   label: 'Location', value: PROFILE.location,    color: '#BE123C' },
          { icon: BookOpen, label: 'Library',  value: PROFILE.libraryName, color: 'var(--navy3)' },
        ].map(({ icon: Icon, label, value, color }, i, arr) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '15px 18px',
            borderBottom: i < arr.length - 1 ? '1px solid var(--border2)' : 'none',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon size={15} color={color} />
            </div>
            <div>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</p>
              <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginTop: 2 }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div style={{
        background: 'var(--white)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border2)' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Settings
          </p>
        </div>
        {[
          { icon: Bell,  label: 'Notifications', sub: 'Manage alerts',    color: 'var(--amber2)' },
          { icon: Moon,  label: 'Dark Mode',      sub: 'Coming soon',     color: 'var(--navy3)' },
          { icon: Shield,label: 'Privacy',        sub: 'Data & security', color: 'var(--green)' },
        ].map(({ icon: Icon, label, sub, color }, i, arr) => (
          <button
            key={label}
            style={{
              display: 'flex', alignItems: 'center', width: '100%',
              gap: 14, padding: '15px 18px',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border2)' : 'none',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', transition: 'background 0.12s',
              textAlign: 'left',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: 'var(--bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon size={15} color={color} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{sub}</p>
            </div>
            <ChevronRight size={15} color="var(--text-faint)" />
          </button>
        ))}
      </div>

      {/* Edit + Logout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          className="lib-btn lib-btn-primary"
          onClick={handleSave}
          style={{ justifyContent: 'center', width: '100%' }}
        >
          {saved ? <><CheckCircle size={15} /> Saved!</> : <><Edit size={15} /> Edit Profile</>}
        </button>
        <button
          className="lib-btn lib-btn-ghost"
          style={{ justifyContent: 'center', width: '100%', color: 'var(--red)', borderColor: 'rgba(239,68,68,0.25)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--red-light)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--white)'}
        >
          <LogOut size={15} /> Sign Out
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-faint)', paddingBottom: 4 }}>
        Member since {PROFILE.memberSince} · LibraryOS v2.0
      </p>

    </div>
  )
}