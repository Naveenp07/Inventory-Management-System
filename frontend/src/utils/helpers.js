export const statusBadge = (status) => {
  const map = {
    AVAILABLE: 'badge badge-available',
    ASSIGNED: 'badge badge-assigned',
    IN_MAINTENANCE: 'badge badge-maintenance',
    RETIRED: 'badge badge-retired',
    LOST: 'badge badge-lost',
  }
  return map[status] || 'badge'
}

export const conditionBadge = (condition) => {
  const map = {
    NEW: 'badge badge-new',
    GOOD: 'badge badge-good',
    FAIR: 'badge badge-fair',
    POOR: 'badge badge-poor',
    DAMAGED: 'badge badge-damaged',
  }
  return map[condition] || 'badge'
}

export const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const formatCurrency = (amount) => {
  if (!amount) return '-'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}
