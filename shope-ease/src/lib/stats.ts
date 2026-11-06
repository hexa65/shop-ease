import type { Customer } from "../types/customer";
import type { DashboardStats } from "../types/dashboard";
import type { Order } from "../types/order";
import type { Product } from "../types/Product";
import { countOrdersByStatus, sortNewestFirst } from "./orderFilters";

// Below this many units, a product counts as "low stock". The shop's product
// card uses the same number for its "Only N left" badge.
export const LOW_STOCK_THRESHOLD = 10;

// How many orders the dashboard shows under "Recent orders".
export const RECENT_ORDERS_LIMIT = 5;

// A PURE function: it only reads its arguments and returns a new object.
// Same lists in, same numbers out.
export function calculateDashboardStats(
  products: Product[],
  orders: Order[],
  customers: Customer[],
): DashboardStats {
  // Reuse the counting rule from Part 13, so "pending" means the same thing
  // on the orders page and on the dashboard.
  const orderCounts = countOrdersByStatus(orders);

  return {
    totalOrders: orderCounts.all,
    totalProducts: products.length,
    totalCustomers: customers.length,
    pendingOrders: orderCounts.pending,
    completedOrders: orderCounts.completed,
    // `<= 0` rather than `=== 0`: a negative number is still "out of stock".
    outOfStock: products.filter((product) => product.stock <= 0).length,
  };
}

// The newest orders first. sortNewestFirst sorts a COPY, so the cached
// list is never reordered.
export function getRecentOrders(orders: Order[], limit: number): Order[] {
  return sortNewestFirst(orders).slice(0, limit);
}

// Products that are out of stock or almost out, emptiest first.
// `filter` creates a new array, so sorting it does not touch the cache.
export function getLowStockProducts(products: Product[]): Product[] {
  return products
    .filter((product) => product.stock < LOW_STOCK_THRESHOLD)
    .sort((a, b) => a.stock - b.stock || a.name.localeCompare(b.name));
}
