import api from "./api.js";
import axios from 'axios';

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
export const createEvent = async (formData) => {
    try {
        const response = await api.post('/api/events', formData);
        return response.data;
    } catch (error) {
        console.error('Error creating event:', error);
        throw error;
    }
};

// Add the deleteEvent function
export const deleteEvent = async (id) => {
    const response = await api.delete(`/api/events/${id}`);
    return response.data;
};

// Add the updateEvent function
export const updateEvent = async (id, updatedData) => {
    try {
        let config = {};
        if (updatedData instanceof FormData) {
            config.headers = {
                'Content-Type': 'multipart/form-data',
            };
        }
        const response = await api.put(`/api/events/${id}`, updatedData, config);
        return response.data;
    } catch (error) {
        console.error('Error updating event:', error);
        throw error;
    }
};

export const exportEventsToExcel = async () => {
    try {
        const response = await api.get('/api/events/export', {
            responseType: 'arraybuffer'
        });

        // Create a Blob from the response data
        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Events.xlsx');
        document.body.appendChild(link);
        link.click();

        // Clean up
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error('Error exporting events:', err);
        alert('Failed to export events. Please try again.');
    }
};
