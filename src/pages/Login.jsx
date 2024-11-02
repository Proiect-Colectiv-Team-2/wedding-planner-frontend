import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from "../hooks/useAuth";
import { getUsers, createUser } from '../services/userService';

import styles from './Login.module.css';

const Login = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const { login } = useAuth(); // Use custom hook
    const navigate = useNavigate();


    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'Participant',
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userList = await getUsers();
                setUsers(userList);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleUserSelect = (e) => {
        setSelectedUserId(e.target.value);
    };

    const handleLogin = () => {
        const user = users.find((u) => u._id === selectedUserId);
        if (user) {
            login(user);
            navigate('/home');
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
            const newUserResponse = await createUser(newUser);
            alert('User was added');
            setUsers((prevUsers) => [...prevUsers, newUserResponse]);
            setNewUser({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                role: 'Participant',
            });
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <div className={styles.pageBackground}>
            <div className={styles.loginContainer}>
                <h2 className={styles.heading}>Select User</h2>
                <div className={styles.loginButtonGroup}>
                    <select value={selectedUserId} onChange={handleUserSelect} className={styles.select}>
                        <option value="" disabled>
                            -- Select a user --
                        </option>
                        {users.map((user) => (
                            <option key={user._id} value={user._id}>
                                {user.email} ({user.role})
                            </option>
                        ))}
                    </select>
                    <button onClick={handleLogin} disabled={!selectedUserId} className={styles.button}>
                        Login
                    </button>
                </div>

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
                        Add User
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
