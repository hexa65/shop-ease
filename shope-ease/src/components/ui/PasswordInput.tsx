import { useId, useState } from "react";
import type { InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { getFieldClassName } from "../../lib/utils";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  hint?: string;
}

export default function PasswordInput({
  label,
  error,
  hint,
  id,
  className = "",
  ...rest
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const hasError = Boolean(error);

  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>

      <div className="relative">
        <input
          {...rest}
          id={inputId}
          type={isVisible ? "text" : "password"}
          aria-invalid={hasError}
          aria-describedby={hasError || hint ? messageId : undefined}
          className={`${getFieldClassName(hasError)} pr-11 ${className}`.trim()}
        />

        <button
          type="button"
          onClick={() => setIsVisible((previous) => !previous)}
          aria-label={isVisible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-muted transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-pine"
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {hasError ? (
        <p id={messageId} className="mt-1.5 text-sm text-alert">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}