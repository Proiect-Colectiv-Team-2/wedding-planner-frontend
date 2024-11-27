import api from './api';

export const getPhotosByEventId = async (eventId) => {
    const response = await api.get(`/events/${eventId}/photos`);
    return response.data; // Returns the array of photos
};
