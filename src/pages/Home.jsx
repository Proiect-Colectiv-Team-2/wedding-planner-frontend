import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import { Carousel } from 'react-responsive-carousel';
import CarouselImage from '../components/CarouselImage';
import styles from './Home.module.css';

const Home = () => {
    const { currentUser } = useAuth(); // Access currentUser from context

    if (!currentUser) {
        return <p>Please log in.</p>;
    }

    const height = "67vh";

    const images=[
        CarouselImage(
            {
                url:"https://plus.unsplash.com/premium_photo-1664530452597-fc48cc4a4e45?q=80&w=2372&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                height:height,
                header:"Jack&Rose",
                subheader:"December 13, 2024",
                daysUntilWedding:53,
                blur: true
            }
        ),
        CarouselImage(
            {
                url:"https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                height:height,
                header:"Adam&Belle",
                subheader:"January 15, 2025",
                daysUntilWedding:74,
                blur: true
            }
        ),
        CarouselImage(
            {
                url:"https://plus.unsplash.com/premium_photo-1674941363057-f331d959ee80?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                height:height,
                header:"Faust&Margaretha",
                subheader:"March 12, 2093",
                daysUntilWedding:9999,
                blur: true
            }
        ),
    ];

    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.carousel}>
                    <p className={styles.headerText}>Upcoming Events:</p>
                    <Carousel showThumbs={false} showStatus={false} width={"160vh"} dynamicHeight={false}>
                        {images[0]}
                        {images[1]}
                        {images[2]}
                    </Carousel>
                </div>
            </div>
        </div>
    );
};

export default Home;
