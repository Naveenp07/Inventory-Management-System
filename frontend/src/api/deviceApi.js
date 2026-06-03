import api from './axios'

export const getDevices = () => api.get('/devices')
export const getDevice = (id) => api.get(`/devices/${id}`)
export const createDevice = (data) => api.post('/devices', data)
export const updateDevice = (id, data) => api.put(`/devices/${id}`, data)
export const deleteDevice = (id) => api.delete(`/devices/${id}`)
export const searchDevices = (keyword) => api.get(`/devices/search?keyword=${keyword}`)
export const getDevicesByStatus = (status) => api.get(`/devices/status/${status}`)
export const getDevicesByCategory = (cat) => api.get(`/devices/category/${cat}`)
