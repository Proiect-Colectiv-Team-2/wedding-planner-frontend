import api from "./api.js";

// ScheduleItem related API calls

// Fetch all schedule items
export const getScheduleItems = async () => {
    const response = await api.get('/api/schedule-items');
    return response.data;
};

export const deleteScheduleItem = async (scheduleItemId) => {
    const response = await api.delete(`/api/schedule-items/${scheduleItemId}`);
    return response.data;
}