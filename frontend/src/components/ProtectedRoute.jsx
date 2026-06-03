import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth()
  if (loading) return <div className="loader-wrap"><div className="spinner"></div></div>
  if (!token) return <Navigate to="/login" replace />
  return children
}
