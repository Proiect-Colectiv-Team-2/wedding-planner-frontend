import styles from './ScheduleItem.module.css';

const ScheduleItem = ( { data } ) => {

    return (
        <div className={styles.container}>
          <h2 className={styles.title}>{data.title}</h2>
          <p className={styles.address}>{data.description}</p>
          <p className={styles.dates}>Starting: {new Date(data.startTime).toLocaleString()}</p>
          <p className={styles.dates}>Ending: {new Date(data.endTime).toLocaleString()}</p>
        </div>
      );
};

export default ScheduleItem;
