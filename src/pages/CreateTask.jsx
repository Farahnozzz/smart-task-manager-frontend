import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateTask.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function CreateTask() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'MEDIUM',
        status: 'TODO'
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
        }

        if (formData.description && formData.description.length > 500) {
            newErrors.description = 'Description must be less than 500 characters';
        }

        if (formData.dueDate) {
            const selectedDate = new Date(formData.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                newErrors.dueDate = 'Due date cannot be in the past';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to create task');
            }

            const data = await response.json();
            navigate(`/task/${data.id}`);
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Failed to create task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/tasks');
    };

    return (
        <div className="create-task-page">
            <div className="create-task-container">
                <div className="create-task-header">
                    <h1>✨ Create New Task</h1>
                    <p className="subtitle">Fill in the details to create your task</p>
                </div>

                <form onSubmit={handleSubmit} className="create-task-form">
                    {/* Title Field */}
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">
                            Task Title <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`form-input ${errors.title ? 'error' : ''}`}
                            placeholder="Enter task title..."
                            maxLength="100"
                        />
                        {errors.title && <span className="error-message">{errors.title}</span>}
                        <span className="char-count">{formData.title.length}/100</span>
                    </div>

                    {/* Description Field */}
                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={`form-textarea ${errors.description ? 'error' : ''}`}
                            placeholder="Enter task description..."
                            rows="5"
                            maxLength="500"
                        />
                        {errors.description && <span className="error-message">{errors.description}</span>}
                        <span className="char-count">{formData.description.length}/500</span>
                    </div>

                    {/* Due Date and Priority Row */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="dueDate" className="form-label">
                                📅 Due Date
                            </label>
                            <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className={`form-input ${errors.dueDate ? 'error' : ''}`}
                                min={new Date().toISOString().split('T')[0]}
                            />
                            {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="priority" className="form-label">
                                ⚡ Priority
                            </label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="LOW">🟢 Low</option>
                                <option value="MEDIUM">🟡 Medium</option>
                                <option value="HIGH">🔴 High</option>
                            </select>
                        </div>
                    </div>

                    {/* Status Field */}
                    <div className="form-group">
                        <label htmlFor="status" className="form-label">
                            📊 Initial Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="TODO">📝 To Do</option>
                            <option value="IN_PROGRESS">⚡ In Progress</option>
                            <option value="DONE">✅ Done</option>
                        </select>
                    </div>

                    {/* Preview Card */}
                    <div className="preview-section">
                        <h3>👀 Preview</h3>
                        <div className="task-preview-card">
                            <div className="preview-header">
                                <h4>{formData.title || 'Task Title'}</h4>
                                <div className="preview-badges">
                                    <span className={`badge-priority priority-${formData.priority.toLowerCase()}`}>
                                        {formData.priority}
                                    </span>
                                    <span className={`badge-status status-${formData.status.toLowerCase()}`}>
                                        {formData.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                            <p className="preview-description">
                                {formData.description || 'No description provided'}
                            </p>
                            <div className="preview-meta">
                                <span>📅 {formData.dueDate ? new Date(formData.dueDate).toLocaleDateString() : 'No due date'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="btn-cancel"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-small"></span>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <span>✨</span>
                                    Create Task
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateTask;
