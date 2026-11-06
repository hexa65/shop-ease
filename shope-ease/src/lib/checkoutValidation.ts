import type { CheckoutErrors } from "../types/checkout";
import type { CheckoutDetails } from "../types/order";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s-]+$/;

// Pure function: details in, errors out. No React, no API.
// Client validation is a convenience. A real server must check again.
export function validateCheckout(details: CheckoutDetails): CheckoutErrors {
  const errors: CheckoutErrors = {};

  const name = details.name.trim();
  const email = details.email.trim();
  const phone = details.phone.trim();
  const address = details.address.trim();

  if (name.length < 2) {
    errors.name = "Enter your full name.";
  }

  if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address, like name@example.com.";
  }

  const digitCount = phone.replace(/\D/g, "").length;
  if (!PHONE_PATTERN.test(phone) || digitCount < 7 || digitCount > 15) {
    errors.phone = "Enter a valid phone number (7 to 15 digits).";
  }

  if (address.length < 10) {
    errors.address =
      "Enter your full delivery address (at least 10 characters).";
  }

  return errors;
}

export function hasErrors(errors: CheckoutErrors): boolean {
  return Object.keys(errors).length > 0;
}
