import { useEffect, useState } from "react";
import { getTasks, updateTask } from "../services/api";


export default function Board() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        try {
            const data = await getTasks();
            setTasks(data);
        } catch (err) {
            console.error("Failed to load board tasks", err);
        }
    }

    async function moveTask(taskId, newStatus) {
        try {
            await updateTaskStatus(taskId, newStatus);
            load(); // refresh board instantly
        } catch (err) {
            console.error("Failed to move task", err);
        }
    }

    const columns = [
        { status: "TODO", title: "To Do", color: "bg-gray-100" },
        { status: "IN_PROGRESS", title: "In Progress", color: "bg-yellow-100" },
        { status: "DONE", title: "Done", color: "bg-green-100" },
    ];

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Kanban Board</h1>

            <div className="grid grid-cols-3 gap-6">
                {columns.map((col) => (
                    <div key={col.status} className="p-4 bg-white rounded-xl shadow-md border">
                        <h2 className="text-xl font-semibold mb-4">{col.title}</h2>

                        <div className="flex flex-col gap-4">
                            {tasks
                                .filter((t) => t.status === col.status)
                                .map((task) => (
                                    <div
                                        key={task.id}
                                        className={`${col.color} p-4 rounded-lg shadow-sm border`}
                                    >
                                        <h3 className="font-bold text-lg">{task.title}</h3>
                                        <p className="text-sm text-gray-700">{task.description}</p>

                                        {/* Move buttons */}
                                        <div className="flex gap-2 mt-3">
                                            {col.status !== "TODO" && (
                                                <button
                                                    onClick={() => moveTask(task.id, "TODO")}
                                                    className="px-3 py-1 text-sm bg-gray-300 rounded-md"
                                                >
                                                    To Do
                                                </button>
                                            )}
                                            {col.status !== "IN_PROGRESS" && (
                                                <button
                                                    onClick={() => moveTask(task.id, "IN_PROGRESS")}
                                                    className="px-3 py-1 text-sm bg-yellow-400 rounded-md"
                                                >
                                                    Progress
                                                </button>
                                            )}
                                            {col.status !== "DONE" && (
                                                <button
                                                    onClick={() => moveTask(task.id, "DONE")}
                                                    className="px-3 py-1 text-sm bg-green-400 rounded-md"
                                                >
                                                    Done
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

