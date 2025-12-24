import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Tasks.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            const data = await response.json();
            setTasks(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadgeClass = (status) => {
        const statusMap = {
            'TODO': 'status-badge status-todo',
            'IN_PROGRESS': 'status-badge status-progress',
            'DONE': 'status-badge status-done'
        };
        return statusMap[status] || 'status-badge';
    };

    const getPriorityBadgeClass = (priority) => {
        const priorityMap = {
            'HIGH': 'priority-badge priority-high',
            'MEDIUM': 'priority-badge priority-medium',
            'LOW': 'priority-badge priority-low'
        };
        return priorityMap[priority] || 'priority-badge';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No due date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isOverdue = (dueDate, status) => {
        if (!dueDate || status === 'DONE') return false;
        return new Date(dueDate) < new Date();
    };

    if (loading) {
        return (
            <div className="page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading tasks...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <h2>Oops! Something went wrong</h2>
                    <p>{error}</p>
                    <button onClick={fetchTasks} className="retry-button">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="tasks-header">
                <div className="header-content">
                    <h1>📋 My Tasks</h1>
                    <p className="subtitle">Manage and track your tasks efficiently</p>
                </div>
                <button
                    onClick={() => navigate('/create-task')}
                    className="create-task-btn"
                >
                    <span className="btn-icon">+</span>
                    New Task
                </button>
            </div>

            {tasks.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h2>No tasks yet</h2>
                    <p>Create your first task to get started!</p>
                    <button
                        onClick={() => navigate('/create-task')}
                        className="create-task-btn-large"
                    >
                        Create First Task
                    </button>
                </div>
            ) : (
                <div className="tasks-grid">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`task-card ${isOverdue(task.dueDate, task.status) ? 'overdue' : ''}`}
                        >
                            {isOverdue(task.dueDate, task.status) && (
                                <div className="overdue-banner">⏰ Overdue</div>
                            )}

                            <div className="task-card-header">
                                <h3 className="task-title">{task.title}</h3>
                                <div className="task-badges">
                                    <span className={getStatusBadgeClass(task.status)}>
                                        {task.status.replace('_', ' ')}
                                    </span>
                                    <span className={getPriorityBadgeClass(task.priority)}>
                                        {task.priority}
                                    </span>
                                </div>
                            </div>

                            <p className="task-description">
                                {task.description || 'No description provided'}
                            </p>

                            <div className="task-meta">
                                <div className="meta-item">
                                    <span className="meta-icon">📅</span>
                                    <span className="meta-text">{formatDate(task.dueDate)}</span>
                                </div>
                                {task.subtasks && task.subtasks.length > 0 && (
                                    <div className="meta-item">
                                        <span className="meta-icon">✓</span>
                                        <span className="meta-text">
                                            {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="task-actions">
                                <button
                                    onClick={() => navigate(`/task/${task.id}`)}
                                    className="action-btn view-btn"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Tasks;