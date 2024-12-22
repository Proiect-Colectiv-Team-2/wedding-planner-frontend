import styles from './ScheduleItem.module.css';

const ScheduleItem = ({ data, handleDelete }) => {

    return (
      <div className={styles.container}>
			  <h2 className={styles.title}>{data.title}</h2>
			  <div className={styles.schedule__item}>
				  <div className={styles.schedule__item__infos}>
            <p className={styles.address}>{data.description}</p>
					  <p className={styles.dates}>Starting: {new Date(data.startTime).toLocaleString()}</p>
					  <p className={styles.dates}>Ending: {new Date(data.endTime).toLocaleString()}</p>
				  </div>
          <div className={styles.delete__button} onClick={() => handleDelete(data._id)}>
					  <span>X</span>
				  </div>
			  </div>
		  </div>
      );
};

export default ScheduleItem;
