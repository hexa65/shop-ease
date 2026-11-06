import { CircleAlert } from "lucide-react";
import Button from "./button";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

function ErrorMessage({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center rounded-2xl border border-alert/30 bg-alert/10 p-8 text-center"
    >
      <CircleAlert className="h-10 w-10 text-alert" aria-hidden="true" />
      <h2 className="mt-4 text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-1 max-w-md text-muted">{message}</p>
      {onRetry && (
        <Button variant="outline" className="mt-6" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export default ErrorMessage;