import { useState } from "react";
import { addSubtask, updateTask } from "../services/api";

export default function EditTask({ task, onRefresh }) {
    const [title, setTitle] = useState(task.title);
    const [newSubtask, setNewSubtask] = useState("");

    const handleSave = async () => {
        await updateTask(task.id, { ...task, title });
        onRefresh();
    };

    const handleAddSubtask = async () => {
        if (!newSubtask.trim()) return;

        await addSubtask(task.id, { title: newSubtask });
        setNewSubtask("");
        onRefresh();
    };

    return (
        <div>
            <h2>Edit Task</h2>

            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <button onClick={handleSave}>Save</button>

            <h4>Subtasks</h4>
            <input
                placeholder="New subtask"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
            />
            <button onClick={handleAddSubtask}>Add</button>
        </div>
    );
}






