import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import styles from './Navbar.module.css';

const Navbar = () => {
    const { currentUser, logout } = useAuth(); // Access currentUser and logout function
    const navigate = useNavigate();

    // Handle navigation to different routes
    const handleNavigation = (path) => {
        navigate(path);
    };

    // Handle user logout
    const handleLogout = () => {
        logout();
        navigate('/'); // Redirect to Login page after logout
    };

    return (
        <div className={styles.navbar}>
            {/* Check if currentUser exists before accessing properties */}
            {currentUser ? (
                <div className={styles.userInfo}>
                    <h2 className={styles.userName}>
                        {currentUser.firstName
                            ? `${currentUser.firstName} ${currentUser.lastName}`
                            : currentUser.email}
                    </h2>
                    <p className={styles.userRole}>{currentUser.role}</p>
                </div>
            ) : (
                <p>Loading user data...</p> // Display a loading indicator or placeholder
            )}

            {/* Navigation Links */}
            <ul className={styles.navList}>
                <li className={styles.navItem} onClick={() => handleNavigation('/home')}>Home</li>
                <li className={styles.navItem} onClick={() => handleNavigation('/myevents')}>My Events</li>
            </ul>

            {/* Action Links */}
            <div className={styles.actionLinks}>
                <button className={styles.actionButton} onClick={() => handleNavigation('/create-event')}>Create Event</button>
                <button className={styles.actionButton} onClick={handleLogout}>Log Out</button>
            </div>
        </div>
    );
};

export default Navbar;
