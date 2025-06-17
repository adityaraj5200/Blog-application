import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on initial load
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (token && username) {
            // Verify token is still valid by making a test request
            api.get('/auth/verify')
                .then(() => {
                    setIsAuthenticated(true);
                    setUser({ username });
                })
                .catch(() => {
                    // Token is invalid, clear storage
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    setIsAuthenticated(false);
                    setUser(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        const response = await api.post('/auth/login', {
            username,
            password
        });
        const { token, username: responseUsername } = response.data;
        
        // Store token and user info
        localStorage.setItem('token', token);
        localStorage.setItem('username', responseUsername);
        
        // Update auth state
        setIsAuthenticated(true);
        setUser({ username: responseUsername });
        
        return response.data;
    };

    const register = async (userData) => {
        const response = await api.post('/auth/register', userData);
        const { token, username } = response.data;
        
        // Store token and user info
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        
        // Update auth state
        setIsAuthenticated(true);
        setUser({ username });
        
        return response.data;
    };

    const logout = () => {
        // Clear storage and state
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
        setUser(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 