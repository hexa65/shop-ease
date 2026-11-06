import { useId } from "react";
import type { SelectHTMLAttributes } from "react";
import { getFieldClassName } from "../../lib/utils";

// An option can be a plain string or a { value, label } pair.
type SelectOption = string | { value: string; label: string };

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
}

export default function Select({
  label,
  error,
  options,
  children,
  id,
  className = "",
  ...rest
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;
  const hasError = Boolean(error);

  return (
    <div>
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}

      <select
        {...rest}
        id={selectId}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        className={`${getFieldClassName(hasError)} ${className}`.trim()}
      >
        {options
          ? options.map((option) => {
              const value = typeof option === "string" ? option : option.value;
              const text = typeof option === "string" ? option : option.label;
              return (
                <option key={value} value={value}>
                  {text}
                </option>
              );
            })
          : children}
      </select>

      {hasError && (
        <p id={errorId} className="mt-1.5 text-sm text-alert">
          {error}
        </p>
      )}
    </div>
  );
}