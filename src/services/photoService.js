// Photo related API calls
import api from './api.js'; // Use the same `api` instance

// Add a photo to an event
export const addPhotoToEvent = async (formData) => {
    try {
        const response = await api.post('/api/photos', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data; // Updated event data
    } catch (error) {
        console.error('Error adding photo:', error);
        throw error;
    }
};

// Delete a photo by ID
export const deletePhotoFromEvent = async (photoId) => {
    try {
        const response = await api.delete(`/api/photos/${photoId}`);
        return response.data; // Updated event data
    } catch (error) {
        console.error('Error deleting photo:', error);
        throw error;
    }
};