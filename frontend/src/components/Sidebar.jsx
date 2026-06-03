import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Monitor, Users, Wrench, ShieldCheck,
  Building2, BarChart3, LogOut
} from 'lucide-react'

const navItems = [
  { to: '/', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
  { to: '/devices', icon: <Monitor size={16} />, label: 'Devices' },
  { to: '/assignments', icon: <Users size={16} />, label: 'Assignments' },
  { to: '/maintenance', icon: <Wrench size={16} />, label: 'Maintenance' },
  { to: '/warranty', icon: <ShieldCheck size={16} />, label: 'Warranty' },
  { to: '/vendors', icon: <Building2 size={16} />, label: 'Vendors' },
  { to: '/reports', icon: <BarChart3 size={16} />, label: 'Reports' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🖥️</div>
        <div>
          <div className="sidebar-logo-text">HW Inventory</div>
          <div className="sidebar-logo-sub">Management System</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">Main Menu</div>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.fullName?.[0] || 'U'}</div>
          <div>
            <div className="user-name">{user?.fullName}</div>
            <div className="user-role">{user?.role?.toLowerCase()}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={15} /> Logout
        </button>
      </div>
    </div>
  )
}
