import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as loginApi } from '../api/authApi'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!form.username || !form.password) { setError('Please enter username and password'); return }
    setLoading(true); setError('')
    try {
      const res = await loginApi(form)
      const { token, username, fullName, role } = res.data
      login(token, { username, fullName, role })
      navigate('/')
    } catch (e) {
      setError(e.response?.data?.message || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit() }

  return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            <div className="login-logo-icon">🖥️</div>
            <div className="login-title">Hardware Inventory</div>
            <div className="login-sub">Sign in to your account</div>
          </div>

          <div className="form-group" style={{ marginBottom: 14 }}>
            <label>Username</label>
            <input
                type="text"
                placeholder="Enter username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                onKeyDown={handleKey}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 18 }}>
            <label>Password</label>
            <input
                type="password"
                placeholder="Enter password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={handleKey}
            />
          </div>

          {error && (
              <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '10px 12px', borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
                {error}
              </div>
          )}

          <button className="login-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </div>
  )
}
