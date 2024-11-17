import { useNavigate } from 'react-router-dom';
import styles from './CarouselImage.module.css';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const CarouselImage = ( {url, name, height, header, subheader, daysUntilWedding, blur} ) => {

    return (
        <div className={styles.container} style={{maxHeight:height}}>
            <img className={blur?styles.blurry:""} src={url}/>
            <div className={styles.overlayText}>
                { header ? ( <p className={styles.header}>{header}</p> ) : null }
                { subheader ? ( <h2 className={styles.subheader}>{subheader}</h2> ) : null }
                { daysUntilWedding ? ( 
                    <div>
                        <div className={styles.countdown}>
                            { String(daysUntilWedding).padStart(4, '0').split('').map((digit) => (
                                    <span className={styles.digit}>{digit}</span>
                                    )
                                )
                            }
                        </div>
                        <p>DAYS UNTIL WEDDING</p>
                    </div>
                    ) : null 
                }
            </div>
            { name ? ( <p className="legend">{name}</p> ) : null }
        </div>
    );
};

export default CarouselImage;
