import { useEffect, useId, useRef, type MouseEvent, type SyntheticEvent } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  pendingLabel: string;
  isPending: boolean;
  errorMessage: string | null;
  onConfirm: () => void;
  onDismiss: () => void;
}

// Built on the native <dialog>. Opened with showModal(), the browser gives us
// a focus trap, Escape to close, an inert page behind it, a backdrop, and
// focus returning to the button that opened it.
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  pendingLabel,
  isPending,
  errorMessage,
  onConfirm,
  onDismiss,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  // React state is the boss. The dialog follows `open`.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (open && !dialog.open) {
      dialog.showModal();
    }
    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Escape fires "cancel". While deleting, do not allow it.
  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>): void => {
    if (isPending) {
      event.preventDefault();
    }
  };

  // A click on the dark backdrop lands on the <dialog> itself.
  // (The padding lives on the inner div, so clicks inside never match.)
  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>): void => {
    if (event.target === event.currentTarget && !isPending) {
      onDismiss();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={handleCancel}
      onClose={onDismiss}
      onClick={handleBackdropClick}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-white p-0 text-ink shadow-xl backdrop:bg-black/50"
    >
      <div className="p-6">
        <h2 id={titleId} className="text-lg font-bold text-ink">
          {title}
        </h2>
        <p id={descriptionId} className="mt-2 text-sm text-muted">
          {description}
        </p>

        {errorMessage && (
          <p role="alert" className="mt-4 rounded-lg bg-alert/10 p-3 text-sm text-alert">
            {errorMessage}
          </p>
        )}

        {/* Cancel comes FIRST in the page order: it gets the focus when the dialog opens. */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onDismiss}
            disabled={isPending}
            className="rounded-xl border border-rule px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-shelf focus:outline-none focus-visible:ring-2 focus-visible:ring-pine disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="rounded-xl bg-alert px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-alert focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}