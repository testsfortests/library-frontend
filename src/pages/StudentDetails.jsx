import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Phone, Mail, Calendar, IndianRupee, Edit, Trash2, AlertTriangle } from 'lucide-react'
import { studentAPI } from '../services/api'

const MOCK = {
  _id: '1', name: 'Priya Sharma', phone: '9876543210',
  email: 'priya@example.com', fee: 2000,
  enrollmentDate: '2024-03-01', status: 'active',
  address: '12, MG Road, Jaipur', notes: 'Prefers morning shift.',
}

const avatarColors = ['#1E3557','#2A4570']

function initials(name = '') {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

export default function StudentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    studentAPI.getById(id)
      .then(res => setStudent(res?.data || MOCK))
      .catch(() => setStudent(MOCK))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await studentAPI.delete(id)
      navigate('/students')
    } catch {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <div className="lib-skeleton" style={{ height: 24, width: 120, marginBottom: 24 }} />
        <div style={{ background: 'var(--white)', borderRadius: 20, padding: 24 }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <div className="lib-skeleton" style={{ width: 64, height: 64, borderRadius: 18 }} />
            <div style={{ flex: 1 }}>
              <div className="lib-skeleton" style={{ height: 18, width: '60%', marginBottom: 10 }} />
              <div className="lib-skeleton" style={{ height: 13, width: '40%' }} />
            </div>
          </div>
          {[1,2,3,4].map(i => <div key={i} className="lib-skeleton" style={{ height: 52, borderRadius: 12, marginBottom: 10 }} />)}
        </div>
      </div>
    )
  }

  if (!student) return null

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 560 }}>

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
        <ChevronLeft size={16} /> Back
      </button>

      {/* Profile header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy3) 100%)',
        borderRadius: 'var(--radius-xl)', padding: '24px 22px',
        display: 'flex', gap: 18, alignItems: 'center',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div className="lib-avatar" style={{
          width: 64, height: 64, fontSize: 22, borderRadius: 18, flexShrink: 0,
          background: `linear-gradient(135deg, ${avatarColors[0]}, ${avatarColors[1]})`,
          border: '2px solid rgba(255,255,255,0.15)',
        }}>
          {initials(student.name)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#fff', lineHeight: 1.2 }}>
            {student.name}
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.50)', marginTop: 5 }}>ID: {student._id}</p>
          <span className={`lib-badge ${
            student.status === 'active' ? 'lib-badge-active'
            : student.status === 'pending' ? 'lib-badge-pending'
            : 'lib-badge-inactive'
          }`} style={{ marginTop: 8 }}>
            {student.status}
          </span>
        </div>
      </div>

      {/* Details */}
      <div style={{
        background: 'var(--white)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
      }}>
        {[
          { icon: Phone,        label: 'Phone',    value: student.phone,                    color: 'var(--green)' },
          { icon: Mail,         label: 'Email',    value: student.email || '—',              color: 'var(--amber2)' },
          { icon: IndianRupee,  label: 'Fee',      value: `₹${student.fee?.toLocaleString()}`, color: '#BE123C' },
          { icon: Calendar,     label: 'Enrolled', value: new Date(student.enrollmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), color: 'var(--navy3)' },
        ].map(({ icon: Icon, label, value, color }, i, arr) => (
          <div
            key={label}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '16px 18px',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border2)' : 'none',
            }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: 'var(--bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon size={16} color={color} />
            </div>
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>{value}</p>
            </div>
          </div>
        ))}

        {student.notes && (
          <div style={{ padding: '16px 18px', background: 'var(--amber-pale)', borderTop: '1px solid var(--border2)' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 6 }}>Notes</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{student.notes}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          className="lib-btn lib-btn-ghost"
          onClick={() => navigate(`/students/${id}/edit`)}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <Edit size={14} /> Edit
        </button>
        <button
          className="lib-btn lib-btn-danger"
          onClick={() => setConfirmDelete(true)}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>

      {/* Delete confirm overlay */}
      {confirmDelete && (
        <>
          <div
            onClick={() => setConfirmDelete(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,30,53,0.50)', zIndex: 100, animation: 'fadeIn 0.2s ease' }}
          />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: 'var(--white)', borderRadius: '24px 24px 0 0',
            padding: '28px 24px 40px', zIndex: 101,
            animation: 'fadeUp 0.28s cubic-bezier(0.22,1,0.36,1) both',
            boxShadow: '0 -8px 40px rgba(15,30,53,0.18)',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'var(--red-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <AlertTriangle size={26} color="var(--red)" />
              </div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-primary)', textAlign: 'center' }}>
                Delete Student?
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                This will permanently remove <strong>{student.name}</strong> and all associated data.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="lib-btn lib-btn-ghost" onClick={() => setConfirmDelete(false)} style={{ flex: 1, justifyContent: 'center' }}>
                Cancel
              </button>
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