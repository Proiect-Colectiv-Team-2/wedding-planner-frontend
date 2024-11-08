import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../services/eventService.js'; // Assuming you have a service file for events
import Navbar from '../../components/Navbar';
import styles from './CreateEvent.module.css';

const CreateEvent = () => {
    const [eventData, setEventData] = useState({
        name: '',
        startDateTime: '',
        endDateTime: '',
        address: '',
        photos: [],
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventData({
            ...eventData,
            [name]: value,
        });
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const newEvent = await createEvent(eventData); // Assuming createEvent sends the event data to your API
            alert('Event created successfully');
            navigate(`/events/${newEvent._id}`); // Redirect to the new event's page
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Failed to create event');
        }
    };

    return (
        <div className={styles.container}>
            <Navbar />
            <h1 className={styles.message}>Create Event</h1>

            <form onSubmit={handleCreateEvent} className={styles.form}>
                <div className={styles.formGroup}>
                    <input
                        type="text"
                        name="name"
                        value={eventData.name}
                        onChange={handleInputChange}
                        placeholder="Event Name"
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <input
                        type="datetime-local"
                        name="startDateTime"
                        value={eventData.startDateTime}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <input
                        type="datetime-local"
                        name="endDateTime"
                        value={eventData.endDateTime}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <input
                        type="text"
                        name="address"
                        value={eventData.address}
                        onChange={handleInputChange}
                        placeholder="Event Address"
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <input
                        type="file"
                        name="photos"
                        onChange={(e) => setEventData({ ...eventData, photos: e.target.files })}
                        className={styles.input}
                        multiple
                    />
                </div>

                <button type="submit" className={styles.button}>
                    Create Event
                </button>
            </form>
        </div>
    );
};

export default CreateEvent;
