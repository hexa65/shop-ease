import type { CartAction, CartItem, CartState } from "../types/cart";

export const initialCartState: CartState = { items: [] };

// Keeps a quantity a whole number between 1 and the stock available.
function clampQuantity(quantity: number, stock: number): number {
  const whole = Number.isFinite(quantity) ? Math.floor(quantity) : 1;
  return Math.min(Math.max(1, whole), stock);
}

// If a new action type is added and not handled below, TypeScript fails here.
function assertNever(value: never): never {
  throw new Error(`Unhandled cart action: ${JSON.stringify(value)}`);
}

// The cashier: takes the current cart and an action, returns a NEW cart.
// It never changes the old one (no push, no direct assignment).
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity } = action;

      // Cannot buy something that is out of stock.
      if (product.stock < 1) {
        return state;
      }

      const existing = state.items.find(
        (item) => item.productId === product.id,
      );

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.productId === product.id
              ? {
                  ...item,
                  price: product.price, // refresh in case the admin changed it
                  stock: product.stock,
                  quantity: clampQuantity(
                    item.quantity + quantity,
                    product.stock,
                  ),
                }
              : item,
          ),
        };
      }

      const newItem: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
        quantity: clampQuantity(quantity, product.stock),
      };

      return { items: [...state.items, newItem] };
    }

    case "SET_QUANTITY": {
      return {
        items: state.items.map((item) =>
          item.productId === action.productId
            ? { ...item, quantity: clampQuantity(action.quantity, item.stock) }
            : item,
        ),
      };
    }

    case "REMOVE_ITEM": {
      return {
        items: state.items.filter(
          (item) => item.productId !== action.productId,
        ),
      };
    }

    case "CLEAR_CART": {
      return initialCartState;
    }

    default:
      return assertNever(action);
  }
}

// Total number of units in the cart (for the navbar badge).
export function getCartCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

// Total price. We add up in cents (whole numbers) to avoid 0.1 + 0.2 style errors.
export function getCartSubtotal(items: CartItem[]): number {
  const cents = items.reduce(
    (total, item) => total + Math.round(item.price * 100) * item.quantity,
    0,
  );
  return cents / 100;
}
