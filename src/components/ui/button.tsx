export function Button({ children, className = "", ...props }) {
    return (
        <button
            {...props}
            className={`
        px-4 py-2 rounded-xl font-semibold
        bg-purple-500 text-white
        transition-all duration-200
        hover:opacity-90 active:scale-95
        ${className}
      `}
        >
            {children}
        </button>
    );
}
