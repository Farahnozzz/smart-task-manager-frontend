import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";

export default function Layout({ children }) {
    return (
        <div className="flex h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Top Header + Content */}
            <div className="flex flex-col flex-1">
                <TopHeader />

                {/* Main content area */}
                <main className="p-10 overflow-y-auto">
                    <div className="max-w-5xl mx-auto space-y-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}


