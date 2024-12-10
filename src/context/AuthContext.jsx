import React, { createContext, useState } from 'react';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    const login = (user, token) => {
        setCurrentUser(user);
        // Set the token in a secure cookie
        Cookies.set('token', token, { expires: 1, secure: true, sameSite: 'Strict' });
    };

    const logout = () => {
        setCurrentUser(null);
        Cookies.remove('token'); // Remove the token cookie on logout
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
