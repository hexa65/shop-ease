import { useId } from "react";
import type { TextareaHTMLAttributes } from "react";
import { getFieldClassName } from "../../lib/utils";

interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
  label: string;
  error?: string;
}

function Textarea({ label, error, id, rows = 4, ...rest }: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const errorId = `${textareaId}-error`;
  const hasError = Boolean(error);

  return (
    <div>
      <label
        htmlFor={textareaId}
        className="mb-1.5 block text-sm font-medium text-ink"
      >
        {label}
      </label>
      <textarea
        {...rest}
        id={textareaId}
        rows={rows}
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

export default Textarea;