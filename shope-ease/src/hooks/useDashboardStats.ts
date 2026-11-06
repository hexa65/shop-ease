import {
  RECENT_ORDERS_LIMIT,
  calculateDashboardStats,
  getLowStockProducts,
  getRecentOrders,
} from "../lib/stats";
import type { DashboardStats } from "../types/dashboard";
import type { Order } from "../types/order";
import type { Product } from "../types/Product";
import { useCustomers } from "./useCustomers";
import { useOrders } from "./useOrders";
import { useProducts } from "./useProducts";

interface UseDashboardStatsResult {
  stats: DashboardStats | undefined;
  recentOrders: Order[];
  lowStockProducts: Product[];
  isPending: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useDashboardStats(): UseDashboardStatsResult {
  // Each hook fetches, caches and retries on its own. If the admin already
  // visited the products page, those products are already in the cache.
  const products = useProducts();
  const orders = useOrders();
  const customers = useCustomers();

  // Only calculate when all three lists have arrived.
  const stats =
    products.data && orders.data && customers.data
      ? calculateDashboardStats(products.data, orders.data, customers.data)
      : undefined;

  // The two lists are derived too. Empty until their data has loaded.
  const recentOrders = orders.data
    ? getRecentOrders(orders.data, RECENT_ORDERS_LIMIT)
    : [];
  const lowStockProducts = products.data
    ? getLowStockProducts(products.data)
    : [];

  // The first error we find, or null.
  const error = products.error ?? orders.error ?? customers.error ?? null;

  // Loading means: no numbers yet and nothing has failed.
  const isPending = stats === undefined && error === null;

  // Retry only the lists that failed. The others already have their data.
  const refetch = (): void => {
    for (const query of [products, orders, customers]) {
      if (query.isError) {
        void query.refetch();
      }
    }
  };

  return { stats, recentOrders, lowStockProducts, isPending, error, refetch };
}
