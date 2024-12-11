import api from './api';

export const sendInvitationEmail = async (email, eventId) => {
    try {
        const response = await api.post('/api/invitations', {
            eventId,
            invitations: [{ email, name: email.split('@')[0] }], // Adding a name placeholder
        });
        console.log('Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending invitation:', error);
        throw error;
    }
};
