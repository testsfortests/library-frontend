import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Phone, Mail, IndianRupee, Calendar, CheckCircle, AlertCircle, ChevronLeft } from 'lucide-react'
import { studentAPI } from '../services/api'

const INITIAL = {
  name: '', phone: '', email: '',
  fee: '', enrollmentDate: new Date().toISOString().split('T')[0],
  status: 'active', address: '', notes: '',
}

export default function AddStudent() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    if (!form.name.trim())  return 'Name is required'
    if (!form.phone.trim()) return 'Phone is required'
    if (!/^[6-9]\d{9}$/.test(form.phone)) return 'Enter a valid 10-digit Indian mobile number'
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email'
    if (!form.fee || isNaN(form.fee) || +form.fee <= 0) return 'Enter a valid fee amount'
    return ''
  }

  const handleSubmit = async () => {
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setSaving(true)
    try {
      await studentAPI.create({ ...form, fee: +form.fee })
      setSuccess(true)
      setTimeout(() => navigate('/students'), 1500)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to add student. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (success) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '70vh', gap: 16, animation: 'fadeUp 0.3s ease both',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--green-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
        }}>
          <CheckCircle size={36} color="var(--green)" />
        </div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text-primary)' }}>
          Student Added!
        </p>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Redirecting to students list…</p>
      </div>
    )
  }

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 560 }}>

      {/* Back */}
      <button
        onClick={() => navigate('/students')}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)', padding: 0,
        }}
      >
        <ChevronLeft size={16} /> Back to Students
      </button>

      {/* Title */}
      <div>
        <h1 className="lib-section-title">Add New Student</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
          Fill in the details to enroll a new member
        </p>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'var(--red-light)', borderRadius: 12,
          padding: '12px 16px', border: '1px solid rgba(239,68,68,0.20)',
          animation: 'fadeUp 0.2s ease both',
        }}>
          <AlertCircle size={16} color="var(--red)" flexShrink={0} />
          <p style={{ fontSize: 13, color: '#991B1B', fontWeight: 500 }}>{error}</p>
        </div>
      )}

      {/* Form card */}
      <div style={{
        background: 'var(--white)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}>

        {/* Section: Personal Info */}
        <div style={{ padding: '18px 18px 0', borderBottom: '1px solid var(--border2)', paddingBottom: 18 }}>
          <p style={{
            fontSize: 11, fontWeight: 700, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 16,
          }}>Personal Information</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field icon={User} label="Full Name *" iconColor="var(--navy3)">
              <input
                className="lib-input"
                placeholder="e.g. Priya Sharma"
                value={form.name}
                onChange={e => set('name', e.target.value)}
              />
            </Field>

            <Field icon={Phone} label="Mobile Number *" iconColor="var(--green)">
              <input
                className="lib-input"
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                inputMode="numeric"
              />
            </Field>

            <Field icon={Mail} label="Email Address" iconColor="var(--amber2)">
              <input
                className="lib-input"
                placeholder="optional@email.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                type="email"
                inputMode="email"
              />
            </Field>
          </div>
        </div>

        {/* Section: Enrollment */}
        <div style={{ padding: '18px 18px' }}>
          <p style={{
            fontSize: 11, fontWeight: 700, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 16,
          }}>Enrollment Details</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field icon={IndianRupee} label="Fee Amount (₹) *" iconColor="#BE123C">
              <input
                className="lib-input"
                placeholder="e.g. 2000"
                value={form.fee}
                onChange={e => set('fee', e.target.value.replace(/\D/g, ''))}
                inputMode="numeric"
              />
            </Field>

            <Field icon={Calendar} label="Enrollment Date *" iconColor="var(--navy3)">
              <input
                className="lib-input"
                type="date"
                value={form.enrollmentDate}
                onChange={e => set('enrollmentDate', e.target.value)}
              />
            </Field>

            {/* Status */}
            <div>
              <label className="lib-label">Status</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {['active', 'pending', 'inactive'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set('status', s)}
                    style={{
                      padding: '10px 8px', borderRadius: 10,
                      border: form.status === s
                        ? `2px solid ${s === 'active' ? 'var(--green)' : s === 'pending' ? 'var(--amber)' : 'var(--red)'}`
                        : '1.5px solid var(--border)',
                      background: form.status === s
                        ? s === 'active' ? 'var(--green-light)' : s === 'pending' ? 'var(--amber-light)' : 'var(--red-light)'
                        : 'var(--bg)',
                      cursor: 'pointer', fontFamily: 'var(--font-body)',
                      fontSize: 12, fontWeight: 600, textTransform: 'capitalize',
                      color: form.status === s
                        ? s === 'active' ? '#065F46' : s === 'pending' ? '#92400E' : '#991B1B'
                        : 'var(--text-muted)',
                      transition: 'all 0.18s',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="lib-label">Notes (optional)</label>
              <textarea
                className="lib-input"
                placeholder="Any additional notes…"
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                rows={3}
                style={{ resize: 'vertical', minHeight: 80 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          className="lib-btn lib-btn-ghost"
          onClick={() => navigate('/students')}
          style={{ flex: 1 }}
        >
          Cancel
        </button>
        <button
          className="lib-btn lib-btn-primary"
          onClick={handleSubmit}
          disabled={saving}
          style={{ flex: 2, justifyContent: 'center', opacity: saving ? 0.7 : 1 }}
        >
          {saving ? 'Adding…' : 'Add Student'}
        </button>
      </div>

    </div>
  )
}

function Field({ icon: Icon, label, iconColor, children }) {
  return (
    <div>
      <label className="lib-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon size={12} color={iconColor} /> {label}
      </label>
      {children}
    </div>
  )
}