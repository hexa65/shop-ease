import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router";
import { Loader2 } from "lucide-react";
import { validateCheckout } from "../../lib/checkoutValidation";
import type { CheckoutErrors } from "../../types/checkout";
import type { CheckoutDetails } from "../../types/order";

interface CheckoutFormProps {
  onSubmit: (details: CheckoutDetails) => void;
  isSubmitting: boolean;
  submitError: string | null;
}

type FieldName = keyof CheckoutDetails;
type FieldChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const EMPTY_DETAILS: CheckoutDetails = { name: "", email: "", phone: "", address: "" };

// The order the fields appear on screen. Used to focus the first wrong one.
const FIELD_ORDER: FieldName[] = ["name", "email", "phone", "address"];

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-pine disabled:cursor-not-allowed disabled:opacity-60";

interface FieldProps {
  field: FieldName;
  label: string;
  value: string;
  error?: string;
  type?: "text" | "email" | "tel";
  autoComplete: string;
  multiline?: boolean;
  disabled: boolean;
  onChange: (event: FieldChangeEvent) => void;
  onBlur: () => void;
}

// One labelled field: label, control, and its error message, all connected
// for screen readers with htmlFor, aria-invalid and aria-describedby.
function Field({
  field,
  label,
  value,
  error,
  type = "text",
  autoComplete,
  multiline = false,
  disabled,
  onChange,
  onBlur,
}: FieldProps) {
  const id = `checkout-${field}`;
  const errorId = `${id}-error`;

  const shared = {
    id,
    name: field,
    value,
    disabled,
    autoComplete,
    onChange,
    onBlur,
    "aria-required": true,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: `${inputBase} ${error ? "border-alert" : "border-rule"}`,
  } as const;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {multiline ? (
        <textarea {...shared} rows={3} />
      ) : (
        <input {...shared} type={type} />
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function CheckoutForm({ onSubmit, isSubmitting, submitError }: CheckoutFormProps) {
  const [values, setValues] = useState<CheckoutDetails>(EMPTY_DETAILS);
  const [errors, setErrors] = useState<CheckoutErrors>({});

  // Typing updates the value and removes that field's error straight away.
  const handleChange = (field: FieldName) => (event: FieldChangeEvent): void => {
    const value = event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  // Leaving a field checks only that field.
  const handleBlur = (field: FieldName) => (): void => {
    const message = validateCheckout(values)[field];
    setErrors((current) => {
      const next = { ...current };
      if (message) {
        next[field] = message;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const found = validateCheckout(values);
    setErrors(found);

    const firstInvalid = FIELD_ORDER.find((field) => found[field] !== undefined);
    if (firstInvalid) {
      document.getElementById(`checkout-${firstInvalid}`)?.focus();
      return;
    }

    // Only clean, trimmed data leaves the form.
    onSubmit({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-2xl border border-rule bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-bold text-ink">Delivery details</h2>

      <Field
        field="name"
        label="Full name"
        value={values.name}
        error={errors.name}
        autoComplete="name"
        disabled={isSubmitting}
        onChange={handleChange("name")}
        onBlur={handleBlur("name")}
      />
      <Field
        field="email"
        label="Email"
        type="email"
        value={values.email}
        error={errors.email}
        autoComplete="email"
        disabled={isSubmitting}
        onChange={handleChange("email")}
        onBlur={handleBlur("email")}
      />
      <Field
        field="phone"
        label="Phone number"
        type="tel"
        value={values.phone}
        error={errors.phone}
        autoComplete="tel"
        disabled={isSubmitting}
        onChange={handleChange("phone")}
        onBlur={handleBlur("phone")}
      />
      <Field
        field="address"
        label="Delivery address"
        multiline
        value={values.address}
        error={errors.address}
        autoComplete="street-address"
        disabled={isSubmitting}
        onChange={handleChange("address")}
        onBlur={handleBlur("address")}
      />

      {submitError && (
        <div
          role="alert"
          className="rounded-xl border border-alert/30 bg-alert/10 p-4 text-sm text-alert"
        >
          <p>{submitError}</p>
          <Link
            to="/cart"
            className="mt-2 inline-block font-semibold underline focus:outline-none focus-visible:ring-2 focus-visible:ring-pine"
          >
            Review your cart
          </Link>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-pine px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-pine-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Placing order...
          </>
        ) : (
          "Place order"
        )}
      </button>
    </form>
  );
}