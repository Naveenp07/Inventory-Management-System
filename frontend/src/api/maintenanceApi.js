import api from './axios'

export const getMaintenanceLogs = () => api.get('/maintenance')
export const createMaintenanceLog = (data) => api.post('/maintenance', data)
export const updateMaintenanceLog = (id, data) => api.put(`/maintenance/${id}`, data)
export const deleteMaintenanceLog = (id) => api.delete(`/maintenance/${id}`)
