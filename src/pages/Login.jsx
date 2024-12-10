import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { loginUser, createUser } from '../services/authService';
import styles from './Login.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        passwordConfirm: '',
        firstName: '',
        lastName: '',
        role: 'Participant',
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { user, token } = await loginUser(email, password);
            login(user, token); // Pass user and token to the login function
            navigate('/home');
        } catch (err) {
            setError(err.message || 'Failed to login.');
        }
    };


    const handleInputChange = (e) => {
        setNewUser({
            ...newUser,
            [e.target.name]: e.target.value,
        });
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const { user, token } = await createUser(newUser);
            login(user, token); // Log in the newly created user
            alert('User created successfully.');
            navigate('/home');
            setNewUser({
                email: '',
                password: '',
                passwordConfirm: '',
                firstName: '',
                lastName: '',
                role: 'Participant',
            });
        } catch (err) {
            setError(err.message || 'Failed to create user.');
        }
    };


    return (
        <div className={styles.pageBackground}>
            <div className={styles.loginContainer}>
                <h2 className={styles.heading}>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className={styles.formGroup}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>
                    <button type="submit" className={styles.button}>
                        Login
                    </button>
                </form>

                {error && <p className={styles.error}>{error}</p>}

                <h2 className={styles.heading}>Create New User</h2>
                <form onSubmit={handleCreateUser}>
                    <div className={styles.formGroup}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={newUser.email}
                            onChange={handleInputChange}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={newUser.password}
                            onChange={handleInputChange}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            type="password"
                            name="passwordConfirm"
                            placeholder="Password Confirm"
                            value={newUser.passwordConfirm}
                            onChange={handleInputChange}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={newUser.firstName}
                            onChange={handleInputChange}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={newUser.lastName}
                            onChange={handleInputChange}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <select
                            name="role"
                            value={newUser.role}
                            onChange={handleInputChange}
                            className={styles.select}
                        >
                            <option value="Participant">Participant</option>
                            <option value="Organizer">Organizer</option>
                        </select>
                    </div>
                    <button type="submit" className={styles.button}>
                        Create User
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
