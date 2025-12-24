import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

function Navbar({ darkMode, toggleDarkMode }) {
    const location = useLocation();
    const { user, logout } = useAuth();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/tasks" className="navbar-brand">
                    <span className="brand-icon">✨</span>
                    <span className="brand-text">SmartTask</span>
                </Link>

                <div className="navbar-links">
                    <Link
                        to="/tasks"
                        className={`nav-link ${isActive('/tasks') ? 'active' : ''}`}
                    >
                        <span className="nav-icon">📋</span>
                        <span>Tasks</span>
                    </Link>

                    <Link
                        to="/analytics"
                        className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}
                    >
                        <span className="nav-icon">📊</span>
                        <span>Analytics</span>
                    </Link>

                    <Link
                        to="/create-task"
                        className="nav-link create-btn"
                    >
                        <span className="nav-icon">+</span>
                        <span>New Task</span>
                    </Link>

                    <button
                        onClick={toggleDarkMode}
                        className="theme-toggle"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>

                    <div className="nav-user">
                        <span className="user-name">{user?.username}</span>
                        <button onClick={logout} className="logout-btn">
                            🚪 Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;