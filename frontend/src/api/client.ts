import axios from 'axios';

// In dev, Vite proxy handles /api -> http://localhost:8082.
// In prod, you can set VITE_API_BASE_URL to a full URL.
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('taskflow_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      // Token expired/invalid
      localStorage.removeItem('taskflow_token');
    }
    return Promise.reject(err);
  }
);
