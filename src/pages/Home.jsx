import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';
// import styles from './Home.module.css';

const Home = () => {
    const { currentUser } = useAuth(); // Access currentUser from context

    if (!currentUser) {
        return <p>Please log in.</p>;
    }

    return (
        <div>
            <Navbar />
            {/* The Navbar is the only visible component on the Home screen */}
        </div>
    );
};

export default Home;
