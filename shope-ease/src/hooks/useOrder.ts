import { useQuery } from "@tanstack/react-query";
import { isNotFoundError } from "../lib/errors";
import { queryKeys } from "../lib/queryKeys";
import { getOrderById } from "../services/orderService";
import type { Order } from "../types/order";

export function useOrder(id: number) {
  return useQuery<Order, Error>({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => getOrderById(id),
    // A bad id (NaN, 0, 1.5) never reaches the server.
    enabled: Number.isInteger(id) && id > 0,
    // Retrying "404 Not Found" only makes the customer wait for the same answer.
    retry: (failureCount, error) => !isNotFoundError(error) && failureCount < 2,
  });
}
