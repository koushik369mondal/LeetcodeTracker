import axios from 'axios';

const API_URL = '/api';

export const addUser = async (username) => {
    const response = await axios.post(`${API_URL}/users`, {
        leetcodeUsername: username
    });
    return response.data;
};

export const getAllUsers = async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
};

export const refreshUser = async (username) => {
    const response = await axios.put(`${API_URL}/users/${username}/refresh`);
    return response.data;
};

export const deleteUser = async (username) => {
    const response = await axios.delete(`${API_URL}/users/${username}`);
    return response.data;
};
