import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { getScheduleItems, deleteScheduleItem } from "../../services/scheduleItemService";
import ScheduleItem from "../../components/ScheduleItem";
import useAuth from "../../hooks/useAuth";
import styles from './EventDetail.module.css';

const ScheduleManagement = () => {
    const { id } = useParams();
    const { currentUser } = useAuth(); // Access current user information
    const [scheduleItems, setScheduleItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const handleDelete = async scheduleItemId => {

        try {

            await deleteScheduleItem(scheduleItemId);
            setScheduleItems(scheduleItems.filter(item => item._id.toString() !== scheduleItemId));
        } catch (err) {
            setError('Could not delete schedule item');
        }
    }

    useEffect(()=>
    {
        const fetchEvent = async () =>
        {
            try
            {
                const scheduleItemsData = await getScheduleItems();
                const filteredScheduleItemsData = scheduleItemsData.filter(item => item.event._id == id)
                setScheduleItems(filteredScheduleItemsData);
                setLoading(false);
            }
            catch( err )
            {
                setError('Could not load schedule items');
                setLoading(false);
            }
        }
        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <div className={styles.container}>
                <Navbar />
                <p className={styles.message}>Loading event details...</p>
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
        <div>
            <Navbar />
                <div className={styles.title}>
                    <h1>Schedule for Event</h1>
                    { scheduleItems.length === 0 ? (
                            <p>No schedule items available for this event.</p>
                        ) : (
                        scheduleItems.map(item => (
                            <div key={item._id}>
                                <ScheduleItem data={item} key={item._id} handleDelete={handleDelete} />
                            </div>
                            ))
                        )}
            </div>
        </div>
    );
};

export default ScheduleManagement;