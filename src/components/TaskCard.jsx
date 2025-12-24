import { deleteTask, updateTask } from "../services/api";

export default function TaskCard({ task, onChange }) {
    const toggleStatus = () => {
        const next =
            task.status === "TODO"
                ? "IN_PROGRESS"
                : task.status === "IN_PROGRESS"
                    ? "DONE"
                    : "TODO";

        updateTask(task.id, { ...task, status: next }).then(onChange);
    };

    return (
        <div className={`task-card ${task.status.toLowerCase()}`}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>

            <div className="meta">
        <span className={`priority ${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
                <span className="status">{task.status}</span>
            </div>

            <div className="actions">
                <button onClick={toggleStatus}>Next Status</button>
                <button className="danger" onClick={() => deleteTask(task.id).then(onChange)}>
                    Delete
                </button>
            </div>
        </div>
    );
}
