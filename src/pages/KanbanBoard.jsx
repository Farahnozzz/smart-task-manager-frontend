// src/pages/KanbanBoard.jsx
import React, { useEffect, useState } from "react";
import { getTasks, updateTask } from "../services/api";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskModal from "../components/TaskModal";

export default function KanbanBoard() {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        const data = await getTasks();
        setTasks(data || []);
    }

    const columns = [
        { id: "TODO", title: "To Do" },
        { id: "IN_PROGRESS", title: "In Progress" },
        { id: "DONE", title: "Done" }
    ];

    async function onDragEnd(result) {
        if (!result.destination) return;

        const taskId = result.draggableId;
        const newStatus = result.destination.droppableId;

        await updateTask(taskId, { status: newStatus });
        load();
    }

    function calcProgress(subtasks = []) {
        if (!subtasks.length) return 0;
        const done = subtasks.filter((s) => s.completed).length;
        return Math.round((done / subtasks.length) * 100);
    }

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <DragDropContext onDragEnd={onDragEnd}>
                {columns.map((col) => {
                    const columnTasks = tasks.filter((t) => t.status === col.id);

                    return (
                        <Droppable key={col.id} droppableId={col.id}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="rounded-lg p-4 min-h-[500px] border dark:border-neutral-700
                                    bg-white dark:bg-neutral-900 shadow-sm"
                                >
                                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        {col.title}
                                        <span className="text-sm px-2 py-0.5 rounded-full bg-gray-300 dark:bg-neutral-700">
                                            {columnTasks.length}
                                        </span>
                                    </h2>

                                    {columnTasks.map((task, index) => {
                                        const progress = calcProgress(task.subtasks);

                                        return (
                                            <Draggable
                                                key={task.id}
                                                draggableId={String(task.id)}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        onClick={() => setSelectedTask(task)}
                                                        className={`
                                                            p-4 mb-4 rounded-lg shadow-md cursor-pointer
                                                            bg-white dark:bg-neutral-800 
                                                            border dark:border-neutral-700
                                                            transition
                                                            ${
                                                            snapshot.isDragging
                                                                ? "ring-2 ring-blue-400 scale-[1.03]"
                                                                : ""
                                                        }
                                                        `}
                                                    >
                                                        <h3 className="font-semibold text-lg mb-2">
                                                            {task.title}
                                                        </h3>

                                                        {task.description && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                                                {task.description.slice(0, 80)}...
                                                            </p>
                                                        )}

                                                        {/* Progress Bar */}
                                                        {task.subtasks?.length > 0 && (
                                                            <div className="mb-3">
                                                                <div className="text-xs mb-1 text-gray-500">
                                                                    {progress}% completed
                                                                </div>
                                                                <div className="w-full h-2 bg-gray-200 dark:bg-neutral-700 rounded-full">
                                                                    <div
                                                                        className="h-2 rounded-full bg-blue-500"
                                                                        style={{ width: `${progress}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="flex justify-between text-sm mt-3">
                                                            {/* Priority */}
                                                            <span
                                                                className={`px-2 py-1 rounded text-xs font-semibold
                                                                    ${
                                                                    task.priority === "HIGH"
                                                                        ? "bg-red-100 text-red-700"
                                                                        : task.priority === "MEDIUM"
                                                                            ? "bg-yellow-100 text-yellow-700"
                                                                            : "bg-green-100 text-green-700"
                                                                }
                                                                `}
                                                            >
                                                                {task.priority}
                                                            </span>

                                                            {/* Due date */}
                                                            <span className="text-gray-600 dark:text-gray-300">
                                                                {task.dueDate || "No date"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        );
                                    })}

                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    );
                })}
            </DragDropContext>

            {/* Modal */}
            {selectedTask && (
                <TaskModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    reload={load}
                />
            )}
        </div>
    );
}



