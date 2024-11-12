import api from "./api.js";

// Fetch all events
export const getEvents = async () => {
    const response = await api.get('/api/events');
    return response.data;
};

// Fetch a single event by ID
export const getEventById = async (id) => {
    const response = await api.get(`/api/events/${id}`);
    console.log(response.data)
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

// Add the deleteEvent function
export const deleteEvent = async (id) => {
    const response = await api.delete(`/api/events/${id}`);
    return response.data;
};

// Add the updateEvent function
export const updateEvent = async (id, updatedData) => {
    const response = await api.put(`/api/events/${id}`, updatedData);
    return response.data;
};
