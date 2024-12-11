import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './AuthCotext.css';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state to prevent premature redirect

    useEffect(() => {
        const token = Cookies.get('token');
        const user = Cookies.get('user');

        if (token && user) {
            try {
                const parsedUser = JSON.parse(user);
                setCurrentUser(parsedUser);  // Set user if cookies are valid
            } catch (error) {
                console.error("Failed to parse user from cookies:", error);
                setCurrentUser(null);  // Clear user if invalid data
            }
        } else {
            setCurrentUser(null);  // No valid token or user, set to null
        }
        setLoading(false); // Set loading to false after checking cookies
    }, []);

    const login = (user, token) => {
        setCurrentUser(user);
        Cookies.set('token', token, { expires: 1, secure: true, sameSite: 'Strict' });
        Cookies.set('user', JSON.stringify(user), { expires: 1, secure: true, sameSite: 'Strict' });
    };

    const logout = () => {
        setCurrentUser(null);
        Cookies.remove('token');
        Cookies.remove('user');
    };

    if (loading) {
        return <div className='loading__screen'>
            <p>
                Loading...
            </p>
        </div>;
    }

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
