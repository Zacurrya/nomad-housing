interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({ message, size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8 border-2",
    md: "w-16 h-16 border-4",
    lg: "w-24 h-24 border-4",
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`${sizeClasses[size]} border-gray-300 border-t-[#062b3f] rounded-full animate-spin`}></div>
      {message && <p className="text-gray-600 text-lg">{message}</p>}
    </div>
  );
}
