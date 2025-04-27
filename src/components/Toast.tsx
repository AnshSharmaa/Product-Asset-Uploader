import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Toast: React.FC<ToastProps> = ({
  message,
  isError = false,
  isOpen,
  onClose,
  duration = 2000,
}) => {
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(onClose, duration);
      return () => clearTimeout(t);
    }
  }, [isOpen, onClose, duration]);

  // Don't render anything if the toast is closed
  if (!isOpen) return null;

  // Determine the variant based on the isError prop
  const variant: ToastVariant = isError ? "error" : "success";

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 max-w-sm w-full shadow-lg flex items-center gap-3 p-4 rounded-lg backdrop-blur-sm transition-all duration-300 transform",
        variant === "error"
          ? "bg-destructive/90 text-destructive-foreground border border-destructive/20"
          : "bg-primary/90 text-primary-foreground border border-primary/20"
      )}
      role="alert"
      aria-live="assertive"
    >
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
          variant === "error"
            ? "bg-destructive-foreground/20"
            : "bg-primary-foreground/20"
        )}
      >
        {variant === "error" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        )}
      </div>
      <div className="mr-2 flex-1">
        <p className="font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className={cn(
          "p-1.5 rounded-full hover:bg-white/10 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          variant === "error"
            ? "focus:ring-destructive-foreground/50"
            : "focus:ring-primary-foreground/50"
        )}
        aria-label="Close notification"
        aria-live="polite"
      >
        <X className="size-4" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 w-full overflow-hidden rounded-b-lg bg-white/20">
        <div
          className="animate-shrink h-full origin-left bg-white/30"
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
};

export default Toast;
