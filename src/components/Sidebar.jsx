import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const { pathname } = useLocation();

    const linkStyle = (path) =>
        `flex items-center gap-3 px-5 py-3 rounded-xl text-lg transition-all 
     ${pathname === path ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" : "text-gray-700 hover:bg-gray-200"}`;

    return (
        <div className="w-64 bg-white h-screen border-r flex flex-col justify-between p-6">

            {/* Logo */}
            <div>
                <h1 className="text-3xl font-bold mb-10 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                    Smart Tasks
                </h1>

                {/* Links */}
                <nav className="flex flex-col gap-3">

                    <Link to="/tasks" className={linkStyle("/tasks")}>
                        <i className="fa-solid fa-list-check"></i> Tasks
                    </Link>

                    <Link to="/create" className={linkStyle("/create")}>
                        <i className="fa-solid fa-plus"></i> Create Task
                    </Link>

                    <Link to="/board" className={linkStyle("/board")}>
                        <i className="fa-solid fa-table-columns"></i> Board
                    </Link>

                    <Link to="/dashboard" className={linkStyle("/dashboard")}>
                        <i className="fa-solid fa-chart-pie"></i> Dashboard
                    </Link>

                </nav>
            </div>

            {/* Footer */}
            <footer className="text-gray-400 text-sm">
                © 2025
            </footer>
        </div>
    );
}



