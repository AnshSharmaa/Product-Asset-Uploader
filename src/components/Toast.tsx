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
        "fixed bottom-4 right-4 z-50 max-w-sm w-full p-4 rounded-md shadow-lg flex items-center justify-between",
        isError ? "bg-red-500 text-white" : "bg-green-500 text-white"
      )}
    >
      <p className="flex-grow">{message}</p>
      <button
        onClick={onClose}
        className="ml-4 focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-2 rounded-full p-1 hover:bg-black/10 transition-colors"
        aria-label="Close notification"
        aria-live="polite"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
