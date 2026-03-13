import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, User, Phone, Mail, IndianRupee, Calendar, CheckCircle, AlertCircle } from 'lucide-react'
import { studentAPI } from '../services/api'

export default function EditStudent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    studentAPI.getById(id)
      .then(res => {
        const s = res?.data
        if (s) setForm({
          name: s.name || '', phone: s.phone || '',
          email: s.email || '', fee: s.fee?.toString() || '',
          enrollmentDate: s.enrollmentDate?.split('T')[0] || '',
          status: s.status || 'active', notes: s.notes || '',
        })
      })
      .catch(() => setForm({
        name: 'Priya Sharma', phone: '9876543210', email: 'priya@example.com',
        fee: '2000', enrollmentDate: '2024-03-01', status: 'active', notes: '',
      }))
  }, [id])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    if (!form.name.trim())  return 'Name is required'
    if (!form.phone.trim()) return 'Phone is required'
    if (!/^[6-9]\d{9}$/.test(form.phone)) return 'Enter a valid 10-digit mobile number'
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email'
    if (!form.fee || isNaN(form.fee) || +form.fee <= 0) return 'Enter a valid fee amount'
    return ''
  }

  const handleSave = async () => {
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setSaving(true)
    try {
      await studentAPI.update(id, { ...form, fee: +form.fee })
      setSuccess(true)
      setTimeout(() => navigate(`/students/${id}`), 1400)
    } catch (e) {
      setError(e?.response?.data?.message || 'Update failed. Try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!form) {
    return (
      <div style={{ padding: 20 }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} className="lib-skeleton" style={{ height: 52, borderRadius: 12, marginBottom: 12 }} />
        ))}
      </div>
    )
  }

  if (success) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '70vh', gap: 16, animation: 'fadeUp 0.3s ease both',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', background: 'var(--green-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
        }}>
          <CheckCircle size={36} color="var(--green)" />
        </div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text-primary)' }}>Changes Saved!</p>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Redirecting…</p>
      </div>
    )
  }

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 560 }}>

      <button
        onClick={() => navigate(`/students/${id}`)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)', padding: 0,
        }}
      >
        <ChevronLeft size={16} /> Back
      </button>

      <div>
        <h1 className="lib-section-title">Edit Student</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Update student information</p>
      </div>

      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'var(--red-light)', borderRadius: 12,
          padding: '12px 16px', border: '1px solid rgba(239,68,68,0.20)',
        }}>
          <AlertCircle size={16} color="var(--red)" />
          <p style={{ fontSize: 13, color: '#991B1B', fontWeight: 500 }}>{error}</p>
        </div>
      )}

      <div style={{
        background: 'var(--white)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ padding: '18px 18px 0', paddingBottom: 18, borderBottom: '1px solid var(--border2)' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 16 }}>Personal Info</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field icon={User} label="Full Name *" iconColor="var(--navy3)">
              <input className="lib-input" placeholder="Full name" value={form.name} onChange={e => set('name', e.target.value)} />
            </Field>
            <Field icon={Phone} label="Mobile Number *" iconColor="var(--green)">
              <input className="lib-input" placeholder="10-digit number" value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g,'').slice(0,10))} inputMode="numeric" />
            </Field>
            <Field icon={Mail} label="Email" iconColor="var(--amber2)">
              <input className="lib-input" placeholder="email@example.com" value={form.email} onChange={e => set('email', e.target.value)} type="email" />
            </Field>
          </div>
        </div>

        <div style={{ padding: 18 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 16 }}>Enrollment</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field icon={IndianRupee} label="Fee (₹) *" iconColor="#BE123C">
              <input className="lib-input" placeholder="Amount" value={form.fee} onChange={e => set('fee', e.target.value.replace(/\D/g,''))} inputMode="numeric" />
            </Field>
            <Field icon={Calendar} label="Enrollment Date" iconColor="var(--navy3)">
              <input className="lib-input" type="date" value={form.enrollmentDate} onChange={e => set('enrollmentDate', e.target.value)} />
            </Field>
            <div>
              <label className="lib-label">Status</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {['active','pending','inactive'].map(s => (
                  <button key={s} type="button" onClick={() => set('status', s)} style={{
                    padding: '10px 8px', borderRadius: 10, cursor: 'pointer',
                    border: form.status === s
                      ? `2px solid ${s==='active'?'var(--green)':s==='pending'?'var(--amber)':'var(--red)'}`
                      : '1.5px solid var(--border)',
                    background: form.status === s
                      ? s==='active'?'var(--green-light)':s==='pending'?'var(--amber-light)':'var(--red-light)'
                      : 'var(--bg)',
                    fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, textTransform: 'capitalize',
                    color: form.status === s
                      ? s==='active'?'#065F46':s==='pending'?'#92400E':'#991B1B'
                      : 'var(--text-muted)',
                    transition: 'all 0.18s',
                  }}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="lib-btn lib-btn-ghost" onClick={() => navigate(`/students/${id}`)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
        <button className="lib-btn lib-btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 2, justifyContent: 'center', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Saving…' : 'Save Changes'}
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