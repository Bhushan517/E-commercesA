import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:4001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT auth token
api.interceptors.request.use(
  (config) => {
    // Add JWT token if available
    const token = localStorage.getItem('token');
    if (token && token !== 'dummy-token') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle JWT token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle JWT token expiration and unauthorized access
    if (error.response?.status === 401) {
      // Unauthorized - clear stored data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect to login page
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
