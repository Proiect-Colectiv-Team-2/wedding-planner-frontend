import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../services/eventService.js';
import Navbar from '../../components/Navbar';
import styles from './CreateEvent.module.css';

const CreateEvent = () => {
    const [eventData, setEventData] = useState({
        name: '',
        startDateTime: '',
        endDateTime: '',
        address: '',
    });
    const [error, setError] = useState(''); // State to hold error message

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventData({
            ...eventData,
            [name]: value,
        });
        setError(''); // Clear error message on input change
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();

        // Check if the end date is after the start date
        if (new Date(eventData.endDateTime) <= new Date(eventData.startDateTime)) {
            setError('End date must be after start date');
            return;
        }

        try {
            await createEvent(eventData); // Assuming createEvent sends the event data to your API
            alert('Event created successfully');
            navigate('/home'); // Redirect to home page after successful creation
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
                    <label htmlFor="name" className={styles.label}>Event Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={eventData.name}
                        onChange={handleInputChange}
                        placeholder="Event Name"
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="startDateTime" className={styles.label}>Start Date & Time</label>
                    <input
                        type="datetime-local"
                        id="startDateTime"
                        name="startDateTime"
                        value={eventData.startDateTime}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="endDateTime" className={styles.label}>End Date & Time</label>
                    <input
                        type="datetime-local"
                        id="endDateTime"
                        name="endDateTime"
                        value={eventData.endDateTime}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="address" className={styles.label}>Event Address</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={eventData.address}
                        onChange={handleInputChange}
                        placeholder="Event Address"
                        className={styles.input}
                    />
                </div>

                {error && <p className={styles.error}>{error}</p>} {/* Display error message */}

                <button type="submit" className={styles.button}>
                    Create Event
                </button>
            </form>
        </div>
    );
};

export default CreateEvent;
