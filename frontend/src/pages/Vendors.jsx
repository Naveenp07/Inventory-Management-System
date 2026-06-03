import React, { useEffect, useState } from 'react'
import { getVendors, createVendor, updateVendor, deleteVendor } from '../api/vendorApi'
import { Plus, X, Edit2, Trash2, Building2 } from 'lucide-react'
import Loader from '../components/Loader'
import { useAuth } from '../context/AuthContext'

const emptyForm = { name: '', contactPerson: '', phone: '', email: '', address: '', website: '' }

export default function Vendors() {
  const { user } = useAuth()
  const canEdit = user?.role === 'ADMIN' || user?.role === 'MANAGER'
  const canDelete = user?.role === 'ADMIN'

  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editVendor, setEditVendor] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = () => { setLoading(true); getVendors().then(r => { setVendors(r.data); setLoading(false) }) }
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(emptyForm); setEditVendor(null); setError(''); setShowModal(true) }
  const openEdit = (v) => { setEditVendor(v); setForm({ name: v.name, contactPerson: v.contactPerson || '', phone: v.phone || '', email: v.email || '', address: v.address || '', website: v.website || '' }); setError(''); setShowModal(true) }

  const handleSave = async () => {
    if (!form.name) { setError('Vendor name is required'); return }
    setSaving(true); setError('')
    try {
      if (editVendor) await updateVendor(editVendor.id, form)
      else await createVendor(form)
      setShowModal(false); load()
    } catch (e) {
      setError(e.response?.data?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vendor?')) return
    await deleteVendor(id); load()
  }

  if (loading) return <Loader />

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Vendors</div>
          <div className="page-subtitle">{vendors.length} vendor(s) registered</div>
        </div>
        {canEdit && <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Add Vendor</button>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {vendors.length === 0 ? (
          <div className="empty-state"><Building2 size={40} /><h3>No vendors yet</h3></div>
        ) : vendors.map(v => (
          <div key={v.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, background: 'var(--accent-light)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={18} color="var(--accent)" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{v.name}</div>
                  {v.contactPerson && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{v.contactPerson}</div>}
                </div>
              </div>
              {canEdit && (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(v)}><Edit2 size={13} /></button>
                  {canDelete && <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(v.id)}><Trash2 size={13} /></button>}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 13, color: 'var(--text-secondary)' }}>
              {v.phone && <div>📞 {v.phone}</div>}
              {v.email && <div>✉️ {v.email}</div>}
              {v.address && <div>📍 {v.address}</div>}
              {v.website && <div>🌐 <a href={v.website} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>{v.website}</a></div>}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editVendor ? 'Edit Vendor' : 'Add Vendor'}</div>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              {error && <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '10px 12px', borderRadius: 8, fontSize: 13, marginBottom: 14 }}>{error}</div>}
              <div className="form-grid">
                <div className="form-group full"><label>Vendor Name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div className="form-group"><label>Contact Person</label><input value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} /></div>
                <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                <div className="form-group"><label>Website</label><input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} /></div>
                <div className="form-group full"><label>Address</label><textarea rows={2} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
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
