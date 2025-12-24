import Tasks from "./Tasks";

export default function Home() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">My Tasks</h1>
                <p className="text-gray-500 mt-1">
                    Manage your tasks efficiently
                </p>
            </div>

            <Tasks />
        </div>
    );
}
