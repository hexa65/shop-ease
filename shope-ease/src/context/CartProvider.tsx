import { useCallback, useEffect, useMemo, useReducer } from "react";
import type { ReactNode } from "react";
import { CartContext } from "./cartContext";
import {
  cartReducer,
  getCartCount,
  getCartSubtotal,
  initialCartState,
} from "../lib/cartReducer";
import { loadCart, saveCart } from "../lib/cartStorage";
import type { CartContextValue } from "../types/cart";
import type { Product } from "../types/Product";

interface CartProviderProps {
  children: ReactNode;
}

export default function CartProvider({ children }: CartProviderProps) {
  // The third argument runs ONCE, on the first render, to load the saved cart.
  // (Loading inside an effect instead would let an empty cart overwrite the saved one.)
  const [state, dispatch] = useReducer(cartReducer, initialCartState, loadCart);

  // Save after every change.
  useEffect(() => {
    saveCart(state);
  }, [state]);

  // useCallback keeps each function the same between renders.
  const addItem = useCallback((product: Product, quantity: number = 1): void => {
    dispatch({ type: "ADD_ITEM", product, quantity });
  }, []);

  const setQuantity = useCallback((productId: number, quantity: number): void => {
    dispatch({ type: "SET_QUANTITY", productId, quantity });
  }, []);

  const removeItem = useCallback((productId: number): void => {
    dispatch({ type: "REMOVE_ITEM", productId });
  }, []);

  const clearCart = useCallback((): void => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  // useMemo keeps the value the same object until the cart really changes,
  // so components that read the cart do not re-render for nothing.
  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      itemCount: getCartCount(state.items),
      subtotal: getCartSubtotal(state.items),
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    }),
    [state.items, addItem, setQuantity, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}