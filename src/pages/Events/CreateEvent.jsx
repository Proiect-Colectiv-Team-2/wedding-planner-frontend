import Navbar from '../../components/Navbar';
import styles from './CreateEvent.module.css';

const CreateEvent = () => {
    return (
        <div className={styles.container}>
            <Navbar />
            <h1 className={styles.message}>Create Event</h1>
            {/* Future implementation for event creation can be added here */}
        </div>
    );
};

export default CreateEvent;
