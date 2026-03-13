import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User, Phone, IndianRupee, Calendar, CheckCircle,
  AlertCircle, ChevronLeft, Camera, Upload, X,
  FileText, ScanLine, Image, Plus,
} from 'lucide-react'
import { studentAPI } from '../services/api'

const TODAY = new Date().toISOString().split('T')[0]

const INITIAL = {
  name: '',
  phone: '',
  fee: '1000',
  admissionDate: TODAY,
  status: 'active',
  notes: '',
}

/* ─── tiny helpers ─── */
function readFileAsDataURL(file) {
  return new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(r.result)
    r.onerror = rej
    r.readAsDataURL(file)
  })
}

function FileSizeLabel({ bytes }) {
  if (!bytes) return null
  const kb = (bytes / 1024).toFixed(1)
  return <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{kb} KB</span>
}

/* ─── Photo Upload / Scan block ─── */
function PhotoField({ value, onChange }) {
  const fileRef = useRef()
  const videoRef = useRef()
  const canvasRef = useRef()
  const [scanning, setScanning] = useState(false)
  const [stream, setStream] = useState(null)

  const handleFile = async (e) => {
    const f = e.target.files[0]
    if (!f) return
    const url = await readFileAsDataURL(f)
    onChange({ url, name: f.name, size: f.size })
  }

  const startScan = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      setStream(s)
      setScanning(true)
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = s
      }, 100)
    } catch {
      alert('Camera access denied or not available.')
    }
  }

  const capture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    const url = canvas.toDataURL('image/jpeg', 0.85)
    onChange({ url, name: 'photo-capture.jpg', size: 0 })
    stopScan()
  }

  const stopScan = () => {
    stream?.getTracks().forEach(t => t.stop())
    setStream(null)
    setScanning(false)
  }

  return (
    <div>
      <Label icon={Camera} color="var(--amber2)">Photo</Label>

      {scanning ? (
        <div style={{
          borderRadius: 'var(--radius)', overflow: 'hidden',
          border: '2px solid var(--amber)', position: 'relative',
        }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%', display: 'block', maxHeight: 240, objectFit: 'cover' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div style={{ display: 'flex', gap: 8, padding: 10 }}>
            <button type="button" className="lib-btn lib-btn-amber" onClick={capture} style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>
              <Camera size={14} /> Capture
            </button>
            <button type="button" className="lib-btn lib-btn-ghost" onClick={stopScan} style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>
              Cancel
            </button>
          </div>
        </div>
      ) : value ? (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 12px', borderRadius: 'var(--radius-sm)',
          border: '1.5px solid var(--border)', background: 'var(--bg)',
        }}>
          <img src={value.url} alt="student" style={{ width: 54, height: 54, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value.name}</p>
            <FileSizeLabel bytes={value.size} />
          </div>
          <button type="button" className="lib-btn-icon" onClick={() => onChange(null)}>
            <X size={15} />
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button
            type="button"
            onClick={() => fileRef.current.click()}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
              padding: '16px 8px', borderRadius: 'var(--radius-sm)',
              border: '1.5px dashed var(--border)',
              background: 'var(--bg)', cursor: 'pointer',
              fontFamily: 'var(--font-body)', transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--navy3)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--navy-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Upload size={16} color="var(--navy3)" />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Upload</span>
          </button>

          <button
            type="button"
            onClick={startScan}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
              padding: '16px 8px', borderRadius: 'var(--radius-sm)',
              border: '1.5px dashed var(--border)',
              background: 'var(--bg)', cursor: 'pointer',
              fontFamily: 'var(--font-body)', transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--amber2)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--amber-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ScanLine size={16} color="var(--amber2)" />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Scan / Camera</span>
          </button>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  )
}

/* ─── Identity Proof multi-upload / scan block ─── */
function IdProofField({ files, onChange }) {
  const fileRef = useRef()
  const videoRef = useRef()
  const canvasRef = useRef()
  const [scanning, setScanning] = useState(false)
  const [stream, setStream] = useState(null)

  const addFiles = async (fileList) => {
    const results = await Promise.all(
      Array.from(fileList).map(async f => ({
        url: await readFileAsDataURL(f),
        name: f.name,
        size: f.size,
        type: f.type,
      }))
    )
    onChange([...files, ...results])
  }

  const handleInput = (e) => addFiles(e.target.files)

  const remove = (idx) => onChange(files.filter((_, i) => i !== idx))

  const startScan = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      setStream(s)
      setScanning(true)
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = s }, 100)
    } catch {
      alert('Camera access denied.')
    }
  }

  const capture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    const url = canvas.toDataURL('image/jpeg', 0.85)
    onChange([...files, { url, name: `id-scan-${Date.now()}.jpg`, size: 0, type: 'image/jpeg' }])
    stopScan()
  }

  const stopScan = () => {
    stream?.getTracks().forEach(t => t.stop())
    setStream(null)
    setScanning(false)
  }

  const isPdf = (f) => f.type === 'application/pdf' || f.name.endsWith('.pdf')

  return (
    <div>
      <Label icon={FileText} color="#BE123C" required>
        Identity Proof
      </Label>
      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, marginTop: -2 }}>
        Upload multiple documents (Aadhaar, PAN, etc.)
      </p>

      {/* Uploaded files list */}
      {files.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
          {files.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'var(--bg)',
            }}>
              {isPdf(f) ? (
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={16} color="#BE123C" />
                </div>
              ) : (
                <img src={f.url} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</p>
                <FileSizeLabel bytes={f.size} />
              </div>
              <button type="button" className="lib-btn-icon" onClick={() => remove(i)} style={{ color: 'var(--red)' }}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Camera view */}
      {scanning && (
        <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', border: '2px solid var(--red)', marginBottom: 10 }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%', display: 'block', maxHeight: 220, objectFit: 'cover' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div style={{ display: 'flex', gap: 8, padding: 10 }}>
            <button type="button" className="lib-btn lib-btn-danger" onClick={capture} style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>
              <Camera size={14} /> Capture
            </button>
            <button type="button" className="lib-btn lib-btn-ghost" onClick={stopScan} style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Add more buttons */}
      {!scanning && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button
            type="button"
            onClick={() => fileRef.current.click()}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              padding: '13px 8px', borderRadius: 'var(--radius-sm)',
              border: '1.5px dashed var(--border)',
              background: 'var(--bg)', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
              color: 'var(--text-secondary)', transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#BE123C'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <Plus size={14} color="#BE123C" />
            {files.length > 0 ? 'Add More' : 'Upload'}
          </button>

          <button
            type="button"
            onClick={startScan}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              padding: '13px 8px', borderRadius: 'var(--radius-sm)',
              border: '1.5px dashed var(--border)',
              background: 'var(--bg)', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
              color: 'var(--text-secondary)', transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--amber2)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <ScanLine size={14} color="var(--amber2)" />
            Scan Doc
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*,application/pdf"
        multiple
        style={{ display: 'none' }}
        onChange={handleInput}
      />
    </div>
  )
}

/* ─── Label helper ─── */
function Label({ icon: Icon, color, required, children }) {
  return (
    <label className="lib-label" style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
      {Icon && <Icon size={11} color={color} />}
      {children}
      {required && <span style={{ color: 'var(--red)', marginLeft: 1 }}>*</span>}
    </label>
  )
}

/* ─── Main Component ─── */
export default function AddStudent() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL)
  const [photo, setPhoto] = useState(null)
  const [idProofs, setIdProofs] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    if (!form.name.trim())  return 'Full name is required'
    if (!form.phone.trim()) return 'Mobile number is required'
    if (!/^[6-9]\d{9}$/.test(form.phone)) return 'Enter a valid 10-digit Indian mobile number'
    if (!form.fee || isNaN(form.fee) || +form.fee < 0) return 'Enter a valid fee amount'
    if (idProofs.length === 0) return 'At least one identity proof document is required'
    return ''
  }

  const handleSubmit = async () => {
    const err = validate()
    if (err) { setError(err); window.scrollTo({ top: 0, behavior: 'smooth' }); return }
    setError('')
    setSaving(true)
    try {
      await studentAPI.create({
        ...form,
        fee: +form.fee,
        photo: photo?.url || null,
        idProofs: idProofs.map(f => ({ name: f.name, url: f.url })),
      })
      setSuccess(true)
      setTimeout(() => navigate('/students'), 1600)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to add student. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  /* ── Success screen ── */
  if (success) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '70vh', gap: 14, animation: 'fadeUp 0.3s ease both',
      }}>
        <div style={{
          width: 76, height: 76, borderRadius: '50%', background: 'var(--green-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
        }}>
          <CheckCircle size={38} color="var(--green)" />
        </div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--text-primary)' }}>
          Student Added!
        </p>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Redirecting to students list…</p>
      </div>
    )
  }

  /* ── Form ── */
  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 560, paddingBottom: 16 }}>

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

      {/* Error banner */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          background: 'var(--red-light)', borderRadius: 12,
          padding: '12px 15px', border: '1px solid rgba(239,68,68,0.20)',
          animation: 'fadeUp 0.2s ease both',
        }}>
          <AlertCircle size={16} color="var(--red)" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 13, color: '#991B1B', fontWeight: 500 }}>{error}</p>
        </div>
      )}

      {/* ── Section 1: Personal Info ── */}
      <Section title="Personal Information">
        {/* Full Name */}
        <div>
          <Label icon={User} color="var(--navy3)" required>Full Name</Label>
          <input
            className="lib-input"
            placeholder="e.g. Priya Sharma"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            autoComplete="name"
          />
        </div>

        {/* Mobile Number */}
        <div>
          <Label icon={Phone} color="var(--green)" required>Mobile Number</Label>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
              fontSize: 14, color: 'var(--text-muted)', fontWeight: 500, pointerEvents: 'none',
            }}>+91</span>
            <input
              className="lib-input"
              style={{ paddingLeft: 44 }}
              placeholder="9876543210"
              value={form.phone}
              onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              inputMode="numeric"
              maxLength={10}
            />
          </div>
        </div>

        {/* Photo */}
        <PhotoField value={photo} onChange={setPhoto} />
      </Section>

      {/* ── Section 2: Enrollment Details ── */}
      <Section title="Enrollment Details">
        {/* Fee */}
        <div>
          <Label icon={IndianRupee} color="#BE123C" required>Monthly Fee (₹)</Label>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
              fontSize: 15, color: 'var(--text-muted)', fontWeight: 600, pointerEvents: 'none',
            }}>₹</span>
            <input
              className="lib-input"
              style={{ paddingLeft: 32 }}
              placeholder="1000"
              value={form.fee}
              onChange={e => set('fee', e.target.value.replace(/\D/g, ''))}
              inputMode="numeric"
            />
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5 }}>Default: ₹1,000/month</p>
        </div>

        {/* Admission Date */}
        <div>
          <Label icon={Calendar} color="var(--navy3)" required>Admission Date</Label>
          <input
            className="lib-input"
            type="date"
            value={form.admissionDate}
            onChange={e => set('admissionDate', e.target.value)}
          />
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5 }}>Default: Today</p>
        </div>

        {/* Status */}
        <div>
          <Label required>Status</Label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { val: 'active',   label: '● Active',   active: '#065F46', activeBg: 'var(--green-light)', border: 'var(--green)' },
              { val: 'pending',  label: '◐ Pending',  active: '#92400E', activeBg: 'var(--amber-light)', border: 'var(--amber)' },
              { val: 'inactive', label: '○ Inactive', active: '#991B1B', activeBg: 'var(--red-light)',   border: 'var(--red)' },
            ].map(({ val, label, active, activeBg, border }) => (
              <button
                key={val}
                type="button"
                onClick={() => set('status', val)}
                style={{
                  padding: '10px 6px', borderRadius: 10, cursor: 'pointer',
                  border: form.status === val ? `2px solid ${border}` : '1.5px solid var(--border)',
                  background: form.status === val ? activeBg : 'var(--bg)',
                  fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
                  color: form.status === val ? active : 'var(--text-muted)',
                  transition: 'all 0.18s',
                }}
              >{label}</button>
            ))}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5 }}>Default: Active</p>
        </div>
      </Section>

      {/* ── Section 3: Identity Proof ── */}
      <Section title="Documents">
        <IdProofField files={idProofs} onChange={setIdProofs} />

        {/* Notes */}
        <div>
          <Label>Notes <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--text-muted)' }}>(optional)</span></Label>
          <textarea
            className="lib-input"
            placeholder="e.g. Prefers morning shift, paid advance…"
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            rows={3}
            style={{ resize: 'vertical', minHeight: 80 }}
          />
        </div>
      </Section>

      {/* ── Summary strip ── */}
      <div style={{
        background: 'var(--navy-light)',
        borderRadius: 'var(--radius-sm)',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 8,
      }}>
        {[
          { label: 'Fee', value: `₹${(+form.fee || 0).toLocaleString()}/mo` },
          { label: 'From', value: form.admissionDate ? new Date(form.admissionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' },
          { label: 'Docs', value: `${idProofs.length} uploaded` },
        ].map(({ label, value }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy3)', marginTop: 2 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Actions ── */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          className="lib-btn lib-btn-ghost"
          onClick={() => navigate('/students')}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          Cancel
        </button>
        <button
          className="lib-btn lib-btn-primary"
          onClick={handleSubmit}
          disabled={saving}
          style={{ flex: 2, justifyContent: 'center', opacity: saving ? 0.7 : 1 }}
        >
          {saving ? 'Enrolling…' : 'Enroll Student'}
        </button>
      </div>

    </div>
  )
}

/* ─── Section wrapper ─── */
function Section({ title, children }) {
  return (
    <div style={{
      background: 'var(--white)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{
        padding: '13px 18px',
        borderBottom: '1px solid var(--border2)',
        background: 'var(--bg)',
      }}>
        <p style={{
          fontSize: 10, fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.6px',
        }}>{title}</p>
      </div>
      <div style={{ padding: '18px 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {children}
      </div>
    </div>
  )
}