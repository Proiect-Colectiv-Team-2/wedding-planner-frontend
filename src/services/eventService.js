import api from "./api.js";

// Fetch all events
export const getEvents = async () => {
    const response = await api.get('/api/events');
    return response.data;
};
