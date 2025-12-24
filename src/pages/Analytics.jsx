import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/Analytics.css';

function Analytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:8080/analytics', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch analytics');
            }
            const data = await response.json();
            setAnalytics(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="analytics-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="analytics-page">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <h2>Failed to load analytics</h2>
                    <p>{error}</p>
                    <button onClick={fetchAnalytics} className="retry-button">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Prepare data for charts
    const statusData = [
        { name: 'To Do', value: analytics.toDo, color: '#94a3b8' },
        { name: 'In Progress', value: analytics.inProgress, color: '#60a5fa' },
        { name: 'Done', value: analytics.done, color: '#34d399' }
    ];

    const barData = [
        { name: 'To Do', count: analytics.toDo },
        { name: 'In Progress', count: analytics.inProgress },
        { name: 'Done', count: analytics.done }
    ];

    const completionRate = analytics.totalTasks > 0
        ? ((analytics.done / analytics.totalTasks) * 100).toFixed(1)
        : 0;

    const inProgressRate = analytics.totalTasks > 0
        ? ((analytics.inProgress / analytics.totalTasks) * 100).toFixed(1)
        : 0;

    return (
        <div className="analytics-page">
            <div className="analytics-header">
                <div>
                    <h1>📊 Analytics Dashboard</h1>
                    <p className="subtitle">Track your productivity and task completion</p>
                </div>
                <button onClick={fetchAnalytics} className="refresh-btn">
                    🔄 Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card total">
                    <div className="stat-icon">📋</div>
                    <div className="stat-content">
                        <h3>Total Tasks</h3>
                        <p className="stat-number">{analytics.totalTasks}</p>
                    </div>
                </div>

                <div className="stat-card todo">
                    <div className="stat-icon">📝</div>
                    <div className="stat-content">
                        <h3>To Do</h3>
                        <p className="stat-number">{analytics.toDo}</p>
                    </div>
                </div>

                <div className="stat-card progress">
                    <div className="stat-icon">⚡</div>
                    <div className="stat-content">
                        <h3>In Progress</h3>
                        <p className="stat-number">{analytics.inProgress}</p>
                        <span className="stat-percentage">{inProgressRate}%</span>
                    </div>
                </div>

                <div className="stat-card done">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <h3>Completed</h3>
                        <p className="stat-number">{analytics.done}</p>
                        <span className="stat-percentage">{completionRate}%</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            {analytics.totalTasks > 0 ? (
                <div className="charts-container">
                    {/* Pie Chart */}
                    <div className="chart-card">
                        <h2 className="chart-title">Task Distribution</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Bar Chart */}
                    <div className="chart-card">
                        <h2 className="chart-title">Tasks by Status</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip
                                    contentStyle={{
                                        background: '#fff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="count" fill="#667eea" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ) : (
                <div className="no-data-message">
                    <div className="no-data-icon">📈</div>
                    <h3>No data available yet</h3>
                    <p>Create some tasks to see your analytics here!</p>
                </div>
            )}

            {/* Progress Bar */}
            {analytics.totalTasks > 0 && (
                <div className="progress-section">
                    <h2 className="section-title">Overall Completion Progress</h2>
                    <div className="progress-bar-container">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${completionRate}%` }}
                            >
                                <span className="progress-text">{completionRate}%</span>
                            </div>
                        </div>
                        <p className="progress-info">
                            {analytics.done} out of {analytics.totalTasks} tasks completed
                        </p>
                    </div>
                </div>
            )}

            {/* Insights */}
            {analytics.totalTasks > 0 && (
                <div className="insights-section">
                    <h2 className="section-title">💡 Insights</h2>
                    <div className="insights-grid">
                        {completionRate >= 70 && (
                            <div className="insight-card success">
                                <span className="insight-icon">🎉</span>
                                <p>Great job! You're making excellent progress with {completionRate}% completion rate.</p>
                            </div>
                        )}
                        {analytics.inProgress > analytics.done && (
                            <div className="insight-card warning">
                                <span className="insight-icon">⚠️</span>
                                <p>You have more tasks in progress than completed. Try to finish some before starting new ones!</p>
                            </div>
                        )}
                        {analytics.toDo > analytics.totalTasks / 2 && (
                            <div className="insight-card info">
                                <span className="insight-icon">📌</span>
                                <p>You have many pending tasks. Consider prioritizing and breaking them into smaller steps.</p>
                            </div>
                        )}
                        {completionRate < 30 && analytics.totalTasks > 0 && (
                            <div className="insight-card motivate">
                                <span className="insight-icon">💪</span>
                                <p>Keep going! Every completed task is a step forward. Start with small wins!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Analytics;