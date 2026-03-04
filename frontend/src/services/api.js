import axios from 'axios';

// Use environment variable or fallback to deployed backend URL for production
const API_URL = import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD
        ? 'https://leetcodetracker-b.onrender.com/api'
        : '/api');

console.log('API URL configured:', API_URL);
console.log('Environment:', import.meta.env.PROD ? 'Production' : 'Development');

// Add request interceptor for debugging
axios.interceptors.request.use(request => {
    console.log('Starting Request:', request.method?.toUpperCase(), request.url);
    return request;
});

// Add response interceptor for debugging
axios.interceptors.response.use(
    response => {
        console.log('Response received:', response.status, response.data);
        return response;
    },
    error => {
        console.error('API Error:', error.response?.status, error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const addUser = async (username) => {
    try {
        const response = await axios.post(`${API_URL}/users`, {
            leetcodeUsername: username
        });
        return response.data;
    } catch (error) {
        console.error('Error in addUser API call:', error);
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        console.log('Fetching all users...');
        const response = await axios.get(`${API_URL}/users`);
        console.log('Raw response data:', response.data);

        // Handle the new response structure that includes count and users array
        if (response.data && typeof response.data === 'object') {
            // If response has users property (new format), return that
            if (Array.isArray(response.data.users)) {
                console.log('Using new response format with users array');
                return response.data.users;
            }
            // If response is directly an array (old format), return it
            if (Array.isArray(response.data)) {
                console.log('Using old response format (direct array)');
                return response.data;
            }
        }

        console.warn('Unexpected response format, returning empty array');
        return [];
    } catch (error) {
        console.error('Error in getAllUsers API call:', error);
        return []; // Return empty array on error to prevent crashes
    }
};

export const refreshUser = async (username) => {
    try {
        const response = await axios.put(`${API_URL}/users/${username}/refresh`);
        return response.data;
    } catch (error) {
        console.error('Error in refreshUser API call:', error);
        throw error;
    }
};

export const deleteUser = async (username) => {
    try {
        const response = await axios.delete(`${API_URL}/users/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error in deleteUser API call:', error);
        throw error;
    }
};
