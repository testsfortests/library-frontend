import React from 'react'

// Vite: tries src/assets/logo.png first, then public/logo.png
// If neither exists at build time, falls back to "LJ" text
let logoSrc
try {
  logoSrc = new URL('../assets/logo.png', import.meta.url).href
} catch {
  logoSrc = '/logo.png'
}

export default function Logo({ size = 38, showText = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <img
        src={logoSrc}
        alt="LJ"
        onError={e => {
          // If image 404s, replace with LJ text badge
          e.target.replaceWith((() => {
            const d = document.createElement('div')
            d.textContent = 'LJ'
            Object.assign(d.style, {
              width: size + 'px', height: size + 'px',
              borderRadius: Math.round(size * 0.26) + 'px',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '700', color: '#0F1E35',
              fontSize: Math.round(size * 0.38) + 'px',
              flexShrink: '0',
            })
            return d
          })())
        }}
        style={{
          width: size, height: size,
          borderRadius: Math.round(size * 0.26),
          objectFit: 'contain', flexShrink: 0, display: 'block',
        }}
      />
      {showText && (
        <div>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: 16,
            color: '#fff', lineHeight: 1, whiteSpace: 'nowrap',
          }}>Library Junction</p>
          <p style={{
            fontSize: 9, color: 'rgba(255,255,255,0.30)',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            fontWeight: 600, marginTop: 3, whiteSpace: 'nowrap',
          }}>Management System</p>
        </div>
      )}
    </div>
  )
}