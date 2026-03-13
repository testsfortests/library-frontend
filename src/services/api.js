import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach auth token if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor — handle 401
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
  getAll:    (params = {}) => api.get('/students', { params }),
  getById:   (id)          => api.get(`/students/${id}`),
  create:    (data)        => api.post('/students', data),
  update:    (id, data)    => api.put(`/students/${id}`, data),
  delete:    (id)          => api.delete(`/students/${id}`),
  search:    (q)           => api.get('/students/search', { params: { q } }),
}

export default api