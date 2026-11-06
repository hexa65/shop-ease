import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import { getOrders } from "../services/orderService";
import type { Order } from "../types/order";

export function useOrders() {
  return useQuery<Order[], Error>({
    queryKey: queryKeys.orders.all,
    queryFn: getOrders,
  });
}
