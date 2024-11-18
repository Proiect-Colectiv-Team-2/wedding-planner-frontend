import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../services/eventService.js';
import Navbar from '../../components/Navbar';
import styles from './CreateEvent.module.css';
import useAuth from "../../hooks/useAuth.js";

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
    const [photo, setPhoto] = useState(null);
    const [error, setError] = useState('');

    const { currentUser } = useAuth(); // Access currentUser
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventData({
            ...eventData,
            [name]: value,
        });
        setError('');
    };

    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]);
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
            // Prepare form data
            const formData = new FormData();
            formData.append('name', eventData.name);
            formData.append('startDateTime', eventData.startDateTime);
            formData.append('endDateTime', eventData.endDateTime);
            formData.append('address', eventData.address);

            // Append organizers (current user's ID)
            if (currentUser && currentUser._id) {
                formData.append('organizers', currentUser._id);
            }

            // Append photo if selected
            if (photo) {
                formData.append('photo', photo);
                if (currentUser && currentUser._id) {
                    formData.append('photoUser', currentUser._id);
                }
            }

            await createEvent(formData);
            alert('Event created successfully');
            navigate('/myevents');
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Failed to create event');
        }
    };

    return (
        <div className={styles.container}>
            <Navbar />
            <h1 className={styles.message}>Create Event</h1>

            <form onSubmit={handleCreateEvent} className={styles.form} encType="multipart/form-data">
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

                {/* File input for photo */}
                <div className={styles.formGroup}>
                    <label htmlFor="photo" className={styles.label}>Event Photo</label>
                    <input
                        type="file"
                        id="photo"
                        name="photo"
                        accept="image/*"
                        onChange={handleFileChange}
                        className={styles.input}
                    />
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <button type="submit" className={styles.button}>
                    Create Event
                </button>
            </form>
        </div>
    );
};

export default CreateEvent;
