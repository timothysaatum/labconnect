
export default function Skeleton({ children }) {
  return (
    <div className="animate-pulse w-full h-full bg-gray-200 dark:bg-gray-600">{children}</div>
  );
}

