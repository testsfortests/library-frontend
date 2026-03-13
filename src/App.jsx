import React, { useState, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import AppRoutes from './routes/AppRoutes'
import './index.css'

export default function App() {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const sidebarWidth = isMobile ? 0 : collapsed ? 72 : 250

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Sidebar
          className="lib-sidebar"
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
        />

        <Navbar
          className="lib-navbar"
          sidebarWidth={sidebarWidth}
        />

        <main style={{
          marginLeft: sidebarWidth,
          paddingTop: 'var(--nav-h)',
          paddingBottom: isMobile ? 'var(--bottom-h)' : 0,
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
        }}>
          <div style={{
            padding: isMobile ? '20px 16px' : '28px 32px',
            maxWidth: 1120,
            margin: '0 auto',
          }}>
            <AppRoutes />
          </div>
        </main>

        <BottomNav className="lib-bottom-nav" />
      </div>
    </BrowserRouter>
  )
}