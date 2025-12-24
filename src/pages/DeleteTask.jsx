import React, { useEffect, useState } from "react";
import { getTask, deleteTask } from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

export default function DeleteTask() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);

    useEffect(() => {
        async function load() {
            const data = await getTask(id);
            setTask(data);
        }
        load();
    }, [id]);

    async function handleDelete() {
        await deleteTask(id);
        navigate("/tasks");
    }

    if (!task) {
        return (
            <div className="flex justify-center items-center h-screen dark:bg-gray-900">
                <p className="text-gray-600 dark:text-gray-300">Loading...</p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center
                        bg-black bg-opacity-50 backdrop-blur-sm
                        dark:bg-opacity-60 p-4">

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md
                            shadow-xl border dark:border-gray-700">

                <h2 className="text-xl font-bold mb-2 dark:text-gray-100">
                    Delete Task
                </h2>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Are you sure you want to delete:
                    <span className="font-semibold"> "{task.title}"</span>?
                </p>

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={() => navigate("/tasks")}
                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400
                                   dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 rounded bg-red-600 hover:bg-red-700
                                   text-white"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

