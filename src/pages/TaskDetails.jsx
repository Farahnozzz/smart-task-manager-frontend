import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/TaskDetails.css';

function TaskDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newSubtask, setNewSubtask] = useState('');
    const [newComment, setNewComment] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState({});
    const [timerRunning, setTimerRunning] = useState(false);
    const [timeSpent, setTimeSpent] = useState(0);
    const [timerInterval, setTimerInterval] = useState(null);

    useEffect(() => {
        fetchTaskDetails();
    }, [id]);

    useEffect(() => {
        if (timerRunning) {
            const interval = setInterval(() => {
                setTimeSpent(prev => prev + 1);
            }, 1000);
            setTimerInterval(interval);
        } else if (timerInterval) {
            clearInterval(timerInterval);
        }
        return () => {
            if (timerInterval) clearInterval(timerInterval);
        };
    }, [timerRunning]);

    const fetchTaskDetails = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/tasks/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Failed to fetch task');
            const data = await response.json();
            setTask(data);
            setEditedTask(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...task, status: newStatus })
            });
            if (!response.ok) throw new Error('Failed to update status');
            fetchTaskDetails();
        } catch (err) {
            alert('Error updating status: ' + err.message);
        }
    };

    const handleAddSubtask = async (e) => {
        e.preventDefault();
        if (!newSubtask.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/tasks/${id}/subtasks`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: newSubtask, completed: false })
            });
            if (!response.ok) throw new Error('Failed to add subtask');
            setNewSubtask('');
            fetchTaskDetails();
        } catch (err) {
            alert('Error adding subtask: ' + err.message);
        }
    };

    const toggleSubtask = async (subtaskId, completed) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/tasks/${id}/subtasks/${subtaskId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completed: !completed })
            });
            if (!response.ok) throw new Error('Failed to update subtask');
            fetchTaskDetails();
        } catch (err) {
            alert('Error updating subtask: ' + err.message);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/tasks/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: newComment })
            });
            if (!response.ok) throw new Error('Failed to add comment');
            setNewComment('');
            fetchTaskDetails();
        } catch (err) {
            alert('Error adding comment: ' + err.message);
        }
    };

    const handleSaveEdit = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editedTask)
            });
            if (!response.ok) throw new Error('Failed to update task');
            setIsEditing(false);
            fetchTaskDetails();
        } catch (err) {
            alert('Error updating task: ' + err.message);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Failed to delete task');
            navigate('/tasks');
        } catch (err) {
            alert('Error deleting task: ' + err.message);
        }
    };

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No due date';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="task-details-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading task details...</p>
                </div>
            </div>
        );
    }

    if (error || !task) {
        return (
            <div className="task-details-page">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <h2>Task not found</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/tasks')} className="back-btn">
                        ← Back to Tasks
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="task-details-page">
            <div className="task-details-header">
                <button onClick={() => navigate('/tasks')} className="back-btn">
                    ← Back to Tasks
                </button>
                <div className="header-actions">
                    <button onClick={() => setIsEditing(!isEditing)} className="edit-btn">
                        {isEditing ? '✕ Cancel' : '✏️ Edit'}
                    </button>
                    <button onClick={handleDelete} className="delete-btn">
                        🗑️ Delete
                    </button>
                </div>
            </div>

            <div className="task-details-container">
                {/* Main Task Info */}
                <div className="task-main-section">
                    {isEditing ? (
                        <div className="edit-form">
                            <input
                                type="text"
                                className="edit-title"
                                value={editedTask.title}
                                onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                            />
                            <textarea
                                className="edit-description"
                                value={editedTask.description}
                                onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                                rows="4"
                            />
                            <div className="edit-fields">
                                <div className="field-group">
                                    <label>Due Date</label>
                                    <input
                                        type="date"
                                        value={editedTask.dueDate || ''}
                                        onChange={(e) => setEditedTask({...editedTask, dueDate: e.target.value})}
                                    />
                                </div>
                                <div className="field-group">
                                    <label>Priority</label>
                                    <select
                                        value={editedTask.priority}
                                        onChange={(e) => setEditedTask({...editedTask, priority: e.target.value})}
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                </div>
                            </div>
                            <button onClick={handleSaveEdit} className="save-btn">
                                💾 Save Changes
                            </button>
                        </div>
                    ) : (
                        <>
                            <h1 className="task-main-title">{task.title}</h1>
                            <p className="task-main-description">{task.description || 'No description provided'}</p>

                            <div className="task-meta-grid">
                                <div className="meta-card">
                                    <span className="meta-label">📅 Due Date</span>
                                    <span className="meta-value">{formatDate(task.dueDate)}</span>
                                </div>
                                <div className="meta-card">
                                    <span className="meta-label">⚡ Priority</span>
                                    <span className={`priority-badge priority-${task.priority?.toLowerCase()}`}>
                                        {task.priority}
                                    </span>
                                </div>
                                <div className="meta-card">
                                    <span className="meta-label">📊 Status</span>
                                    <select
                                        className={`status-select status-${task.status?.toLowerCase()}`}
                                        value={task.status}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                    >
                                        <option value="TODO">To Do</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="DONE">Done</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Timer Section */}
                    <div className="timer-section">
                        <h3>⏱️ Task Timer</h3>
                        <div className="timer-display">{formatTime(timeSpent)}</div>
                        <div className="timer-controls">
                            <button
                                onClick={() => setTimerRunning(!timerRunning)}
                                className={`timer-btn ${timerRunning ? 'pause' : 'start'}`}
                            >
                                {timerRunning ? '⏸️ Pause' : '▶️ Start'}
                            </button>
                            <button
                                onClick={() => { setTimeSpent(0); setTimerRunning(false); }}
                                className="timer-btn reset"
                            >
                                🔄 Reset
                            </button>
                        </div>
                    </div>

                    {/* Subtasks */}
                    <div className="subtasks-section">
                        <h3>📋 Subtasks ({task.subtasks?.filter(st => st.completed).length || 0}/{task.subtasks?.length || 0})</h3>

                        <form onSubmit={handleAddSubtask} className="add-subtask-form">
                            <input
                                type="text"
                                placeholder="Add a new subtask..."
                                value={newSubtask}
                                onChange={(e) => setNewSubtask(e.target.value)}
                                className="subtask-input"
                            />
                            <button type="submit" className="add-subtask-btn">+ Add</button>
                        </form>

                        <div className="subtasks-list">
                            {task.subtasks?.map(subtask => (
                                <div key={subtask.id} className="subtask-item">
                                    <input
                                        type="checkbox"
                                        checked={subtask.completed}
                                        onChange={() => toggleSubtask(subtask.id, subtask.completed)}
                                        className="subtask-checkbox"
                                    />
                                    <span className={subtask.completed ? 'completed' : ''}>
                                        {subtask.title}
                                    </span>
                                </div>
                            ))}
                            {(!task.subtasks || task.subtasks.length === 0) && (
                                <p className="empty-message">No subtasks yet. Add one above!</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="task-sidebar">
                    {/* Comments */}
                    <div className="comments-section">
                        <h3>💬 Comments</h3>

                        <form onSubmit={handleAddComment} className="add-comment-form">
                            <textarea
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="comment-textarea"
                                rows="3"
                            />
                            <button type="submit" className="add-comment-btn">Post Comment</button>
                        </form>

                        <div className="comments-list">
                            {task.comments?.map(comment => (
                                <div key={comment.id} className="comment-item">
                                    <p className="comment-text">{comment.text}</p>
                                    <span className="comment-date">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                            {(!task.comments || task.comments.length === 0) && (
                                <p className="empty-message">No comments yet. Be the first!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskDetails;