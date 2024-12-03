import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEventById } from '../../services/eventService';
import Navbar from '../../components/Navbar';
import styles from './PhotosGallery.module.css';

const PhotosGallery = () => {
    const { id } = useParams(); // Get event ID from URL
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            {event.photos && event.photos.length > 0 ? (
                <div className={styles.photosContainer}>
                    {event.photos.map((photo) => (
                        <img
                            key={photo._id}
                            src={photo.photoURL}
                            alt={`Photo of ${event.name}`}
                            className={styles.photo}
                        />
                    ))}
                </div>
            ) : (
                <p className={styles.noPhotos}>No photos available for this event.</p>
            )}
        </div>
    );
};

export default PhotosGallery;
