import { createContext } from "react";
import type { CartContextValue } from "../types/cart";

// The notice board. It starts empty (null) until CartProvider fills it.
export const CartContext = createContext<CartContextValue | null>(null);
