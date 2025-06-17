import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://blog-application-web-service.onrender.com/api'
});

// Add a request interceptor
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

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only handle 401 errors for authenticated requests (not login attempts)
        if (error.response?.status === 401 && error.config.url !== '/auth/login') {
            // Token is invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            // Use window.location.href only for token expiration
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api; 