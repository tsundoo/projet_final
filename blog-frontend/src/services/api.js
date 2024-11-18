import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor for adding auth token
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

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle specific error cases
            switch (error.response.status) {
                case 401:
                    // Unauthorized - clear local storage and redirect to login
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    break;
                case 403:
                    // Forbidden
                    console.error('Access forbidden');
                    break;
                case 404:
                    // Not found
                    console.error('Resource not found');
                    break;
                case 500:
                    // Server error
                    console.error('Server error');
                    break;
                default:
                    console.error('An error occurred');
            }
        } else if (error.request) {
            // Network error
            console.error('Network error');
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export const endpoints = {
    // Auth endpoints
    login: '/api/users/login',
    register: '/api/users/register',
    
    // Posts endpoints
    posts: '/api/posts',
    post: (id) => `/api/posts/${id}`,
    
    // Comments endpoints
    comments: '/api/comments',
    comment: (id) => `/api/comments/${id}`,
};

export default api;