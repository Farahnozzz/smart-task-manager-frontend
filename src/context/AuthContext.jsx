import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            validateToken();
        } else {
            setLoading(false);
        }
    }, []);

    const validateToken = async () => {
        try {
            const response = await fetch('http://localhost:8080/auth/validate', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser({ username: data.username });
            } else {
                logout();
            }
        } catch (error) {
            console.error('Token validation failed:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                setToken(data.token);
                setUser({ username: data.username });
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                navigate('/tasks');
                return { success: true };
            } else {
                return { success: false, message: data.message || 'Login failed' };
            }
        } catch (error) {
            return { success: false, message: 'Network error' };
        }
    };

    const register = async (username, password) => {
        try {
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                setToken(data.token);
                setUser({ username: data.username });
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                navigate('/tasks');
                return { success: true };
            } else {
                return { success: false, message: data.message || 'Registration failed' };
            }
        } catch (error) {
            return { success: false, message: 'Network error' };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};