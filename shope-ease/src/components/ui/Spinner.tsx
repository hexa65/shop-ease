import { LoaderCircle } from "lucide-react";

interface SpinnerProps {
  label?: string;
  className?: string;
}

function Spinner({ label = "Loading...", className = "" }: SpinnerProps) {
  return (
    <div role="status" className={`inline-flex items-center gap-2 text-muted ${className}`}>
      <LoaderCircle className="h-5 w-5 animate-spin text-pine" aria-hidden="true" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export default Spinner;