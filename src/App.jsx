import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import Analytics from './pages/Analytics';
import CreateTask from './pages/CreateTask';
import TaskDetails from './pages/TaskDetails';
import './App.css';

function App() {
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode === 'true';
    });

    useEffect(() => {
        localStorage.setItem('darkMode', darkMode);
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    return (
        <Router>
            <AuthProvider>
                <div className={`app ${darkMode ? 'dark' : 'light'}`}>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Routes */}
                        <Route path="/" element={<Navigate to="/tasks" />} />
                        <Route path="/tasks" element={
                            <ProtectedRoute>
                                <>
                                    <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                                    <main className="main-content"><Tasks /></main>
                                </>
                            </ProtectedRoute>
                        } />
                        <Route path="/analytics" element={
                            <ProtectedRoute>
                                <>
                                    <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                                    <main className="main-content"><Analytics /></main>
                                </>
                            </ProtectedRoute>
                        } />
                        <Route path="/create-task" element={
                            <ProtectedRoute>
                                <>
                                    <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                                    <main className="main-content"><CreateTask /></main>
                                </>
                            </ProtectedRoute>
                        } />
                        <Route path="/task/:id" element={
                            <ProtectedRoute>
                                <>
                                    <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                                    <main className="main-content"><TaskDetails /></main>
                                </>
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;