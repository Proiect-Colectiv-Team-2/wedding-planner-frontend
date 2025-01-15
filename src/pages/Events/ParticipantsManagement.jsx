import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEventById } from '../../services/eventService';
import { sendInvitationEmail } from '../../services/invitationService';
import Navbar from '../../components/Navbar';
import styles from './ParticipantsManagement.module.css';
import useAuth from '../../hooks/useAuth';

const ParticipantsManagement = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inviteLoading, setInviteLoading] = useState(false);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    // For invite functionality (single email & CSV)
    const [emailToInvite, setEmailToInvite] = useState('');
    const [inviteMessage, setInviteMessage] = useState('');
    const [fileUploadMessage, setFileUploadMessage] = useState('');
    const [fileName, setFileName] = useState('Upload CSV');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const eventData = await getEventById(id);
                setEvent(eventData);
                setParticipants(eventData.invitations || []);
            } catch (err) {
                setError('Failed to fetch event participants.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();

    }, [id]);



    console.log(event);

    const handleInvite = async (e) => {
        e.preventDefault();
        setInviteLoading(true);
        setInviteMessage('');

        try {
            const response = await sendInvitationEmail(emailToInvite, id);
            if (response) {
                setInviteMessage(`Invitation sent to ${emailToInvite}`);
                const newParticipant = {
                    email: emailToInvite,
                    status: 'Pending',
                    _id: response.invitations[0]?._id || new Date().getTime(),
                };
                setParticipants((prev) => [...prev, newParticipant]);
                setEmailToInvite('');
            }
        } catch (err) {
            console.error('Error:', err);
            setInviteMessage('Failed to send invitation');
        } finally {
            setInviteLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFileName(file.name);

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
                                _id: response.invitations[0]?._id || new Date().getTime(),
                            };
                            setParticipants((prev) => [...prev, newParticipant]);
                        }
                    } catch (error) {
                        failedEmails.push(email);
                    }
                }

                setFileUploadMessage(
                    `File processed! ${failedEmails.length > 0
                        ? `Failed to send to: ${failedEmails.join(', ')}`
                        : 'All invitations sent successfully.'
                    }`
                );
            } catch (err) {
                console.error('CSV Parse Error:', err);
                setFileUploadMessage('Failed to parse the CSV file. Please ensure it is properly formatted.');
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
            <h1 className={styles.title}>Participants for {event?.name}</h1>

            {participants.length > 0 ? (
                <ul className={styles.participantsList}>
                    {participants.map((invitation) => {
                        const statusClass = invitation.status?.toLowerCase();
                        return (
                            <li
                                key={invitation._id}
                                className={`${styles.participantItem} ${styles[statusClass]}`}
                            >
                                <span className={styles.participantEmail}>{invitation.email}</span>
                                <span className={styles.statusLabel}>{invitation.status}</span>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className={styles.message}>No participants yet.</p>
            )}

            {currentUser?.role === 'Organizer' && (
                <div className={styles.inviteContainer}>
                    <h2 className={styles.subtitle}>Invite Participants</h2>
                    <p style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        You can invite <strong>multiple participants at once</strong> by uploading
                        a CSV file (<em>one email per line</em>) <strong>or</strong> invite a
                        single participant by typing in their email below.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <label className={styles.uploadButton}>
                            {fileName}
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                    {fileUploadMessage && (
                        <p style={{ marginBottom: '20px', color: 'white', textAlign: 'center' }}>
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
