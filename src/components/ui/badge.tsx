export function Badge({ children, variant }) {
    const styles = {
        primary: "bg-brand text-white",
        secondary: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[variant] || styles.primary}`}>
      {children}
    </span>
    );
}
