import { useEffect, useState } from 'react';
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
    const [fileUploadMessage, setFileUploadMessage] = useState(''); // Message for file upload

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
        e.preventDefault(); // Prevent form submission default
        setInviteLoading(true); // Set loading state for the button
        setInviteMessage(''); // Clear any previous messages

        try {
            // Trigger the API request
            const response = await sendInvitationEmail(emailToInvite, id);

            if (response) {
                setInviteMessage(`Invitation sent to ${emailToInvite}`);

                // Add the new participant to the state directly
                const newParticipant = {
                    email: emailToInvite,
                    status: 'Pending',
                    _id: response.invitations[0]?._id || new Date().getTime(), // Use the response ID or a temp unique ID
                };
                setParticipants((prevParticipants) => [...prevParticipants, newParticipant]);

                // Clear the input field
                setEmailToInvite('');
            }
        } catch (error) {
            setInviteMessage('Failed to send invitation');
            console.error('Error:', error);
        } finally {
            setInviteLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const content = event.target.result;

            try {
                const emails = parseCSV(content);

                setFileUploadMessage('');
                setInviteLoading(true);

                const failedEmails = [];

                for (const email of emails) {
                    try {
                        const response = await sendInvitationEmail(email, id);
                        if (response) {
                            const newParticipant = {
                                email,
                                status: 'Pending',
                                _id:
                                    response.invitations[0]?._id ||
                                    new Date().getTime(), // Use the response ID or a temp unique ID
                            };
                            setParticipants((prevParticipants) => [
                                ...prevParticipants,
                                newParticipant,
                            ]);
                        }
                    } catch (err) {
                        failedEmails.push(email);
                    }
                }

                setFileUploadMessage(
                    `File processed! ${
                        failedEmails.length > 0
                            ? `Failed to send to: ${failedEmails.join(', ')}`
                            : 'All invitations sent successfully.'
                    }`
                );
            } catch (err) {
                setFileUploadMessage(
                    'Failed to parse the CSV file. Please ensure it is properly formatted.'
                );
                console.error('CSV Parse Error:', err);
            } finally {
                setInviteLoading(false);
            }
        };

        reader.onerror = () => {
            setFileUploadMessage('Failed to read the file. Please try again.');
        };

        reader.readAsText(file);
    };

    const parseCSV = (data) => {
        const lines = data.split('\n');
        const emails = [];

        for (const line of lines) {
            const [email] = line.split(',');
            if (email && validateEmail(email.trim())) {
                emails.push(email.trim());
            }
        }

        return emails;
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '20px',
                        }}
                    >
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            className={styles.uploadButton}
                            style={{
                                marginLeft: '20px', // Shift the button slightly to the right
                            }}
                        />
                    </div>
                    {fileUploadMessage && (
                        <p
                            style={{
                                marginBottom: '20px',
                                color: 'white',
                                textAlign: 'center',
                            }}
                        >
                            {fileUploadMessage}
                        </p>
                    )}
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
