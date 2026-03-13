import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const studentAPI = {
  getAll:       (params = {}) => api.get('/students', { params }),
  getById:      (id)          => api.get(`/students/${id}`),
  create:       (data)        => api.post('/students', data),
  update:       (id, data)    => api.put(`/students/${id}`, data),
  delete:       (id)          => api.delete(`/students/${id}`),
  addPayment:   (id, payment) => api.post(`/students/${id}/payments`, payment),
  deletePayment:(id, payId)   => api.delete(`/students/${id}/payments/${payId}`),
}

/**
 * Payment helpers — work entirely on the student object (no extra API call needed)
 *
 * Student shape expected from API:
 * {
 *   _id, name, phone, email, status, admissionDate, dueDate,
 *   monthlyFee: Number,               // fixed monthly fee
 *   payments: [{ _id, amount, date, note }]  // list of all payments made
 * }
 */
export function totalPaid(student) {
  return (student.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0)
}

export function totalDue(student) {
  return Math.max(0, (student.monthlyFee || student.fee || 0) - totalPaid(student))
}

export default api