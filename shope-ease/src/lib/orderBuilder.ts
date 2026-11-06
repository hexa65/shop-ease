import { getOrderTotal } from "./pricing";
import type { CartItem } from "../types/cart";
import type { Customer } from "../types/customer";
import type { CheckoutDetails, NewOrder, OrderItem } from "../types/order";

// Sum of price x quantity, rounded to whole cents.
// It only needs price and quantity, so it works for cart items AND order items.
export function calculateSubtotal(
  items: ReadonlyArray<Pick<OrderItem, "price" | "quantity">>,
): number {
  const sum = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  return Math.round(sum * 100) / 100;
}

// Turns a cart into an order that is ready to be saved.
export function buildNewOrder(
  customer: Customer,
  details: CheckoutDetails,
  items: CartItem[],
): NewOrder {
  // A snapshot of what was bought. The cart's `stock` field is not part of an order.
  const orderItems: OrderItem[] = items.map((item) => ({
    productId: item.productId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
  }));

  return {
    customerId: customer.id,
    customerName: customer.name,
    customerEmail: customer.email,
    phone: details.phone.trim(),
    address: details.address.trim(),
    items: orderItems,
    total: getOrderTotal(calculateSubtotal(items)),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
}
