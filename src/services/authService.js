// Authentication related API calls

import api from './api';

export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/api/auth/login', { email, password });
        return {
            user: response.data.user,
            token: response.data.token
        }
    } catch (error) {
        throw error.response ? error.response.data : new Error('Failed to login');
    }
};

export const createUser = async (userData) => {
    try {
        const response = await api.post('/api/auth/signup', userData);
        return {
            user: response.data.user,
            token: response.data.token
        }
    } catch (error) {
        throw error.response?.data || 'Error creating user.';
    }
};


export const sendRserPassword = async (email) => {
    try {
        const response = await api.post('/api/auth/reset-password', { email });
        return {
            message: response.data.message
        }
    } catch (error) {
        throw error.response?.data || 'Error sending reseting password mail.';
    }
}


export const resetPassword = async (token, data) => {
    try {
        const response = await api.patch('/api/auth/reset-password', data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return {
            message: response.data.message
        }
    } catch (error) {
        throw error.response?.data || 'Error reseting password.';
    }
}