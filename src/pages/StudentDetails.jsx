import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Phone, Mail, Calendar, IndianRupee,
  Edit, Trash2, AlertTriangle, Plus, X, CheckCircle,
} from 'lucide-react'
import { studentAPI, totalPaid, totalDue } from '../services/api'

const MOCK = {
  _id: '1', name: 'Priya Sharma', phone: '9876543210',
  email: 'priya@example.com', status: 'active',
  admissionDate: '2024-03-01', dueDate: '2025-03-31',
  monthlyFee: 2000,
  payments: [
    { _id: 'p1', amount: 1000, date: '2025-03-01', note: 'First instalment' },
    { _id: 'p2', amount: 600,  date: '2025-03-10', note: '' },
  ],
}

function initials(name = '') {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const TODAY = new Date().toISOString().split('T')[0]

export default function StudentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent]         = useState(null)
  const [loading, setLoading]         = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting]       = useState(false)

  /* add-payment modal state */
  const [payModal, setPayModal]       = useState(false)
  const [payAmount, setPayAmount]     = useState('')
  const [payDate, setPayDate]         = useState(TODAY)
  const [payNote, setPayNote]         = useState('')
  const [payLoading, setPayLoading]   = useState(false)
  const [paySuccess, setPaySuccess]   = useState(false)

  useEffect(() => {
    studentAPI.getById(id)
      .then(res => setStudent(res?.data || MOCK))
      .catch(() => setStudent(MOCK))
      .finally(() => setLoading(false))
  }, [id])

  const paid    = student ? totalPaid(student) : 0
  const due     = student ? totalDue(student)  : 0
  const fee     = student ? (student.monthlyFee || student.fee || 0) : 0
  const paidPct = fee > 0 ? Math.min(100, (paid / fee) * 100) : 0

  /* ── Add payment ── */
  const handleAddPayment = async () => {
    const amt = parseFloat(payAmount)
    if (!amt || amt <= 0) return
    setPayLoading(true)
    try {
      const res = await studentAPI.addPayment(id, { amount: amt, date: payDate, note: payNote })
      // update local state with returned student or manually push
      if (res?.data) {
        setStudent(res.data)
      } else {
        setStudent(prev => ({
          ...prev,
          payments: [...(prev.payments || []), { _id: Date.now().toString(), amount: amt, date: payDate, note: payNote }],
        }))
      }
      setPaySuccess(true)
      setTimeout(() => { setPayModal(false); setPaySuccess(false); setPayAmount(''); setPayNote(''); setPayDate(TODAY) }, 1200)
    } catch {
      // optimistic update
      setStudent(prev => ({
        ...prev,
        payments: [...(prev.payments || []), { _id: Date.now().toString(), amount: amt, date: payDate, note: payNote }],
      }))
      setPaySuccess(true)
      setTimeout(() => { setPayModal(false); setPaySuccess(false); setPayAmount(''); setPayNote(''); setPayDate(TODAY) }, 1200)
    } finally {
      setPayLoading(false)
    }
  }

  /* ── Delete student ── */
  const handleDelete = async () => {
    setDeleting(true)
    try {
      await studentAPI.delete(id)
      navigate('/students')
    } catch { setDeleting(false); setConfirmDelete(false) }
  }

  /* ── Delete single payment ── */
  const handleDeletePayment = async (payId) => {
    try {
      await studentAPI.deletePayment(id, payId)
    } catch {}
    setStudent(prev => ({ ...prev, payments: prev.payments.filter(p => p._id !== payId) }))
  }

  /* ─── Loading skeleton ─── */
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="lib-skeleton" style={{ height: 22, width: 100, borderRadius: 8 }} />
      <div className="lib-skeleton" style={{ height: 120, borderRadius: 20 }} />
      {[1,2,3].map(i => <div key={i} className="lib-skeleton" style={{ height: 56, borderRadius: 12 }} />)}
    </div>
  )

  if (!student) return null

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 560 }}>

      {/* Back */}
      <button onClick={() => navigate('/students')} style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)',
        fontFamily: 'var(--font-body)', padding: 0,
      }}>
        <ChevronLeft size={16} /> Back
      </button>

      {/* ── Profile header ── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy3) 100%)',
        borderRadius: 'var(--radius-xl)', padding: '22px 20px',
        display: 'flex', gap: 16, alignItems: 'center',
        boxShadow: 'var(--shadow-lg)', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -20, top: -20, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div className="lib-avatar" style={{
          width: 60, height: 60, fontSize: 20, borderRadius: 16, flexShrink: 0,
          background: 'linear-gradient(135deg, #1E3557, #2A4570)',
          border: '2px solid rgba(255,255,255,0.15)',
        }}>{initials(student.name)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#fff', lineHeight: 1.2 }}>
            {student.name}
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{student.phone}</p>
          <span className={`lib-badge ${
            student.status === 'active' ? 'lib-badge-active'
            : student.status === 'pending' ? 'lib-badge-pending'
            : 'lib-badge-inactive'
          }`} style={{ marginTop: 8 }}>{student.status}</span>
        </div>
      </div>

      {/* ── Fee summary card ── */}
      <div style={{
        background: 'var(--white)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', padding: '18px 18px 16px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--text-primary)' }}>Fee Summary</p>
          <button
            className="lib-btn lib-btn-primary"
            onClick={() => setPayModal(true)}
            style={{ padding: '8px 14px', fontSize: 12 }}
          >
            <Plus size={13} /> Add Payment
          </button>
        </div>

        {/* 3 numbers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
          {[
            { label: 'Monthly Fee', value: `₹${fee.toLocaleString()}`, color: 'var(--navy3)',  bg: 'var(--navy-light)' },
            { label: 'Total Paid',  value: `₹${paid.toLocaleString()}`, color: '#065F46',       bg: '#D1FAE5' },
            { label: 'Due',         value: `₹${due.toLocaleString()}`,  color: due > 0 ? '#991B1B' : '#065F46', bg: due > 0 ? '#FEE2E2' : '#D1FAE5' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} style={{ background: bg, borderRadius: 10, padding: '10px 10px 8px', textAlign: 'center' }}>
              <p style={{ fontSize: 9, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4 }}>{label}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ height: 8, background: 'var(--bg2)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 99,
            width: `${paidPct}%`,
            background: due === 0 ? 'var(--green)' : paid > 0 ? 'linear-gradient(90deg, var(--amber), var(--green))' : 'var(--red)',
            transition: 'width 0.7s ease',
          }} />
        </div>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 5, textAlign: 'right' }}>
          {paidPct.toFixed(0)}% paid
        </p>
      </div>

      {/* ── Payment history ── */}
      <div style={{
        background: 'var(--white)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border2)', background: 'var(--bg)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--text-primary)' }}>
            Payment History
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            {(student.payments || []).length} payment{(student.payments || []).length !== 1 ? 's' : ''} recorded
          </p>
        </div>

        {(!student.payments || student.payments.length === 0) ? (
          <div style={{ padding: '32px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No payments recorded yet</p>
          </div>
        ) : (
          [...student.payments]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((p, i, arr) => (
              <div key={p._id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '13px 18px',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border2)' : 'none',
              }}>
                {/* Green circle */}
                <div style={{
                  width: 36, height: 36, borderRadius: 11, flexShrink: 0,
                  background: '#D1FAE5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <IndianRupee size={15} color="#065F46" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                    ₹{p.amount.toLocaleString()}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {fmtDate(p.date)}{p.note ? ` · ${p.note}` : ''}
                  </p>
                </div>
                <button
                  onClick={() => handleDeletePayment(p._id)}
                  className="lib-btn-icon"
                  style={{ color: 'var(--text-faint)', flexShrink: 0 }}
                >
                  <X size={14} />
                </button>
              </div>
            ))
        )}
      </div>

      {/* ── Basic info ── */}
      <div style={{
        background: 'var(--white)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
      }}>
        {[
          { icon: Mail,     label: 'Email',      value: student.email || '—',    color: 'var(--amber2)' },
          { icon: Calendar, label: 'Admission',  value: fmtDate(student.admissionDate), color: 'var(--navy3)' },
          { icon: Calendar, label: 'Due Date',   value: fmtDate(student.dueDate),       color: '#BE123C' },
        ].map(({ icon: Icon, label, value, color }, i, arr) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', gap: 13,
            padding: '14px 18px',
            borderBottom: i < arr.length - 1 ? '1px solid var(--border2)' : 'none',
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={15} color={color} />
            </div>
            <div>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Actions ── */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="lib-btn lib-btn-ghost" onClick={() => navigate(`/students/${id}/edit`)} style={{ flex: 1, justifyContent: 'center' }}>
          <Edit size={14} /> Edit
        </button>
        <button className="lib-btn lib-btn-danger" onClick={() => setConfirmDelete(true)} style={{ flex: 1, justifyContent: 'center' }}>
          <Trash2 size={14} /> Delete
        </button>
      </div>

      {/* ── Add Payment Modal ── */}
      {payModal && (
        <>
          <div onClick={() => { if (!payLoading) setPayModal(false) }} style={{ position: 'fixed', inset: 0, background: 'rgba(15,30,53,0.50)', zIndex: 100, animation: 'fadeIn 0.2s ease' }} />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: 'var(--white)', borderRadius: '22px 22px 0 0',
            padding: '24px 20px 36px', zIndex: 101,
            animation: 'fadeUp 0.28s cubic-bezier(0.22,1,0.36,1) both',
            boxShadow: '0 -8px 40px rgba(15,30,53,0.18)',
          }}>
            {paySuccess ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '20px 0' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pop 0.3s cubic-bezier(0.34,1.56,0.64,1) both' }}>
                  <CheckCircle size={30} color="#065F46" />
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-primary)' }}>Payment Recorded!</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-primary)' }}>Add Payment</p>
                  <button className="lib-btn-icon" onClick={() => setPayModal(false)}><X size={16} /></button>
                </div>

                {/* Due reminder */}
                {due > 0 && (
                  <div style={{ background: '#FEF3C7', borderRadius: 10, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertTriangle size={14} color="#92400E" style={{ flexShrink: 0 }} />
                    <p style={{ fontSize: 12, color: '#92400E', fontWeight: 600 }}>
                      ₹{due.toLocaleString()} still due this month
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Amount */}
                  <div>
                    <label className="lib-label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <IndianRupee size={11} color="#BE123C" /> Amount (₹) *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: 'var(--text-muted)', fontWeight: 600, pointerEvents: 'none' }}>₹</span>
                      <input
                        className="lib-input"
                        style={{ paddingLeft: 30 }}
                        placeholder={`Max ₹${due > 0 ? due.toLocaleString() : fee.toLocaleString()}`}
                        value={payAmount}
                        onChange={e => setPayAmount(e.target.value.replace(/\D/g, ''))}
                        inputMode="numeric"
                        autoFocus
                      />
                    </div>
                    {/* Quick fill buttons */}
                    {due > 0 && (
                      <div style={{ display: 'flex', gap: 7, marginTop: 8 }}>
                        {[due, Math.ceil(due / 2)].filter(v => v > 0).map(v => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setPayAmount(String(v))}
                            style={{
                              padding: '5px 12px', borderRadius: 99, fontSize: 11, fontWeight: 600,
                              background: 'var(--navy-light)', color: 'var(--navy3)',
                              border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
                            }}
                          >₹{v.toLocaleString()}</button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <label className="lib-label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Calendar size={11} color="var(--navy3)" /> Payment Date
                    </label>
                    <input className="lib-input" type="date" value={payDate} onChange={e => setPayDate(e.target.value)} />
                  </div>

                  {/* Note */}
                  <div>
                    <label className="lib-label">Note <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></label>
                    <input className="lib-input" placeholder="e.g. Cash payment, UPI…" value={payNote} onChange={e => setPayNote(e.target.value)} />
                  </div>

                  <button
                    className="lib-btn lib-btn-primary"
                    onClick={handleAddPayment}
                    disabled={!payAmount || payLoading}
                    style={{ justifyContent: 'center', opacity: (!payAmount || payLoading) ? 0.6 : 1 }}
                  >
                    {payLoading ? 'Saving…' : 'Save Payment'}
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* ── Delete confirm ── */}
      {confirmDelete && (
        <>
          <div onClick={() => setConfirmDelete(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,30,53,0.50)', zIndex: 100, animation: 'fadeIn 0.2s ease' }} />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: 'var(--white)', borderRadius: '24px 24px 0 0',
            padding: '28px 22px 40px', zIndex: 101,
            animation: 'fadeUp 0.28s cubic-bezier(0.22,1,0.36,1) both',
            boxShadow: '0 -8px 40px rgba(15,30,53,0.18)',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'var(--red-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={24} color="var(--red)" />
              </div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-primary)', textAlign: 'center' }}>Delete Student?</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                This will permanently remove <strong>{student.name}</strong> and all payment records.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="lib-btn lib-btn-ghost" onClick={() => setConfirmDelete(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button className="lib-btn lib-btn-danger" onClick={handleDelete} disabled={deleting} style={{ flex: 1, justifyContent: 'center', opacity: deleting ? 0.7 : 1 }}>
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  )
}