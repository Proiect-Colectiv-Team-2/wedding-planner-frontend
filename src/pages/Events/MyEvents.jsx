// src/pages/Events/MyEvents.jsx

import { useEffect, useState } from 'react';
import { getEvents, deleteEvent } from '../../services/eventService';
import styles from './MyEvents.module.css';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { exportEventsToExcel } from '../../services/eventService';

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { currentUser } = useAuth();

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
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await deleteEvent(id);  // Call the delete function from the service
                setEvents(events.filter(event => event._id !== id));  // Remove deleted event from state
                alert('Event deleted successfully');
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Failed to delete event');
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-event/${id}`); // Ensure this matches the route defined in App.jsx
    };

    const handleView = (id) => {
        navigate(`/events/${id}`); // Navigate to EventDetail page
    };

    const handleExportToExcel = async () => {
        try {
            await exportEventsToExcel();
        } catch (err) {
            alert('Failed to export events.');
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
            <Navbar/>
            <h1 className={styles.title}>My Events</h1>
            <button className={styles.exportButton} onClick={handleExportToExcel}>
                Export Events to Excel
            </button>
            {events.length === 0 ? (
                <p className={styles.message}>No events found.</p>
            ) : (
                <ul className={styles.eventList}>
                    {events.map((event) => (
                        <li key={event._id} className={styles.eventItem}>
                            <div className={styles.eventInfo}>
                                <h2>{event.name}</h2>
                                <p>
                                    {new Date(event.startDateTime).toLocaleString()} -{' '}
                                    {new Date(event.endDateTime).toLocaleString()}
                                </p>
                                <p>Address: {event.address || 'N/A'}</p>
                                <p>Organizers: {event.organizers.map(org => org.email).join(', ')}</p>
                            </div>
                            <div className={styles.eventActions}>
                                <button
                                    className={styles.viewButton}
                                    onClick={() => handleView(event._id)}
                                >
                                    View
                                </button>
                                {currentUser.role === 'Organizer' && (
                                    <>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => handleEdit(event._id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteEvent(event._id)}
                                            className={styles.deleteButton}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyEvents;
