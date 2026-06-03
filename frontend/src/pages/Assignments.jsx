import React, { useEffect, useState } from 'react'
import { getAssignments, createAssignment, returnDevice } from '../api/assignmentApi'
import { getDevices } from '../api/deviceApi'
import { formatDate } from '../utils/helpers'
import { Plus, X, RotateCcw } from 'lucide-react'
import Loader from '../components/Loader'
import { useAuth } from '../context/AuthContext'

const emptyForm = { deviceId: '', assignedTo: '', employeeId: '', department: '', assignedDate: '', purpose: '' }

export default function Assignments() {
  const { user } = useAuth()
  const canEdit = user?.role === 'ADMIN' || user?.role === 'MANAGER'

  const [assignments, setAssignments] = useState([])
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('active')

  const load = () => {
    setLoading(true)
    Promise.all([getAssignments(), getDevices()]).then(([a, d]) => {
      setAssignments(a.data)
      setDevices(d.data.filter(dev => dev.status === 'AVAILABLE'))
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!form.deviceId || !form.assignedTo || !form.assignedDate) { setError('Device, Assigned To and Date are required'); return }
    setSaving(true); setError('')
    try {
      await createAssignment({ ...form, deviceId: Number(form.deviceId) })
      setShowModal(false); load()
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create assignment')
    } finally { setSaving(false) }
  }

  const handleReturn = async (id) => {
    if (!window.confirm('Mark this device as returned?')) return
    await returnDevice(id); load()
  }

  const filtered = assignments.filter(a => tab === 'active' ? a.active : !a.active)

  if (loading) return <Loader />

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Assignments</div>
          <div className="page-subtitle">Track device assignments to employees</div>
        </div>
        {canEdit && <button className="btn btn-primary" onClick={() => { setForm(emptyForm); setError(''); setShowModal(true) }}><Plus size={15} /> Assign Device</button>}
      </div>

      <div className="tabs">
        <button className={`tab${tab === 'active' ? ' active' : ''}`} onClick={() => setTab('active')}>Active</button>
        <button className={`tab${tab === 'history' ? ' active' : ''}`} onClick={() => setTab('history')}>History</button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Device</th><th>Asset Tag</th><th>Assigned To</th><th>Employee ID</th>
                <th>Department</th><th>Assigned Date</th><th>Return Date</th><th>Purpose</th>
                {canEdit && tab === 'active' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No assignments found</td></tr>
              ) : filtered.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 500 }}>{a.deviceName}</td>
                  <td><code style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--accent)' }}>{a.assetTag}</code></td>
                  <td>{a.assignedTo}</td>
                  <td>{a.employeeId || '-'}</td>
                  <td>{a.department || '-'}</td>
                  <td>{formatDate(a.assignedDate)}</td>
                  <td>{formatDate(a.returnDate)}</td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: 150 }}>{a.purpose || '-'}</td>
                  {canEdit && tab === 'active' && (
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleReturn(a.id)}>
                        <RotateCcw size={13} /> Return
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Assign Device</div>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              {error && <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '10px 12px', borderRadius: 8, fontSize: 13, marginBottom: 14 }}>{error}</div>}
              <div className="form-grid">
                <div className="form-group full">
                  <label>Device (Available Only) *</label>
                  <select value={form.deviceId} onChange={e => setForm({ ...form, deviceId: e.target.value })}>
                    <option value="">-- Select Device --</option>
                    {devices.map(d => <option key={d.id} value={d.id}>{d.assetTag} — {d.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Assigned To *</label>
                  <input value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })} placeholder="Employee full name" />
                </div>
                <div className="form-group">
                  <label>Employee ID</label>
                  <input value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })} placeholder="e.g. EMP-001" />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} placeholder="e.g. Finance" />
                </div>
                <div className="form-group">
                  <label>Assigned Date *</label>
                  <input type="date" value={form.assignedDate} onChange={e => setForm({ ...form, assignedDate: e.target.value })} />
                </div>
                <div className="form-group full">
                  <label>Purpose</label>
                  <input value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} placeholder="Reason for assignment" />
                </div>
              </div>
              <div className="form-actions" style={{ marginTop: 20 }}>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Assign'}</button>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
