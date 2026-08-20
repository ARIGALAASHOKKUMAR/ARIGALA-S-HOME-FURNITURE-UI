import axios from 'axios';

const myAxios = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '',
  headers: { 'Content-Type': 'application/json' }
});

// Attach Authorization header from localStorage if available
myAxios.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('woodhaven-token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {}
  return config;
}, (err) => Promise.reject(err));

export default myAxios;
