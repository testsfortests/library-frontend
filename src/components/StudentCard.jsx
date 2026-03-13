import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const themes = {
  navy: {
    bg: 'linear-gradient(135deg, var(--navy3), var(--navy))',
    iconBg: 'rgba(255,255,255,0.13)',
    iconColor: '#fff',
    textColor: '#fff',
    subColor: 'rgba(255,255,255,0.60)',
    trendColor: 'rgba(255,255,255,0.80)',
    dark: true,
  },
  amber: {
    bg: 'linear-gradient(135deg, #F59E0B, #D97706)',
    iconBg: 'rgba(255,255,255,0.22)',
    iconColor: 'var(--navy)',
    textColor: 'var(--navy)',
    subColor: 'rgba(15,30,53,0.55)',
    trendColor: 'rgba(15,30,53,0.70)',
    dark: false,
  },
  green: {
    bg: 'linear-gradient(135deg, #059669, #047857)',
    iconBg: 'rgba(255,255,255,0.13)',
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
      borderRadius: 'var(--radius)',
      padding: '14px 12px',
      border: t.dark ? 'none' : '1px solid var(--border)',
      boxShadow: t.dark ? 'var(--shadow)' : 'var(--shadow-sm)',
      position: 'relative',
      overflow: 'hidden',
      animation: 'fadeUp 0.3s ease both',
      minWidth: 0,
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Decorative bg circle */}
      <div style={{
        position: 'absolute', right: -14, top: -14,
        width: 64, height: 64, borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)',
        pointerEvents: 'none',
      }} />

      {/* Icon */}
      <div style={{
        width: 32, height: 32, borderRadius: 9,
        background: t.iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 10, flexShrink: 0,
      }}>
        <Icon size={15} color={t.iconColor} strokeWidth={2} />
      </div>

      {/* Label */}
      <p style={{
        fontSize: 10, fontWeight: 600,
        color: t.subColor,
        textTransform: 'uppercase',
        letterSpacing: '0.35px',
        marginBottom: 3,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {title}
      </p>

      {/* Value */}
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: 20,
        fontWeight: 700,
        color: t.textColor,
        lineHeight: 1.1,
        letterSpacing: '-0.2px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {value}
      </p>

      {/* Trend label */}
      {trendLabel && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 3,
          marginTop: 6, fontSize: 10, fontWeight: 600,
          color: t.trendColor,
        }}>
          <TrendIcon size={10} />
          <span style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {trendLabel}
          </span>
        </div>
      )}
    </div>
  )
}