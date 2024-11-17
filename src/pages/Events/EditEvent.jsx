// src/pages/Events/EditEvent.jsx

import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {getEventById, updateEvent} from '../../services/eventService';
import Navbar from '../../components/Navbar';
import styles from './EditEvent.module.css';

// Function to validate the name
const isValidName = (name) => /^[A-Za-z0-9\s]+$/.test(name) && name.length <= 100;

// Function to validate the address
const isValidAddress = (address) => /^[A-Za-z0-9\s,./-]+$/.test(address) && address.length <= 100;

const EditEvent = () => {
    const {id} = useParams(); // Get the event ID from the URL
    const [eventData, setEventData] = useState({
        name: '',
        startDateTime: '',
        endDateTime: '',
        address: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const event = await getEventById(id);
                setEventData({
                    name: event.name || '',
                    startDateTime: event.startDateTime ? event.startDateTime.substring(0, 16) : '',
                    endDateTime: event.endDateTime ? event.endDateTime.substring(0, 16) : '',
                    address: event.address || '',
                });
            } catch (error) {
                console.error('Failed to load event:', error);
                setError('Failed to load event data.');
            }
        };
        fetchEvent();
    }, [id]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setEventData({
            ...eventData,
            [name]: value,
        });
        setError(''); // Clear error message on input change
    };

    const handleUpdateEvent = async (e) => {
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
            await updateEvent(id, eventData);
            alert('Event updated successfully');
            navigate('/myevents'); // Navigate back to the My Events page after updating
        } catch (error) {
            console.error('Error updating event:', error);
            alert('Failed to update event');
        }
    };

    if (error) {
        return (
            <div className={styles.container}>
                <Navbar/>
                <p className={styles.error}>{error}</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Navbar/>
            <h1 className={styles.message}>Edit Event</h1>
            <form onSubmit={handleUpdateEvent} className={styles.form}>
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

                <button type="submit" className={styles.saveButton}>Update Event</button>

            </form>
        </div>
    );
};

export default EditEvent;