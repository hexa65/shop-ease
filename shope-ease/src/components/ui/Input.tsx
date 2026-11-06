import { useId } from "react";
import type { InputHTMLAttributes } from "react";
import { getFieldClassName } from "../../lib/utils";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label: string;
  error?: string;
}

function Input({ label, error, id, ...rest }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hasError = Boolean(error);

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-ink"
      >
        {label}
      </label>
      <input
        {...rest}
        id={inputId}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        className={getFieldClassName(hasError)}
      />
      {hasError && (
        <p id={errorId} className="mt-1.5 text-sm text-alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;