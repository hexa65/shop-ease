import type { Order } from "../types/order";
import type { OrderStatusFilter } from "../types/orderFilter";

// Newest order first. We sort a COPY: `sort` changes the array it is called
// on, and the original array belongs to TanStack Query's cache.
export function sortNewestFirst(orders: Order[]): Order[] {
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function filterOrders(
  orders: Order[],
  filter: OrderStatusFilter,
): Order[] {
  const matching =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);
  return sortNewestFirst(matching);
}

// Record<OrderStatusFilter, number> means: a number for EVERY filter option.
// If we add a third status later, TypeScript points here until we count it.
export function countOrdersByStatus(
  orders: Order[],
): Record<OrderStatusFilter, number> {
  return {
    all: orders.length,
    pending: orders.filter((order) => order.status === "pending").length,
    completed: orders.filter((order) => order.status === "completed").length,
  };
}
