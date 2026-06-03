import React, { useEffect, useState } from 'react'
import { getMaintenanceLogs, createMaintenanceLog, updateMaintenanceLog, deleteMaintenanceLog } from '../api/maintenanceApi'
import { getDevices } from '../api/deviceApi'
import { formatDate, formatCurrency } from '../utils/helpers'
import { Plus, X, Edit2, Trash2 } from 'lucide-react'
import Loader from '../components/Loader'
import { useAuth } from '../context/AuthContext'

const TYPES = ['Repair', 'Upgrade', 'Cleaning', 'Inspection', 'Replacement']
const STATUSES = ['Pending', 'In Progress', 'Completed']
const emptyForm = { deviceId: '', maintenanceType: 'Repair', maintenanceDate: '', completionDate: '', technician: '', description: '', cost: '', status: 'Pending', resolution: '' }

export default function Maintenance() {
  const { user } = useAuth()
  const canEdit = user?.role === 'ADMIN' || user?.role === 'MANAGER'
  const canDelete = user?.role === 'ADMIN'

  const [logs, setLogs] = useState([])
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editLog, setEditLog] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([getMaintenanceLogs(), getDevices()]).then(([l, d]) => {
      setLogs(l.data); setDevices(d.data); setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(emptyForm); setEditLog(null); setError(''); setShowModal(true) }
  const openEdit = (l) => {
    setEditLog(l)
    setForm({ deviceId: l.deviceId, maintenanceType: l.maintenanceType, maintenanceDate: l.maintenanceDate || '', completionDate: l.completionDate || '', technician: l.technician || '', description: l.description || '', cost: l.cost || '', status: l.status || 'Pending', resolution: l.resolution || '' })
    setError(''); setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.deviceId || !form.maintenanceDate) { setError('Device and Date are required'); return }
    setSaving(true); setError('')
    try {
      const payload = { ...form, deviceId: Number(form.deviceId), cost: form.cost || null }
      if (editLog) await updateMaintenanceLog(editLog.id, payload)
      else await createMaintenanceLog(payload)
      setShowModal(false); load()
    } catch (e) {
      setError(e.response?.data?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this maintenance log?')) return
    await deleteMaintenanceLog(id); load()
  }

  const statusColor = { 'Pending': 'var(--warning)', 'In Progress': 'var(--info)', 'Completed': 'var(--success)' }

  if (loading) return <Loader />

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Maintenance</div>
          <div className="page-subtitle">{logs.length} maintenance log(s)</div>
        </div>
        {canEdit && <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Add Log</button>}
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Device</th><th>Type</th><th>Date</th><th>Technician</th>
                <th>Status</th><th>Cost</th><th>Description</th>{canEdit && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No logs found</td></tr>
              ) : logs.map(l => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 500 }}>{l.deviceName}<br /><code style={{ fontSize: 11, color: 'var(--accent)' }}>{l.assetTag}</code></td>
                  <td>{l.maintenanceType}</td>
                  <td>{formatDate(l.maintenanceDate)}</td>
                  <td>{l.technician || '-'}</td>
                  <td><span className="badge" style={{ background: `${statusColor[l.status]}22`, color: statusColor[l.status] }}>{l.status}</span></td>
                  <td>{formatCurrency(l.cost)}</td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.description || '-'}</td>
                  {canEdit && (
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(l)}><Edit2 size={13} /></button>
                        {canDelete && <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(l.id)}><Trash2 size={13} /></button>}
                      </div>
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
              <div className="modal-title">{editLog ? 'Edit Maintenance Log' : 'Add Maintenance Log'}</div>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              {error && <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '10px 12px', borderRadius: 8, fontSize: 13, marginBottom: 14 }}>{error}</div>}
              <div className="form-grid">
                <div className="form-group full">
                  <label>Device *</label>
                  <select value={form.deviceId} onChange={e => setForm({ ...form, deviceId: e.target.value })}>
                    <option value="">-- Select Device --</option>
                    {devices.map(d => <option key={d.id} value={d.id}>{d.assetTag} — {d.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select value={form.maintenanceType} onChange={e => setForm({ ...form, maintenanceType: e.target.value })}>
                    {TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Maintenance Date *</label>
                  <input type="date" value={form.maintenanceDate} onChange={e => setForm({ ...form, maintenanceDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Completion Date</label>
                  <input type="date" value={form.completionDate} onChange={e => setForm({ ...form, completionDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Technician</label>
                  <input value={form.technician} onChange={e => setForm({ ...form, technician: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Cost (₹)</label>
                  <input type="number" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} />
                </div>
                <div className="form-group full">
                  <label>Description</label>
                  <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="form-group full">
                  <label>Resolution</label>
                  <textarea rows={2} value={form.resolution} onChange={e => setForm({ ...form, resolution: e.target.value })} />
                </div>
              </div>
              <div className="form-actions" style={{ marginTop: 20 }}>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
