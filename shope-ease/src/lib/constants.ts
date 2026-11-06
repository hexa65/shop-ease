import type { Category } from "../types/Product";

export const APP_NAME = "ShopEase";

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Add Product", to: "/products/new" },
] as const;

// One place for the account links, so the navbar and the mobile menu always agree.
export const AUTH_LINKS = {
  login: { label: "Log in", to: "/login" },
  register: { label: "Sign up", to: "/register" },
} as const;

export const CART_LINK = { label: "Cart", to: "/cart" } as const;

export const CATEGORIES: readonly Category[] = [
  "Electronics",
  "Fashion",
  "Home",
  "Beauty",
];

export const PRODUCT_GRID_COLUMNS =
  "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
