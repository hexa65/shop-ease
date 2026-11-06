import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import { deleteProduct } from "../services/productService";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteProduct,
    onSuccess: (_data, id) => {
      // The cached details of this product are not "old", they are wrong now.
      // Remove them instead of refetching something that would answer 404.
      queryClient.removeQueries({ queryKey: queryKeys.products.detail(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}
