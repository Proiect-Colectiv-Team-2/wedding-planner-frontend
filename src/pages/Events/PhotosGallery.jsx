import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEventById } from '../../services/eventService';
import { addPhotoToEvent, deletePhotoFromEvent } from '../../services/photoService';
import Navbar from '../../components/Navbar';
import styles from './PhotosGallery.module.css';
import useAuth from "../../hooks/useAuth.js";

const PhotosGallery = () => {
    const { id } = useParams(); // Get event ID from URL
    const { currentUser } = useAuth(); // Access current user information
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [photoFile, setPhotoFile] = useState(null); // For file upload

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

    const handleAddPhoto = async () => {
        if (!photoFile) {
            alert('Please select a photo to upload.');
            return;
        }

        if (!currentUser || !currentUser._id) {
            alert('User not logged in.');
            return;
        }

        const formData = new FormData();
        formData.append('photo', photoFile);
        formData.append('eventId', id); // Pass event ID
        formData.append('userId', currentUser._id); // Pass actual user ID

        try {
            const updatedEvent = await addPhotoToEvent(formData); // API call
            setEvent(updatedEvent.event); // Update event state
            setPhotoFile(null); // Clear the file input
            alert('Photo uploaded successfully.');
        } catch (err) {
            console.error('Failed to upload photo:', err);
            alert('Failed to upload photo.');
        }
    };

    const handleDeletePhoto = async (photoId) => {
        try {
            const updatedEvent = await deletePhotoFromEvent(photoId); // API call
            setEvent(updatedEvent); // Update event state
        } catch (err) {
            alert('Failed to delete photo.');
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <Navbar />
                <p className={styles.message}>Loading photos...</p>
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
            <h1 className={styles.title}>Photos for {event.name}</h1>

            {/* Photo Upload Section */}
            <div className={styles.uploadSection}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhotoFile(e.target.files[0])}
                />
                <button onClick={handleAddPhoto} disabled={!photoFile}>
                    Upload Photo
                </button>
            </div>

            {event.photos && event.photos.length > 0 ? (
                <div className={styles.photosContainer}>
                    {event.photos.map((photo) => (
                        <div key={photo._id} className={styles.photoCard}>
                            <img
                                src={photo.photoURL}
                                alt={`Photo of ${event.name}`}
                                className={styles.photo}
                            />
                            <button
                                onClick={() => handleDeletePhoto(photo._id)}
                                className={styles.deleteButton}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className={styles.noPhotos}>No photos available for this event.</p>
            )}
        </div>
    );
};

export default PhotosGallery;
