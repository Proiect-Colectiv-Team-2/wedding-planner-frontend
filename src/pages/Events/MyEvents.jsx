import { useEffect, useState } from 'react';
import { getEvents, deleteEvent } from '../../services/eventService';
import styles from './MyEvents.module.css';
import Navbar from '../../components/Navbar';

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsData = await getEvents();
                setEvents(eventsData);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch events.');
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleDeleteEvent = async (id) => {
        try {
            await deleteEvent(id);  // Call the delete function from the service
            setEvents(events.filter(event => event._id !== id));  // Remove deleted event from state
            alert('Event deleted successfully');
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete event');
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <Navbar />
                <p className={styles.message}>Loading events...</p>
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
            <h1 className={styles.title}>My Events</h1>
            {events.length === 0 ? (
                <p className={styles.message}>No events found.</p>
            ) : (
                <ul className={styles.eventList}>
                    {events.map((event) => (
                        <li key={event._id} className={styles.eventItem}>
                            <h2>{event.name}</h2>
                            <p>
                                {new Date(event.startDateTime).toLocaleString()} -{' '}
                                {new Date(event.endDateTime).toLocaleString()}
                            </p>
                            <p>Address: {event.address || 'N/A'}</p>
                            <p>Organizers: {event.organizers.map(org => org.email).join(', ')}</p>
                            <button
                                onClick={() => handleDeleteEvent(event._id)}
                                className={styles.deleteButton}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyEvents;
