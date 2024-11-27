import { useNavigate, useParams, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getEventById } from '../../services/eventService';
import Navbar from '../../components/Navbar';
import styles from './EventDetail.module.css';
import useAuth from '../../hooks/useAuth';

const EventDetail = () => {
    const { id } = useParams(); // Event ID from the URL
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth(); // Access current user information
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const eventData = await getEventById(id);
                setEvent(eventData);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch event details.');
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <div className={styles.container}>
                <Navbar />
                <p className={styles.message}>Loading event details...</p>
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
            <h1 className={styles.title}>{event.name}</h1>
            <p className={styles.dates}>
                {new Date(event.startDateTime).toLocaleString()} -{' '}
                {new Date(event.endDateTime).toLocaleString()}
            </p>
            <p className={styles.address}>Address: {event.address || 'N/A'}</p>

            {/* Navigation for Event Subsections */}
            <nav className={styles.subNav}>
                {currentUser && currentUser.role === 'Organizer' && (
                    <a href={`/events/${id}/participants`} className={styles.navLink}>
                        Participants
                    </a>
                )}
                <a className={styles.navLink} onClick={() => navigate('schedule') }>
                    Schedule
                </a>
                <a href={`/events/${id}/photos`} className={styles.navLink}>
                    Photos
                </a>
                {currentUser && currentUser.role === 'Participant' && (
                    <a href={`/events/${id}/upload-photo`} className={styles.navLink}>
                        Upload Photo
                    </a>
                )}
            </nav>

            {/* Display Event Photos (Optional) */}
            {event.photos && event.photos.length > 0 && (
                <div className={styles.photosContainer}>
                    {event.photos.map(photo => (
                        <img
                            key={photo._id}
                            src={photo.photoURL}
                            alt={`Photo of ${event.name}`}
                            className={styles.photo}
                        />
                    ))}
                </div>
            )}
            <Outlet />
        </div>
    );
};

export default EventDetail;
