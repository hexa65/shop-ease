import { initialCartState } from "./cartReducer";
import type { CartItem, CartState } from "../types/cart";

const STORAGE_KEY = "shopease-cart";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// Type guard: proves an unknown value really is a CartItem.
function isCartItem(value: unknown): value is CartItem {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.productId === "number" &&
    typeof value.name === "string" &&
    typeof value.price === "number" &&
    typeof value.image === "string" &&
    typeof value.stock === "number" &&
    typeof value.quantity === "number" &&
    value.quantity >= 1
  );
}

// Reads the saved cart. Anything missing, broken or edited by hand becomes an empty cart.
export function loadCart(): CartState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (raw === null) {
      return initialCartState;
    }

    const parsed: unknown = JSON.parse(raw);

    if (isRecord(parsed)) {
      const items: unknown = parsed.items;

      if (Array.isArray(items) && items.every(isCartItem)) {
        return { items };
      }
    }
  } catch {
    // Storage can be blocked, or the text can be invalid JSON. Fall through to an empty cart.
  }

  return initialCartState;
}

export function saveCart(state: CartState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be full or blocked (private mode). The cart still works in memory.
  }
}
