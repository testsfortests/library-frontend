import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const themes = {
  navy: {
    bg: 'linear-gradient(135deg, var(--navy3), var(--navy))',
    iconBg: 'rgba(255,255,255,0.12)',
    iconColor: '#fff',
    textColor: '#fff',
    subColor: 'rgba(255,255,255,0.60)',
    trendColor: 'rgba(255,255,255,0.80)',
    dark: true,
  },
  amber: {
    bg: 'linear-gradient(135deg, #F59E0B, #D97706)',
    iconBg: 'rgba(255,255,255,0.20)',
    iconColor: 'var(--navy)',
    textColor: 'var(--navy)',
    subColor: 'rgba(15,30,53,0.55)',
    trendColor: 'rgba(15,30,53,0.70)',
    dark: false,
  },
  green: {
    bg: 'linear-gradient(135deg, #059669, #047857)',
    iconBg: 'rgba(255,255,255,0.12)',
    iconColor: '#fff',
    textColor: '#fff',
    subColor: 'rgba(255,255,255,0.60)',
    trendColor: 'rgba(255,255,255,0.80)',
    dark: true,
  },
  white: {
    bg: 'var(--white)',
    iconBg: 'var(--navy-light)',
    iconColor: 'var(--navy3)',
    textColor: 'var(--text-primary)',
    subColor: 'var(--text-muted)',
    trendColor: 'var(--text-secondary)',
    dark: false,
  },
  red: {
    bg: 'linear-gradient(135deg, #EF4444, #DC2626)',
    iconBg: 'rgba(255,255,255,0.15)',
    iconColor: '#fff',
    textColor: '#fff',
    subColor: 'rgba(255,255,255,0.60)',
    trendColor: 'rgba(255,255,255,0.80)',
    dark: true,
  },
}

export default function StudentCard({ title, value, subtitle, icon: Icon, color = 'white', trend, trendLabel }) {
  const t = themes[color] || themes.white
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  return (
    <div style={{
      background: t.bg,
      borderRadius: 'var(--radius-lg)',
      padding: '22px 20px',
      border: t.dark ? 'none' : '1px solid var(--border)',
      boxShadow: t.dark ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      position: 'relative', overflow: 'hidden',
      animation: 'fadeUp 0.3s ease both',
    }}>
      {/* Decorative circle */}
      <div style={{
        position: 'absolute', right: -20, top: -20,
        width: 100, height: 100, borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 10, bottom: -30,
        width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(255,255,255,0.04)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: t.subColor, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 8 }}>
            {title}
          </p>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 30, fontWeight: 700,
            color: t.textColor, lineHeight: 1,
            letterSpacing: '-0.5px',
          }}>{value}</p>
          {subtitle && (
            <p style={{ fontSize: 12, color: t.subColor, marginTop: 5 }}>{subtitle}</p>
          )}
          {trendLabel && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              marginTop: 10, fontSize: 11, fontWeight: 600,
              color: t.trendColor,
            }}>
              <TrendIcon size={11} />
              <span>{trendLabel}</span>
            </div>
          )}
        </div>

        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: t.iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginLeft: 12,
        }}>
          <Icon size={20} color={t.iconColor} strokeWidth={2} />
        </div>
      </div>
    </div>
  )
}