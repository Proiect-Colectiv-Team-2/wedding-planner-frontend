// src/pages/Events/EditEvent.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvents, updateEvent } from '../../services/eventService';
import Navbar from '../../components/Navbar';
import styles from './EditEvent.module.css';

const EditEvent = () => {
    const { id } = useParams(); // Get the event ID from the URL
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const events = await getEvents();
                const event = events.find((e) => e._id === id);
                setEventData(event);
                setLoading(false);
            } catch (error) {
                console.error('Failed to load event:', error);
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventData({
            ...eventData,
            [name]: value,
        });
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        try {
            await updateEvent(id, eventData);
            alert('Event updated successfully');
            navigate('/myevents'); // Navigate back to the My Events page after updating
        } catch (error) {
            console.error('Error updating event:', error);
            alert('Failed to update event');
        }
    };

    if (loading) return <p>Loading event data...</p>;

    if (!eventData) return <p>Event not found</p>;

    return (
        <div className={styles.container}>
            <Navbar />
            <h1>Edit Event</h1>
            <form onSubmit={handleUpdateEvent} className={styles.form}>
                <input
                    type="text"
                    name="name"
                    value={eventData.name}
                    onChange={handleInputChange}
                    placeholder="Event Name"
                    className={styles.input}
                />
                <input
                    type="datetime-local"
                    name="startDateTime"
                    value={eventData.startDateTime}
                    onChange={handleInputChange}
                    className={styles.input}
                />
                <input
                    type="datetime-local"
                    name="endDateTime"
                    value={eventData.endDateTime}
                    onChange={handleInputChange}
                    className={styles.input}
                />
                <input
                    type="text"
                    name="address"
                    value={eventData.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>Update Event</button>
            </form>
        </div>
    );
};

export default EditEvent;