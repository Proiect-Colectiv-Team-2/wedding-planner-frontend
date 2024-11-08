import api from "./api.js";

// Fetch all events
export const getEvents = async () => {
    const response = await api.get('/api/events');
    return response.data;
};

// Create an event
export const createEvent = async (eventData) => {
    try {
        const response = await api.post('/api/events', eventData); // POST request to create event
        return response.data; // The backend should return the created event
    } catch (error) {
        console.error('Error creating event:', error);
        throw error; // Propagate the error to be handled in the component
    }
};