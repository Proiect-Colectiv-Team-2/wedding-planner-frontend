import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Login.module.css'; // Reusing the same styles
import useAuth from '../hooks/useAuth';
import {
    getInvitationDetails,
    declineInvitation,
    // remove the old confirmInvitation since we'll use confirmInvitationWithUser
} from '../services/invitationService';
import { confirmInvitationWithUser } from '../services/invitationService'; // new function
import { loginUser, createUser } from '../services/authService';

const Invitation = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { currentUser, login } = useAuth();

    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [eventName, setEventName] = useState('');
    const [invitationStatus, setInvitationStatus] = useState('');
    const [message, setMessage] = useState('');

    // --- For the login form ---
    const [loginPassword, setLoginPassword] = useState('');

    // --- For the create user (register) form ---
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        passwordConfirm: '',
        firstName: '',
        lastName: '',
        role: 'Participant', // locked to Participant
    });

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInvitationDetails = async () => {
            try {
                const data = await getInvitationDetails(token);
                setInviteEmail(data.email);
                setEventName(data.eventName);
                setInvitationStatus(data.status);

                // Also fill newUser email so the register form has it read-only
                setNewUser((prev) => ({ ...prev, email: data.email }));
            } catch (err) {
                console.error('Failed to get invitation details:', err);
                setMessage('Failed to load invitation details. The invitation may be invalid or expired.');
            } finally {
                setLoading(false);
            }
        };

        fetchInvitationDetails();
    }, [token]);

    /**
     * 1) Login existing user
     * 2) confirmInvitationWithUser(token, user._id)
     * 3) redirect to /home
     */
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const { user, token: authToken } = await loginUser(inviteEmail, loginPassword);
            // store user & token in context
            login(user, authToken);

            // Now confirm the invitation, passing user._id
            await confirmInvitationWithUser(token, user._id);

            // success => navigate
            navigate('/home');
        } catch (err) {
            setError(err.message || 'Failed to login.');
        }
    };

    /**
     * 1) Register new user
     * 2) confirmInvitationWithUser(token, user._id)
     * 3) redirect to /home
     */
    const handleCreateUser = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            // newUser already has email = inviteEmail
            const { user, token: authToken } = await createUser(newUser);
            // Log them in
            login(user, authToken);

            // Confirm invitation automatically
            await confirmInvitationWithUser(token, user._id);

            // Redirect
            navigate('/home');
        } catch (err) {
            setError(err.message || 'Failed to create user.');
        }
    };

    const handleRegisterInputChange = (e) => {
        setNewUser({
            ...newUser,
            [e.target.name]: e.target.value,
        });
    };

    /**
     * Decline
     */
    const handleDecline = async () => {
        try {
            await declineInvitation(token);
            setInvitationStatus('Declined');
            setMessage('Please contact the organizer if this was a mistake.');
        } catch (err) {
            console.error(err);
            setMessage('Failed to decline the invitation.');
        }
    };

    if (loading) {
        return (
            <div className={styles.pageBackground}>
                <div className={styles.loginContainer}>
                    <h2>Loading invitation...</h2>
                </div>
            </div>
        );
    }

    // If invitation was invalid or something else, we can show the message
    if (!inviteEmail) {
        return (
            <div className={styles.pageBackground}>
                <div className={styles.loginContainer}>
                    <h2>Invitation Not Found</h2>
                    {message && <p>{message}</p>}
                </div>
            </div>
        );
    }

    // If user has Declined, we can show a message
    if (invitationStatus === 'Declined') {
        return (
            <div className={styles.pageBackground}>
                <div className={styles.loginContainer}>
                    <h2>You have declined the invitation for: {eventName}</h2>
                    {message && <p>{message}</p>}
                </div>
            </div>
        );
    }

    // If the invitation is Confirmed
    // We can show a message or just allow them to proceed.
    // Typically you'd redirect or say "Your invitation is confirmed!"
    if (invitationStatus === 'Confirmed' && !currentUser) {
        return (
            <div className={styles.pageBackground}>
                <div className={styles.loginContainer}>
                    <h2>Your invitation is already confirmed for: {eventName}</h2>
                    {message && <p>{message}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageBackground}>
            <div className={styles.loginContainer}>

                <h2 className={styles.heading}>
                    You are invited to <span style={{ color: 'white' }}>{eventName}</span>
                </h2>
                <p style={{ marginBottom: '1rem' }}>
                    Invitation status: <strong>{invitationStatus}</strong>
                </p>

                {invitationStatus === 'Pending' && (
                    <button
                        onClick={handleDecline}
                        className={styles.button}
                        style={{ backgroundColor: '#d9534f', marginBottom: '1rem' }}
                    >
                        Decline
                    </button>
                )}

                {message && <p style={{ color: 'yellow' }}>{message}</p>}
                {error && <p className={styles.error}>{error}</p>}

                {/* --- LOGIN FORM --- */}
                <h2 className={styles.heading}>Login & Confirm</h2>
                <form onSubmit={handleLogin}>
                    <div className={styles.formGroup}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={inviteEmail}
                            readOnly
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            type="password"
                            placeholder="Password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>

                    <button type="submit" className={styles.button}>
                        Confirm
                    </button>
                </form>

                {/* --- REGISTER FORM --- */}
                <h2 className={styles.heading}>Register & Confirm</h2>
                <form onSubmit={handleCreateUser}>
                    <div className={styles.formGroup}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={newUser.email}
                            readOnly
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={newUser.password}
                            onChange={handleRegisterInputChange}
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            type="password"
                            name="passwordConfirm"
                            placeholder="Confirm Password"
                            value={newUser.passwordConfirm}
                            onChange={handleRegisterInputChange}
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={newUser.firstName}
                            onChange={handleRegisterInputChange}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={newUser.lastName}
                            onChange={handleRegisterInputChange}
                            className={styles.input}
                        />
                    </div>

                    {/* Keep role locked to Participant */}
                    <div className={styles.formGroup}>
                        <select
                            name="role"
                            value="Participant"
                            disabled
                            className={styles.select}
                        >
                            <option value="Participant">Participant</option>
                        </select>
                    </div>

                    <button type="submit" className={styles.button}>
                        Confirm
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Invitation;
