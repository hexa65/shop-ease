import { useContext } from "react";
import { CartContext } from "../context/cartContext";
import type { CartContextValue } from "../types/cart";

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  // If this fires, a component is outside <CartProvider>.
  if (context === null) {
    throw new Error("useCart must be used inside <CartProvider>.");
  }

  return context;
}
