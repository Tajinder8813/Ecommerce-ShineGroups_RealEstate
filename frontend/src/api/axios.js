import axios from 'axios';

// Create base Axios instance pointing to  FastAPI server
const api = axios.create({
  baseURL: 'https://ecommerce-shinegroups-realestate-backend.onrender.com', // Update this to match  FastAPI dev port
  timeout: 10000, //10 seconds
});

// Request Interceptor: Automatically injects JWT Token into headers if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//  Axios Interceptor for Global 401 Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error happened during a login attempt
    const isLoginRequest = error.config?.url?.endsWith('/token') || error.config?.url?.endsWith('/forgot-password');
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');  

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
