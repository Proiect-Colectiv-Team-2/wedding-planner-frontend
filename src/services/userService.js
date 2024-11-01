import api from './api';

// Fetch all users
export const getUsers = async () => {
    const response = await api.get('/api/users');
    return response.data;
};

// Create a new user
export const createUser = async (userData) => {
    const response = await api.post('/api/users', userData);
    return response.data;
};
