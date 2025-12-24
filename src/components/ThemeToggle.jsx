import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-lg border dark:border-gray-600
                 bg-white dark:bg-gray-800
                 text-gray-900 dark:text-gray-100"
        >
            {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
    );
}
