import axios from 'axios';

export const sendInvitationEmail = async (email, eventId) => {
    console.log(`Invitation request data: email: ${email} for the event: ${eventId}`);
    const response = await axios.post('/api/invitations/send', { email, eventId });
    console.log(`Invitation sent to ${email} for the event: ${eventId}`);
    return response.data;
};
