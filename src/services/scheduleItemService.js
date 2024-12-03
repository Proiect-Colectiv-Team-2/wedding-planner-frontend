import api from "./api.js";

// ScheduleItem related API calls

// Fetch all schedule items
export const getScheduleItems = async () => {
    const response = await api.get('/api/schedule-items');
    return response.data;
};