import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import { updateOrderStatus } from "../services/orderService";
import type { Order } from "../types/order";

// The inputs of one mutate() call. Only this hook uses them, so they live here.
interface UpdateOrderStatusVariables {
  id: number;
  status: Order["status"];
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, UpdateOrderStatusVariables>({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: (saved) => {
      // 1. Pin the server's answer on the notice board for this order,
      //    so the details page updates at once.
      queryClient.setQueryData<Order>(queryKeys.orders.detail(saved.id), saved);
      // 2. Tell the orders list its copy may be old. It reloads when needed.
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}
