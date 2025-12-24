export function Textarea({ className = "", ...props }) {
    return (
        <textarea
            {...props}
            className={`
        border rounded-xl px-4 py-2 w-full
        transition-all duration-200
        focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-300
        focus:border-transparent
        ${className}
      `}
        />
    );
}
