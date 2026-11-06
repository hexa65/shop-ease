import type { Product } from "./Product";

// One line in the cart. We copy name, price, image and stock from the product,
// so the cart can draw itself without asking the server again.
export interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  stock: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

// A discriminated union: every action has a `type` label.
// After checking the label, TypeScript knows which other fields exist.
export type CartAction =
  | { type: "ADD_ITEM"; product: Product; quantity: number }
  | { type: "SET_QUANTITY"; productId: number; quantity: number }
  | { type: "REMOVE_ITEM"; productId: number }
  | { type: "CLEAR_CART" };

// Everything a component gets from useCart().
export interface CartContextValue {
  items: CartItem[];
  itemCount: number; // total units, for the navbar badge
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
}
