// Authentication related API calls

import api from './api';

export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/api/auth/login', { email, password });
        return response.data.user;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Failed to login');
    }
};

export const createUser = async (userData) => {
    try {
        const response = await api.post('/api/auth/signup', userData);
        return response.data.user; // Return the created user
    } catch (error) {
        throw error.response?.data || 'Error creating user.';
    }
};
