// src/components/TaskModal.jsx
import React from "react";
import { updateTask } from "../services/api";

export default function TaskModal({ task, onClose, reload }) {
    if (!task) return null;

    async function toggleSubtask(index) {
        const updated = { ...task };
        updated.subtasks[index].completed = !updated.subtasks[index].completed;
        await updateTask(task.id, updated);
        reload();
    }

    async function changeStatus(status) {
        await updateTask(task.id, { ...task, status });
        reload();
    }

    return (
        <div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-neutral-900 rounded-lg w-full max-w-lg p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-4">{task.title}</h2>

                {/* Description */}
                {task.description && (
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {task.description}
                    </p>
                )}

                {/* Priority + Due Date */}
                <div className="flex justify-between mb-4">
                    <span className="px-3 py-1 text-xs rounded bg-gray-200 dark:bg-neutral-700">
                        Priority: {task.priority}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                        Due: {task.dueDate || "No date"}
                    </span>
                </div>

                {/* Subtasks */}
                {task.subtasks?.length > 0 && (
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Subtasks:</h3>
                        {task.subtasks.map((s, i) => (
                            <label
                                key={i}
                                className="flex items-center gap-2 mb-1 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={s.completed}
                                    onChange={() => toggleSubtask(i)}
                                />
                                <span>{s.title}</span>
                            </label>
                        ))}
                    </div>
                )}

                {/* Status buttons */}
                <div className="flex gap-3 mt-4">
                    {["TODO", "IN_PROGRESS", "DONE"].map((st) => (
                        <button
                            key={st}
                            className="px-3 py-1 rounded bg-blue-600 text-white"
                            onClick={() => changeStatus(st)}
                        >
                            {st}
                        </button>
                    ))}
                </div>

                {/* Close */}
                <button
                    className="mt-6 w-full py-2 bg-gray-300 dark:bg-neutral-700 rounded"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}
