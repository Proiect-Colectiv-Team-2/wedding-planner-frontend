import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEventById } from '../../services/eventService';
import { sendInvitationEmail } from '../../services/invitationService'; // Import the service
import Navbar from '../../components/Navbar';
import styles from './ParticipantsManagement.module.css';
import useAuth from '../../hooks/useAuth';

const ParticipantsManagement = () => {
    const { id } = useParams(); // Event ID from URL
    const [event, setEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inviteLoading, setInviteLoading] = useState(false); // For invite button
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    // For the invite functionality
    const [emailToInvite, setEmailToInvite] = useState('');
    const [inviteMessage, setInviteMessage] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const eventData = await getEventById(id);
                setEvent(eventData);
                // Assuming eventData has 'invitations' array with participants info
                setParticipants(eventData.invitations || []);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch event participants.');
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleInvite = async (e) => {
        e.preventDefault();
        setInviteLoading(true);
        setInviteMessage('');
        try {
            await sendInvitationEmail(emailToInvite, id);
            setInviteMessage(`Invitation sent to ${emailToInvite}`);
            // Fetch updated participants list
            const updatedEventData = await getEventById(id);
            setEvent(updatedEventData);
            setParticipants(updatedEventData.invitations || []);
            setEmailToInvite('');
        } catch (error) {
            setInviteMessage('Failed to send invitation');
            console.error(error);
        } finally {
            setInviteLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <Navbar />
                <p className={styles.message}>Loading participants...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <Navbar />
                <p className={styles.error}>{error}</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Navbar />
            <h1 className={styles.title}>Participants for {event.name}</h1>
            {participants.length > 0 ? (
                <ul className={styles.participantsList}>
                    {participants.map((invitation) => (
                        <li key={invitation._id} className={styles.participantItem}>
                            {invitation.email} - Status: {invitation.status}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className={styles.message}>No participants yet.</p>
            )}
            {currentUser && currentUser.role === 'Organizer' && (
                <div className={styles.inviteContainer}>
                    <h2 className={styles.subtitle}>Invite Participants</h2>
                    <form onSubmit={handleInvite} className={styles.inviteForm}>
                        <input
                            type="email"
                            placeholder="Participant's email"
                            value={emailToInvite}
                            onChange={(e) => setEmailToInvite(e.target.value)}
                            required
                            className={styles.inputField}
                        />
                        <button type="submit" className={styles.inviteButton} disabled={inviteLoading}>
                            {inviteLoading ? 'Sending...' : 'Invite'}
                        </button>
                    </form>
                    {inviteMessage && <p className={styles.inviteMessage}>{inviteMessage}</p>}
                </div>
            )}
        </div>
    );
};

export default ParticipantsManagement;
