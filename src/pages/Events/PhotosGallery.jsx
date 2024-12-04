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
    const [previewURL, setPreviewURL] = useState(null); // For photo preview

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

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);

            // Generate a preview URL
            const reader = new FileReader();
            reader.onload = () => setPreviewURL(reader.result);
            reader.readAsDataURL(file);
        }
    };

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
            setPreviewURL(null); // Clear the preview
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

            <div className={styles.photosContainer}>
                {/* Photo Upload Section */}
                {currentUser && currentUser.role === 'Participant' && (
                    <div className={styles.photoCard}>
                        {previewURL ? (
                            <img
                                src={previewURL}
                                alt="Preview"
                                className={styles.photo}
                            />
                        ) : (
                            <label htmlFor="photoUpload" className={styles.uploadSquare}>
                                <span>+</span>
                            </label>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            id="photoUpload"
                            style={{ display: 'none' }}
                        />
                        {photoFile && (
                            <button
                                onClick={handleAddPhoto}
                                className={styles.uploadButton}
                            >
                                Upload
                            </button>
                        )}
                    </div>
                )}

                {/* Render Existing Photos */}
                {event.photos && event.photos.length > 0 && event.photos.map((photo) => (
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
        </div>
    );
};

export default PhotosGallery;
