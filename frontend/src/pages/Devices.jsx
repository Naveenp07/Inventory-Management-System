import React, { useEffect, useState } from 'react'
import { getDevices, createDevice, updateDevice, deleteDevice, searchDevices } from '../api/deviceApi'
import { getVendors } from '../api/vendorApi'
import { statusBadge, conditionBadge, formatDate, formatCurrency } from '../utils/helpers'
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react'
import Loader from '../components/Loader'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = ['Laptop','Desktop','Monitor','Printer','Scanner','Server','Switch','Router','UPS','Keyboard','Mouse','Webcam','Headset','Projector','Other']
const STATUSES = ['AVAILABLE','ASSIGNED','IN_MAINTENANCE','RETIRED','LOST']
const CONDITIONS = ['NEW','GOOD','FAIR','POOR','DAMAGED']

const emptyForm = {
  assetTag:'', name:'', category:'Laptop', brand:'', model:'', serialNumber:'',
  processor:'', ram:'', storage:'', operatingSystem:'', macAddress:'', ipAddress:'',
  status:'AVAILABLE', condition:'NEW', purchaseDate:'', purchasePrice:'', warrantyExpiry:'',
  notes:'', vendorId:'', locationId:''
}

export default function Devices() {
  const { user } = useAuth()
  const canEdit = user?.role === 'ADMIN' || user?.role === 'MANAGER'
  const canDelete = user?.role === 'ADMIN'

  const [devices, setDevices] = useState([])
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editDevice, setEditDevice] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([getDevices(), getVendors()]).then(([d, v]) => {
      setDevices(d.data); setVendors(v.data); setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSearch = async (val) => {
    setSearch(val)
    if (val.length > 1) {
      const res = await searchDevices(val)
      setDevices(res.data)
    } else if (val.length === 0) {
      load()
    }
  }

  const openAdd = () => { setForm(emptyForm); setEditDevice(null); setError(''); setShowModal(true) }
  const openEdit = (d) => {
    setEditDevice(d)
    setForm({
      assetTag: d.assetTag, name: d.name, category: d.category, brand: d.brand || '',
      model: d.model || '', serialNumber: d.serialNumber || '', processor: d.processor || '',
      ram: d.ram || '', storage: d.storage || '', operatingSystem: d.operatingSystem || '',
      macAddress: d.macAddress || '', ipAddress: d.ipAddress || '',
      status: d.status, condition: d.condition,
      purchaseDate: d.purchaseDate || '', purchasePrice: d.purchasePrice || '',
      warrantyExpiry: d.warrantyExpiry || '', notes: d.notes || '',
      vendorId: d.vendorId || '', locationId: d.locationId || ''
    })
    setError(''); setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.assetTag || !form.name || !form.category) { setError('Asset Tag, Name and Category are required'); return }
    setSaving(true); setError('')
    try {
      const payload = { ...form, purchasePrice: form.purchasePrice || null, vendorId: form.vendorId || null, locationId: form.locationId || null }
      if (editDevice) await updateDevice(editDevice.id, payload)
      else await createDevice(payload)
      setShowModal(false); load()
    } catch (e) {
      setError(e.response?.data?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this device?')) return
    await deleteDevice(id); load()
  }

  const filtered = filterStatus ? devices.filter(d => d.status === filterStatus) : devices

  if (loading) return <Loader />

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Devices</div>
          <div className="page-subtitle">{filtered.length} device(s) found</div>
        </div>
        {canEdit && <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Add Device</button>}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="filter-row">
          <div className="search-bar">
            <Search size={15} />
            <input placeholder="Search by name, asset tag, serial..." value={search} onChange={e => handleSearch(e.target.value)} />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ minWidth: 160 }}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Asset Tag</th><th>Name</th><th>Category</th><th>Brand/Model</th>
                <th>Status</th><th>Condition</th><th>Purchase Date</th><th>Price</th>
                <th>Vendor</th>{canEdit && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No devices found</td></tr>
              ) : filtered.map(d => (
                <tr key={d.id}>
                  <td><code style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--accent)' }}>{d.assetTag}</code></td>
                  <td style={{ fontWeight: 500 }}>{d.name}</td>
                  <td>{d.category}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{[d.brand, d.model].filter(Boolean).join(' / ') || '-'}</td>
                  <td><span className={statusBadge(d.status)}>{d.status?.replace('_', ' ')}</span></td>
                  <td><span className={conditionBadge(d.condition)}>{d.condition}</span></td>
                  <td>{formatDate(d.purchaseDate)}</td>
                  <td>{formatCurrency(d.purchasePrice)}</td>
                  <td>{d.vendorName || '-'}</td>
                  {canEdit && (
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(d)}><Edit2 size={13} /></button>
                        {canDelete && <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(d.id)}><Trash2 size={13} /></button>}
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
              <div className="modal-title">{editDevice ? 'Edit Device' : 'Add New Device'}</div>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              {error && <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '10px 12px', borderRadius: 8, fontSize: 13, marginBottom: 14 }}>{error}</div>}
              <div className="form-grid">
                <div className="form-group">
                  <label>Asset Tag *</label>
                  <input value={form.assetTag} onChange={e => setForm({ ...form, assetTag: e.target.value })} placeholder="e.g. HW-001" disabled={!!editDevice} />
                </div>
                <div className="form-group">
                  <label>Device Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Dell Laptop - Finance" />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Brand</label>
                  <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="e.g. Dell" />
                </div>
                <div className="form-group">
                  <label>Model</label>
                  <input value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} placeholder="e.g. Latitude 5540" />
                </div>
                <div className="form-group">
                  <label>Serial Number</label>
                  <input value={form.serialNumber} onChange={e => setForm({ ...form, serialNumber: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Processor</label>
                  <input value={form.processor} onChange={e => setForm({ ...form, processor: e.target.value })} placeholder="e.g. Intel Core i5" />
                </div>
                <div className="form-group">
                  <label>RAM</label>
                  <input value={form.ram} onChange={e => setForm({ ...form, ram: e.target.value })} placeholder="e.g. 16GB DDR4" />
                </div>
                <div className="form-group">
                  <label>Storage</label>
                  <input value={form.storage} onChange={e => setForm({ ...form, storage: e.target.value })} placeholder="e.g. 512GB SSD" />
                </div>
                <div className="form-group">
                  <label>Operating System</label>
                  <input value={form.operatingSystem} onChange={e => setForm({ ...form, operatingSystem: e.target.value })} placeholder="e.g. Windows 11 Pro" />
                </div>
                <div className="form-group">
                  <label>MAC Address</label>
                  <input value={form.macAddress} onChange={e => setForm({ ...form, macAddress: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>IP Address</label>
                  <input value={form.ipAddress} onChange={e => setForm({ ...form, ipAddress: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Condition</label>
                  <select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}>
                    {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Purchase Date</label>
                  <input type="date" value={form.purchaseDate} onChange={e => setForm({ ...form, purchaseDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Purchase Price (₹)</label>
                  <input type="number" value={form.purchasePrice} onChange={e => setForm({ ...form, purchasePrice: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Warranty Expiry</label>
                  <input type="date" value={form.warrantyExpiry} onChange={e => setForm({ ...form, warrantyExpiry: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Vendor</label>
                  <select value={form.vendorId} onChange={e => setForm({ ...form, vendorId: e.target.value })}>
                    <option value="">-- Select Vendor --</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <div className="form-group full">
                  <label>Notes</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} />
                </div>
              </div>
              <div className="form-actions" style={{ marginTop: 20 }}>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Device'}</button>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
