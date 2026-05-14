import axios from 'axios';

// ============================================
// BASE URL
// This is where your FastAPI backend lives
// When we deploy, this will change to the
// production URL on Render
// ============================================
const API_URL = 'https://finsight-amc4.onrender.com';

// ============================================
// AXIOS INSTANCE
// Creates a reusable axios object with the
// base URL already set so we don't have to
// type the full URL every time
// ============================================
const api = axios.create({
  baseURL: API_URL,
});

// ============================================
// REQUEST INTERCEPTOR
// Before every request, this automatically
// grabs the JWT token from localStorage and
// adds it to the request header
// So we don't have to manually add it every time
// ============================================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;