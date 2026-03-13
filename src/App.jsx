import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import AppRoutes from './routes/AppRoutes'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Navbar />

        <main style={{
          paddingTop: 'var(--nav-h)',
          paddingBottom: 'var(--bottom-h)',
          minHeight: '100vh',
        }}>
          <div style={{
            padding: '20px 16px',
            maxWidth: 680,
            margin: '0 auto',
          }}>
            <AppRoutes />
          </div>
        </main>

        <BottomNav />
      </div>
    </BrowserRouter>
  )
}