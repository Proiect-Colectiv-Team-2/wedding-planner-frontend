import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import { Carousel } from 'react-responsive-carousel';
import CarouselImage from '../components/CarouselImage';
import styles from './Home.module.css';
import { useEffect, useState } from 'react';
import { getEvents } from "../services/eventService";

const Home = () => {
    const { currentUser } = useAuth(); // Access currentUser from context
    const [ events, setEvents ] = useState([]);
    const [ images, setImages ] = useState([]);

    if (!currentUser) {
        return <p>Please log in.</p>;
    }

    useEffect(() => 
    { 
        const fetchEvent = async () =>
        {
            try
            {
                const eventsData = await getEvents();
                //console.log(eventsData);
                const imageArray = [];

                for(let i = 0; i < eventsData.length; i++)
                {
                    if(eventsData[i].photos[0] !== undefined){
                        const calculateDaysUntil = (dateString) => {
                            const weddingDate = new Date(dateString);
                            const today = new Date();
                            const diffTime = weddingDate - today; 
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
                            return diffDays >= 0 ? diffDays : 0; 
                        };

                        const formatDate = (dateString) => {
                            const options = { year: 'numeric', month: 'long', day: '2-digit' };
                            return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
                        };
                        
                        imageArray.push(CarouselImage({
                            url: String(eventsData[i].photos[0].photoURL),
                            height: height,
                            header: eventsData[i].name,
                            subheader: formatDate(eventsData[i].startDateTime),
                            daysUntilWedding: calculateDaysUntil(eventsData[i].startDateTime),
                            blur: true
                        }));
                    }    
                }
                setImages(imageArray);
            }
            catch( err )
            {
                console.log(err)
            }
        }
        fetchEvent();
    }, []);

    const height = "67vh";


    // const images=[
    //     CarouselImage(
    //         {
    //             url:"https://plus.unsplash.com/premium_photo-1664530452597-fc48cc4a4e45?q=80&w=2372&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //             height:height,
    //             header:"Jack&Rose",
    //             subheader:"December 13, 2024",
    //             daysUntilWedding:53,
    //             blur: true
    //         }
    //     ),
    //     CarouselImage(
    //         {
    //             url:"https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //             height:height,
    //             header:"Adam&Belle",
    //             subheader:"January 15, 2025",
    //             daysUntilWedding:74,
    //             blur: true
    //         }
    //     ),
    //     CarouselImage(
    //         {
    //             url:"https://plus.unsplash.com/premium_photo-1674941363057-f331d959ee80?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //             height:height,
    //             header:"Faust&Margaretha",
    //             subheader:"March 12, 2093",
    //             daysUntilWedding:9999,
    //             blur: true
    //         }
    //     ),
    // ];

    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.carousel}>
                    <p className={styles.headerText}>Upcoming Events:</p>
                    <Carousel showThumbs={false} showStatus={false} width={"160vh"} dynamicHeight={false}>
                        {images.length > 0 ? (
                            images.map((image, index) => (
                                <div key={index}>
                                    {image}
                                </div>
                            ))
                        ) : (
                            <p>No events available.</p>
                        )}
                    </Carousel>
                </div>
            </div>
        </div>
    );
};

export default Home;
