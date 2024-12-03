import { useParams, Outlet, Link} from 'react-router-dom';
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
    const navigate = useNavigate();
    const { currentUser } = useAuth(); // Access current user information


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

    const handleGoToGallery = () => {
        navigate(`/events/${id}/photos`);
    };

    return (
        <div className={styles.container}>
            <Navbar/>
            <h1 className={styles.title}>{event.name}</h1>
            <p className={styles.dates}>
                {new Date(event.startDateTime).toLocaleString()} -{' '}
                {new Date(event.endDateTime).toLocaleString()}
            </p>
            <p className={styles.address}>Address: {event.address || 'N/A'}</p>

            {/* Navigation for Event Subsections */}
            <nav className={styles.subNav}>
                {currentUser && currentUser.role === 'Organizer' && (
                    <Link to={`/events/${id}/participants`} className={styles.navLink}>
                        Participants
                    </Link>
                )}
                <Link to={`/events/${id}/schedule`} className={styles.navLink}>
                    Schedule
                </Link>
                <Link to={`/events/${id}/photos`} className={styles.navLink}>
                    Photos
                </Link>
                {currentUser && currentUser.role === 'Participant' && (
                    <Link to={`/events/${id}/upload-photo`} className={styles.navLink}>
                        Upload Photo
                    </Link>
                )}
            </nav>

            {/* Display Event Photos Preview (Optional) */}
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
            <Outlet/>
        </div>
    );
};

export default EventDetail;
