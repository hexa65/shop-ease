const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(price: number): string {
  return priceFormatter.format(price);
}

/**
 * Turns a URL param into a safe product id.
 * Returns null for anything that is not a positive whole number.
 */
export function parseProductId(value: string | undefined): number | null {
  if (value === undefined) {
    return null;
  }

  // Digits only. This rejects "abc", "12abc", "1.5", "-3" and "".
  if (!/^\d+$/.test(value)) {
    return null;
  }

  const id = Number(value);

  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

/**
 * One shared look for Input, Select and Textarea.
 * Both border classes are written in full so Tailwind can see them.
 */
export function getFieldClassName(hasError: boolean): string {
  const base =
    "block w-full rounded-md border bg-white px-3 py-2.5 text-ink placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-pine disabled:cursor-not-allowed disabled:opacity-50";

  return hasError ? `${base} border-alert` : `${base} border-rule`;
}

import type {
  Category,
  CreateProductInput,
  ProductFormErrors,
  ProductFormValues,
} from "../types/Product";

const CATEGORY_LIST: Category[] = ["Electronics", "Fashion", "Home", "Beauty"];

// Type guard: after this check, TypeScript knows the string is a Category.
export function isCategory(value: string): value is Category {
  return CATEGORY_LIST.some((category) => category === value);
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateProductForm(
  values: ProductFormValues,
): ProductFormErrors {
  const errors: ProductFormErrors = {};

  if (values.name.trim().length < 3) {
    errors.name = "Enter a name with at least 3 characters.";
  }

  const price = Number(values.price);
  if (values.price.trim() === "" || Number.isNaN(price) || price <= 0) {
    errors.price = "Enter a price greater than 0.";
  }

  if (!isCategory(values.category)) {
    errors.category = "Choose a category.";
  }

  if (!isValidUrl(values.image.trim())) {
    errors.image = "Enter a full image link starting with http:// or https://.";
  }

  if (values.description.trim().length < 10) {
    errors.description = "Describe the product in at least 10 characters.";
  }

  const rating = Number(values.rating);
  if (
    values.rating.trim() === "" ||
    Number.isNaN(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    errors.rating = "Enter a rating between 1 and 5.";
  }

  const stock = Number(values.stock);
  if (values.stock.trim() === "" || !Number.isInteger(stock) || stock < 0) {
    errors.stock = "Enter a whole number of 0 or more.";
  }

  return errors;
}

// Call this ONLY after validation passed. It turns strings into real types.
export function toCreateProductInput(
  values: ProductFormValues,
): CreateProductInput {
  if (!isCategory(values.category)) {
    throw new Error("Category must be validated before converting the form.");
  }

  return {
    name: values.name.trim(),
    price: Number(values.price),
    category: values.category,
    image: values.image.trim(),
    description: values.description.trim(),
    rating: Number(values.rating),
    stock: Number(values.stock),
  };
}

import type {
  LoginFormErrors,
  LoginFormValues,
  RegisterFormErrors,
  RegisterFormValues,
} from "../types/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginForm(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {};

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email, like name@example.com.";
  }
  if (values.password.length === 0) {
    errors.password = "Enter your password.";
  }

  return errors;
}

export function validateRegisterForm(
  values: RegisterFormValues,
): RegisterFormErrors {
  const errors: RegisterFormErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Enter your name (at least 2 characters).";
  }
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email, like name@example.com.";
  }
  if (values.password.length < 8) {
    errors.password = "Use at least 8 characters for your password.";
  }
  if (values.confirmPassword.length === 0) {
    errors.confirmPassword = "Re-enter your password to confirm it.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "The passwords do not match.";
  }

  return errors;
}

// Moves the keyboard cursor to the input with this name, inside the given form.
export function focusField(form: HTMLFormElement | null, name: string): void {
  form?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus();
}
