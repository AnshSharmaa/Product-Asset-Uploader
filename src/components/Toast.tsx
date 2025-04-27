import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  isError?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, isError, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(onClose, 2000);
      return () => clearTimeout(t);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 max-w-sm w-full shadow-lg flex items-center gap-3 p-4 rounded-lg backdrop-blur-sm transition-all duration-300 transform",
        isError
          ? "bg-destructive/90 text-destructive-foreground border border-destructive/20"
          : "bg-primary/90 text-primary-foreground border border-primary/20"
      )}
      role="alert"
      aria-live="assertive"
    >
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
          isError ? "bg-destructive-foreground/20" : "bg-primary-foreground/20"
        )}
      >
        {isError ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
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
            className="h-5 w-5"
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
      <div className="flex-1 mr-2">
        <p className="font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className={cn(
          "p-1.5 rounded-full hover:bg-white/10 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          isError
            ? "focus:ring-destructive-foreground/50"
            : "focus:ring-primary-foreground/50"
        )}
        aria-label="Close notification"
        aria-live="polite"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/20 rounded-b-lg w-full overflow-hidden">
        <div
          className="h-full bg-white/30 animate-shrink origin-left"
          style={{ animationDuration: "2s" }}
        />
      </div>
    </div>
  );
};

export default Toast;
