import axios from 'axios'
import store from '../store'

const API_BASE = import.meta.env.VITE_API_BASE || [
  "https://swiggy-backend-fyo3.onrender.com",
  "http://localhost:5000"
]

// ARRAY se ek STRING nikalo
const BASE_URL = Array.isArray(API_BASE)
  ? window.location.hostname === "localhost"
    ? API_BASE[1]   // http://localhost:5000
    : API_BASE[0]   // https://swiggy-backend-fyo3.onrender.com
  : API_BASE

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
})

// attach token
api.interceptors.request.use(
  config => {
    const state = store.getState()
    const token = state.auth.token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  err => Promise.reject(err)
)

export default api
