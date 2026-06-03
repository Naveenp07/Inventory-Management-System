import api from './axios'

export const getDashboardStats = () => api.get('/reports/dashboard')

export const exportExcel = async () => {
  const res = await api.get('/reports/export/excel', { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([res.data]))
  const a = document.createElement('a')
  a.href = url
  a.download = 'devices-report.xlsx'
  a.click()
  window.URL.revokeObjectURL(url)
}

export const exportPdf = async () => {
  const res = await api.get('/reports/export/pdf', { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'devices-report.pdf'
  a.click()
  window.URL.revokeObjectURL(url)
}
