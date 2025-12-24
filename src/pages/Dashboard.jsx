import React, { useEffect, useState } from "react";
import { getTasks } from "../services/api";
import { PieChart, Pie, Cell, BarChart, XAxis, YAxis, Tooltip, Bar } from "recharts";

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        const data = await getTasks();
        setTasks(data);
    }

    const statusData = [
        { name: "TODO", value: tasks.filter(t => t.status === "TODO").length },
        { name: "IN_PROGRESS", value: tasks.filter(t => t.status === "IN_PROGRESS").length },
        { name: "DONE", value: tasks.filter(t => t.status === "DONE").length },
    ];

    const priorityData = [
        { name: "HIGH", value: tasks.filter(t => t.priority === "HIGH").length },
        { name: "MEDIUM", value: tasks.filter(t => t.priority === "MEDIUM").length },
        { name: "LOW", value: tasks.filter(t => t.priority === "LOW").length },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* Pie Chart - Status */}
                <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow">
                    <h2 className="text-xl mb-4">Tasks by Status</h2>
                    <PieChart width={350} height={300}>
                        <Pie
                            data={statusData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            label
                        >
                            <Cell fill="#2563eb" />
                            <Cell fill="#eab308" />
                            <Cell fill="#22c55e" />
                        </Pie>
                    </PieChart>
                </div>

                {/* Bar Chart - Priority */}
                <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow">
                    <h2 className="text-xl mb-4">Tasks by Priority</h2>
                    <BarChart width={350} height={300} data={priorityData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#60a5fa" />
                    </BarChart>
                </div>
            </div>
        </div>
    );
}



