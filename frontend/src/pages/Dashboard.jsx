import React, { useEffect, useState } from 'react'
import { getDashboardStats } from '../api/reportApi'
import { Monitor, Users, Wrench, CheckCircle, AlertCircle, Package } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import Loader from '../components/Loader'

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899']

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats().then(r => { setStats(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <Loader />
  if (!stats) return <div className="empty-state"><h3>Could not load stats</h3></div>

  const statusData = [
    { name: 'Available', value: Number(stats.availableDevices || 0) },
    { name: 'Assigned', value: Number(stats.assignedDevices || 0) },
    { name: 'Maintenance', value: Number(stats.inMaintenanceDevices || 0) },
    { name: 'Retired', value: Number(stats.retiredDevices || 0) },
  ].filter(d => d.value > 0)

  const categoryData = Object.entries(stats.devicesByCategory || {}).map(([name, value]) => ({ name, value: Number(value) }))

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Hardware inventory overview</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-light)' }}><Monitor size={22} color="var(--accent)" /></div>
          <div><div className="stat-value">{stats.totalDevices ?? 0}</div><div className="stat-label">Total Devices</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-light)' }}><CheckCircle size={22} color="var(--success)" /></div>
          <div><div className="stat-value">{stats.availableDevices ?? 0}</div><div className="stat-label">Available</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--info-light)' }}><Users size={22} color="var(--info)" /></div>
          <div><div className="stat-value">{stats.assignedDevices ?? 0}</div><div className="stat-label">Assigned</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning-light)' }}><Wrench size={22} color="var(--warning)" /></div>
          <div><div className="stat-value">{stats.inMaintenanceDevices ?? 0}</div><div className="stat-label">In Maintenance</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-light)' }}><Package size={22} color="var(--accent)" /></div>
          <div><div className="stat-value">{stats.activeAssignments ?? 0}</div><div className="stat-label">Active Assignments</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--danger-light)' }}><AlertCircle size={22} color="var(--danger)" /></div>
          <div><div className="stat-value">{stats.totalMaintenanceLogs ?? 0}</div><div className="stat-label">Maintenance Logs</div></div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card">
          <div className="card-title">Devices by Status</div>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={85} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="empty-state"><p>No data yet</p></div>}
        </div>

        <div className="card">
          <div className="card-title">Devices by Category</div>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={categoryData}>
                <XAxis dataKey="name" tick={{ fill: '#8b90a8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#8b90a8', fontSize: 12 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#1e2130', border: '1px solid #2d3148', borderRadius: 8 }} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="empty-state"><p>No data yet</p></div>}
        </div>
      </div>
    </div>
  )
}
