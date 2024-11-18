import axios from 'axios';

// Create an instance of axios with a base URL and default headers
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json' // Set the content type to JSON
    }
});

// Add a request interceptor to include the authentication token in the headers
api.interceptors.request.use(
    (config) => {
        // Retrieve the user object from local storage
        const user = JSON.parse(localStorage.getItem('user'));
        // Check if the user object has a token property
        if (user?.token) {
            // If the token exists, add it to the Authorization header
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        // Return the modified config
        return config;
    },
    (error) => {
        // If there's an error, reject the promise
        return Promise.reject(error);
    }
);

// Export the modified axios instance
export default api;