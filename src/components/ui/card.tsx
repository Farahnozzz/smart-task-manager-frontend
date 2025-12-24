export function Card({ children, className = "" }) {
    return (
        <div
            className={`rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${className}`}
        >
            {children}
        </div>
    );
}


