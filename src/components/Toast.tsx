import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToastProps, ToastVariant } from "@/types/index";
import { AlertIcon, SuccessIcon } from "./icons";

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
        "fixed right-4 z-50 max-w-sm w-full shadow-lg flex items-center gap-3 p-4 rounded-lg backdrop-blur-sm transition-all duration-300 transform",
        /* Position at top on mobile, bottom on larger screens */
        "top-4 sm:top-auto sm:bottom-4",
        variant === "error"
          ? "bg-destructive/90 text-destructive-foreground border border-destructive/20"
          : "bg-primary/90 text-primary-foreground border border-primary/20"
      )}
      role="alert"
      aria-live="polite"
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
          <AlertIcon className="size-5" />
        ) : (
          <SuccessIcon className="size-5" />
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
