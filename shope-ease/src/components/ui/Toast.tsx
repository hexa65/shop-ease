import { useEffect } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

export interface ToastProps {
  message: string;
  variant?: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  variant = "success",
  onClose,
  duration = 3000,
}: ToastProps) {
  // Close by itself after `duration` ms. Cleanup stops the timer if we unmount first.
  useEffect(() => {
    const timer = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timer);
  }, [onClose, duration]);

  const isSuccess = variant === "success";

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-96">
      <div
        role={isSuccess ? "status" : "alert"}
        className="flex items-start gap-3 rounded-xl border border-rule bg-white p-4 shadow-lg"
      >
        {isSuccess ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-pine" aria-hidden="true" />
        ) : (
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-alert" aria-hidden="true" />
        )}

        <p className="flex-1 text-sm text-ink">{message}</p>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="rounded-md p-1 text-muted transition-colors hover:bg-shelf hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-pine"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}