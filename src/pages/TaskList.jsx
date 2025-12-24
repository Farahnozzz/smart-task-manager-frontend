import React, { useEffect, useState } from "react";
import { getTasks, deleteTask } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Loader2, Pencil, Trash } from "lucide-react";

export default function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            try {
                const data = await getTasks();
                setTasks(data);
            } catch (error) {
                console.error("Failed to load tasks:", error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    async function handleDelete(id) {
        if (!confirm("Are you sure you want to delete this task?")) return;
        await deleteTask(id);
        setTasks(tasks.filter((t) => t.id !== id));
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full pt-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="text-center pt-10">
                <h2 className="text-xl font-semibold text-gray-400">No tasks yet</h2>
                <p className="text-gray-500">Create your first task to get started!</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Task Table View</h1>

            <table className="w-full bg-white rounded shadow">
                <thead>
                <tr className="border-b bg-gray-50">
                    <th className="py-3 px-6 text-left">Title</th>
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-left">Priority</th>
                    <th className="py-3 px-6 text-left">Due Date</th>
                    <th className="py-3 px-6 text-left">Urgency</th>
                    <th className="py-3 px-6 text-left">Actions</th>
                </tr>
                </thead>

                <tbody>
                {tasks.map((task) => (
                    <tr key={task.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-6">{task.title}</td>
                        <td className="py-3 px-6">{task.status}</td>
                        <td className="py-3 px-6">{task.priority}</td>
                        <td className="py-3 px-6">{task.dueDate || "—"}</td>
                        <td className="py-3 px-6">{task.urgencyScore}</td>

                        <td className="py-3 px-6 flex gap-2">
                            <button
                                onClick={() => navigate(`/tasks/edit/${task.id}`)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                            >
                                <Pencil size={16} />
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(task.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                            >
                                <Trash size={16} />
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}


