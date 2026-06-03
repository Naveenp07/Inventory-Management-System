import api from './axios'

export const getAssignments = () => api.get('/assignments')
export const getActiveAssignments = () => api.get('/assignments/active')
export const createAssignment = (data) => api.post('/assignments', data)
export const returnDevice = (id) => api.put(`/assignments/${id}/return`)
