import type { CheckoutDetails } from "./order";

// One optional message per form field. A missing key means "no error".
export type CheckoutErrors = Partial<Record<keyof CheckoutDetails, string>>;
