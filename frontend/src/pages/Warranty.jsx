import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { formatDate } from '../utils/helpers'
import { ShieldCheck, ShieldX } from 'lucide-react'
import Loader from '../components/Loader'

export default function Warranty() {
  const [warranties, setWarranties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/warranties').then(r => { setWarranties(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const today = new Date()
  const isExpired = (endDate) => endDate && new Date(endDate) < today
  const isExpiringSoon = (endDate) => {
    if (!endDate) return false
    const d = new Date(endDate)
    const diff = (d - today) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 90
  }

  if (loading) return <Loader />

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Warranty</div>
          <div className="page-subtitle">{warranties.length} warranty record(s)</div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Device</th><th>Asset Tag</th><th>Provider</th><th>Type</th>
                <th>Start Date</th><th>End Date</th><th>Contract #</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {warranties.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No warranty records found</td></tr>
              ) : warranties.map(w => {
                const expired = isExpired(w.endDate)
                const soon = isExpiringSoon(w.endDate)
                return (
                  <tr key={w.id}>
                    <td style={{ fontWeight: 500 }}>{w.deviceName}</td>
                    <td><code style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--accent)' }}>{w.assetTag}</code></td>
                    <td>{w.warrantyProvider}</td>
                    <td>{w.warrantyType || '-'}</td>
                    <td>{formatDate(w.startDate)}</td>
                    <td>{formatDate(w.endDate)}</td>
                    <td>{w.contractNumber || '-'}</td>
                    <td>
                      {expired
                        ? <span className="badge" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}><ShieldX size={11} style={{ marginRight: 4 }} />Expired</span>
                        : soon
                          ? <span className="badge" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>Expiring Soon</span>
                          : <span className="badge" style={{ background: 'var(--success-light)', color: 'var(--success)' }}><ShieldCheck size={11} style={{ marginRight: 4 }} />Active</span>
                      }
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
