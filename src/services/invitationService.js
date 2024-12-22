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

export const getInvitationDetails = async (token) => {
    const response = await api.get(`/api/invitations/${token}/details`);
    return response.data;
};

export const confirmInvitationWithUser = async (token, userId) => {
    // POST /api/invitations/confirm/:token with { userId } in body
    const response = await api.post(`/api/invitations/confirm/${token}`, { userId });
    return response.data; // { message, invitation }
};


export const declineInvitation = async (token) => {
    const response = await api.get(`/api/invitations/decline/${token}`);
    return response.data;
};
