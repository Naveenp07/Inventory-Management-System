import React, { useEffect, useState } from 'react'
import { getDashboardStats, exportExcel, exportPdf } from '../api/reportApi'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { FileSpreadsheet, FileText } from 'lucide-react'
import Loader from '../components/Loader'

const COLORS = ['#6366f1','#22c55e','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#ec4899']

export default function Reports() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState('')

  useEffect(() => {
    getDashboardStats().then(r => { setStats(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const handleExcel = async () => { setDownloading('excel'); await exportExcel(); setDownloading('') }
  const handlePdf = async () => { setDownloading('pdf'); await exportPdf(); setDownloading('') }

  if (loading) return <Loader />

  const statusData = [
    { name: 'Available', value: Number(stats?.availableDevices || 0) },
    { name: 'Assigned', value: Number(stats?.assignedDevices || 0) },
    { name: 'Maintenance', value: Number(stats?.inMaintenanceDevices || 0) },
    { name: 'Retired', value: Number(stats?.retiredDevices || 0) },
  ].filter(d => d.value > 0)

  const categoryData = Object.entries(stats?.devicesByCategory || {}).map(([name, value]) => ({ name, value: Number(value) }))

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Reports</div>
          <div className="page-subtitle">Export and analyse inventory data</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-success" onClick={handleExcel} disabled={!!downloading}>
            <FileSpreadsheet size={15} /> {downloading === 'excel' ? 'Exporting...' : 'Export Excel'}
          </button>
          <button className="btn btn-secondary" onClick={handlePdf} disabled={!!downloading}>
            <FileText size={15} /> {downloading === 'pdf' ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Devices', value: stats?.totalDevices ?? 0 },
          { label: 'Available', value: stats?.availableDevices ?? 0 },
          { label: 'Assigned', value: stats?.assignedDevices ?? 0 },
          { label: 'In Maintenance', value: stats?.inMaintenanceDevices ?? 0 },
          { label: 'Active Assignments', value: stats?.activeAssignments ?? 0 },
          { label: 'Maintenance Logs', value: stats?.totalMaintenanceLogs ?? 0 },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent)' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="card">
          <div className="card-title">Status Distribution</div>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={95} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="empty-state"><p>No data</p></div>}
        </div>

        <div className="card">
          <div className="card-title">Devices by Category</div>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryData}>
                <XAxis dataKey="name" tick={{ fill: '#8b90a8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#8b90a8', fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#1e2130', border: '1px solid #2d3148', borderRadius: 8 }} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="empty-state"><p>No data</p></div>}
        </div>
      </div>
    </div>
  )
}
