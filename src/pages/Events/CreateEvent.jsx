import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../services/eventService.js';
import Navbar from '../../components/Navbar';
import styles from './CreateEvent.module.css';

// Function to validate the name
const isValidName = (name) => /^[A-Za-z0-9\s]+$/.test(name) && name.length <= 100;

// Function to validate the address
const isValidAddress = (address) => /^[A-Za-z0-9\s,./-]+$/.test(address) && address.length <= 100;


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

        // Validate event name
        if (!isValidName(eventData.name)) {
            setError('Event name must contain only letters, numbers, and spaces and be no longer than 100 characters.');
            return;
        }

        // Validate event address
        if (!isValidAddress(eventData.address)) {
            setError('Event address must contain only letters, numbers, spaces and ,./- and be no longer than 100 characters.');
            return;
        }

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

                {error && <p className={styles.error}>{error}</p>} {/* Display error message */}

                <button type="submit" className={styles.button}>
                    Create Event
                </button>
            </form>
        </div>
    );
};

export default CreateEvent;
