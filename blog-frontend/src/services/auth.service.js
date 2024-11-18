import api from '../utils/axios.config';

export const authService = {
    async register(userData) {
        // This function sends a POST request to the '/users/register' endpoint with the provided userData.
        // It then returns the data from the response.
        const response = await api.post('/users/register', userData);
        return response.data;
    },

    async login(credentials) {
        // This function sends a POST request to the '/users/login' endpoint with the provided credentials.
        // It then logs the response data to the console for debugging purposes and returns the response data.
        const response = await api.post('/users/login', credentials);
        console.log('Auth service response:', response.data); // This line logs the response data to the console for debugging purposes.
        return response.data;
    }
};