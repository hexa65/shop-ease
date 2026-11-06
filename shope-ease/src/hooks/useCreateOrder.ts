import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCart } from "./useCart";
import { isNotFoundError } from "../lib/errors";
import { queryKeys } from "../lib/queryKeys";
import { buildNewOrder } from "../lib/orderBuilder";
import { findOrCreateCustomer } from "../services/customerService";
import { createOrder } from "../services/orderService";
import {
  getProductStock,
  updateProductStock,
} from "../services/productService";
import type { CartItem } from "../types/cart";
import type { CheckoutDetails, Order } from "../types/order";

export interface PlaceOrderInput {
  details: CheckoutDetails;
  items: CartItem[];
}

// Reads the real stock of one cart item. If the product was deleted after it
// was added to the cart, say so in plain words instead of "status code 404".
async function readStock(item: CartItem): Promise<number> {
  try {
    return await getProductStock(item.productId);
  } catch (error) {
    if (isNotFoundError(error)) {
      // `cause` keeps the original 404 attached for debugging.
      throw new Error(`${item.name} is no longer available.`, { cause: error });
    }
    throw error;
  }
}
// NOTE FOR THE PRESENTATION: a real backend would do steps 2 to 4 inside one
// database transaction. json-server cannot, so we validate first (step 1),
// and treat the stock update (step 4) as best effort.
async function placeOrder({ details, items }: PlaceOrderInput): Promise<Order> {
  // 1. Check the real stock before writing anything.
  const stocks = await Promise.all(items.map(readStock));

  items.forEach((item, index) => {
    const available = stocks[index] ?? 0;
    if (available < item.quantity) {
      throw new Error(
        available === 0
          ? `${item.name} is out of stock.`
          : `Only ${available} of ${item.name} left in stock.`,
      );
    }
  });

  // 2. Reuse the customer if the email is known, otherwise create one.
  const customer = await findOrCreateCustomer(details);

  // 3. Save the order.
  const order = await createOrder(buildNewOrder(customer, details, items));

  // 4. Reduce stock. The order is already saved, so a failure here is logged,
  //    not thrown: the customer's order did succeed.
  const results = await Promise.allSettled(
    items.map((item, index) =>
      updateProductStock(
        item.productId,
        Math.max(0, (stocks[index] ?? 0) - item.quantity),
      ),
    ),
  );
  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error(
        "Stock update failed after the order was saved:",
        result.reason,
      );
    }
  });

  return order;
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { clearCart } = useCart();

  return useMutation<Order, Error, PlaceOrderInput>({
    mutationFn: placeOrder,
    onSuccess: () => {
      // 5. The cart did its job. Clear it, and mark cached server data as old.
      clearCart();
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
}
