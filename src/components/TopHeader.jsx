import { useState } from "react";
import { Moon, Sun, User } from "lucide-react";

export default function TopHeader() {
    const [dark, setDark] = useState(
        localStorage.getItem("theme") === "dark"
    );

    const [open, setOpen] = useState(false);

    function toggleTheme() {
        const newMode = dark ? "light" : "dark";
        setDark(!dark);
        document.documentElement.classList.toggle("dark", !dark);
        localStorage.setItem("theme", newMode);
    }

    return (
        <header className="flex justify-between items-center px-8 py-4 border-b bg-white dark:bg-gray-900 dark:text-white">
            <h2 className="text-xl font-semibold">Smart Task Manager</h2>

            <div className="flex items-center gap-5">

                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
                >
                    {dark ? <Sun size={18} /> : <Moon size={18} />}
                    {dark ? "Light" : "Dark"}
                </button>

                {/* Profile Button */}
                <button
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600"
                >
                    <User size={18} /> Profile
                </button>
            </div>

            {/* Profile Modal */}
            {open && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-96">
                        <h3 className="text-xl font-bold mb-4">User Profile</h3>

                        <div className="space-y-3 text-gray-700 dark:text-gray-300">
                            <p><strong>Name:</strong> Farahnoz 👩‍💻</p>
                            <p><strong>Email:</strong> user@example.com</p>
                            <p><strong>Role:</strong> Student / Developer</p>
                        </div>

                        <button
                            onClick={() => setOpen(false)}
                            className="mt-6 w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}


