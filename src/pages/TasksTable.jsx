// src/pages/TasksTable.jsx
import React, { useEffect, useState } from "react";
import { getTasks } from "../services/api";
import { Link } from "react-router-dom";

export default function TasksTable() {
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [sortBy, setSortBy] = useState("dueDate");

    useEffect(() => {
        load();
    }, []);

    async function load() {
        try {
            const data = await getTasks();
            setTasks(data || []);
        } catch (err) {
            console.error("Error loading:", err);
        }
    }

    // --------------------------
    // Badge styles
    // --------------------------
    const priorityColors = {
        HIGH: "bg-red-100 text-red-700 border border-red-300",
        MEDIUM: "bg-yellow-100 text-yellow-700 border border-yellow-300",
        LOW: "bg-green-100 text-green-700 border border-green-300",
    };

    const statusColors = {
        TODO: "bg-gray-200 text-gray-700",
        IN_PROGRESS: "bg-blue-200 text-blue-700",
        DONE: "bg-green-200 text-green-700",
    };

    function formatDueDate(date) {
        if (!date) return "No date";

        const today = new Date();
        const due = new Date(date);

        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return <span className="text-red-600 font-semibold">Overdue</span>;
        if (diffDays === 0) return <span className="text-orange-600 font-semibold">Today</span>;
        if (diffDays <= 3) return <span className="text-yellow-600">{diffDays} days left</span>;

        return date;
    }

    function calcProgress(task) {
        if (!task.subtasks || task.subtasks.length === 0) return "0%";

        const completed = task.subtasks.filter((s) => s.completed).length;
        const percent = Math.round((completed / task.subtasks.length) * 100);

        return percent + "%";
    }

    // --------------------------
    // FILTERING
    // --------------------------
    const filtered = tasks
        .filter((t) =>
            t.title.toLowerCase().includes(search.toLowerCase())
        )
        .filter((t) =>
            filterStatus === "ALL" ? true : t.status === filterStatus
        )
        .sort((a, b) => {
            if (sortBy === "dueDate") return new Date(a.dueDate) - new Date(b.dueDate);
            if (sortBy === "priority") return a.priority.localeCompare(b.priority);
            return 0;
        });

    return (
        <div className="p-6">

            <h1 className="text-2xl font-bold mb-4">Tasks Table (Dashboard Style)</h1>

            {/* Search + Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-3 py-2 rounded-md"
                />

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border px-3 py-2 rounded-md"
                >
                    <option value="ALL">All</option>
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border px-3 py-2 rounded-md"
                >
                    <option value="dueDate">Sort by Due Date</option>
                    <option value="priority">Sort by Priority</option>
                </select>
            </div>

            {/* TABLE */}
            <div className="overflow-auto shadow-md rounded-lg">
                <table className="w-full bg-white dark:bg-neutral-900 border-collapse">
                    <thead className="bg-gray-100 dark:bg-neutral-800 text-left text-sm uppercase text-gray-600 dark:text-gray-300">
                    <tr>
                        <th className="p-3">Title</th>
                        <th className="p-3">Priority</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Due Date</th>
                        <th className="p-3">Progress</th>
                        <th className="p-3">Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filtered.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center py-6 text-gray-500">
                                No tasks found.
                            </td>
                        </tr>
                    )}

                    {filtered.map((task) => (
                        <tr
                            key={task.id}
                            className="border-t dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800"
                        >
                            <td className="p-3 font-medium">{task.title}</td>

                            <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${priorityColors[task.priority]}`}>
                                        {task.priority}
                                    </span>
                            </td>

                            <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[task.status]}`}>
                                        {task.status}
                                    </span>
                            </td>

                            <td className="p-3">{formatDueDate(task.dueDate)}</td>

                            <td className="p-3">{calcProgress(task)}</td>

                            <td className="p-3">
                                <Link
                                    className="text-blue-600 hover:underline mr-3"
                                    to={`/edit/${task.id}`}
                                >
                                    Edit
                                </Link>
                                <Link
                                    className="text-red-600 hover:underline"
                                    to={`/delete/${task.id}`}
                                >
                                    Delete
                                </Link>
                            </td>

                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

