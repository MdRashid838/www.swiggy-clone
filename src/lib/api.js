import axios from 'axios'
import store from '../store'

const API_BASE = import.meta.env.VITE_API_BASE || 'https://swiggy-backend-fyo3.onrender.com'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
})

// attach token
api.interceptors.request.use(config => {
  const state = store.getState()
  const token = state.auth.token
  if(token) config.headers.Authorization = `Bearer ${token}`
  return config
}, err => Promise.reject(err))

export default api
