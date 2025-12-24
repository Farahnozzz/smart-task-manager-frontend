import { X } from "lucide-react";

export default function ProfilePanel({ onClose }) {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">

            <div className="w-80 bg-white dark:bg-neutral-900 h-full shadow-xl p-6 animate-slide-left">

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4">
                    <X size={24} />
                </button>

                <h2 className="text-xl font-semibold mb-4">Your Profile</h2>

                <div className="space-y-4">

                    <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800">
                        <p className="text-sm opacity-70">Username</p>
                        <p className="text-lg font-medium">Farahnoz</p>
                    </div>

                    <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800">
                        <p className="text-sm opacity-70">Email</p>
                        <p className="text-lg font-medium">farahnoz@example.com</p>
                    </div>

                </div>

                <button className="mt-6 w-full py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition">
                    Log Out
                </button>

            </div>
        </div>
    );
}
