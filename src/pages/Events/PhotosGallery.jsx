import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import styles from './PhotosGallery.module.css';
import { getPhotosByEventId } from '../../services/photoService';

const PhotosGallery = () => {
    const { id } = useParams(); // Event ID from the URL
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const photosData = await getPhotosByEventId(id);
                setPhotos(photosData);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch photos.');
                setLoading(false);
            }
        };
        fetchPhotos();
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
            <h1 className={styles.title}>Photo Gallery</h1>
            {photos.length === 0 ? (
                <p className={styles.message}>No photos available for this event.</p>
            ) : (
                <div className={styles.photosContainer}>
                    {photos.map(photo => (
                        <img
                            key={photo._id}
                            src={photo.photoURL}
                            alt={`Event photo`}
                            className={styles.photo}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PhotosGallery;