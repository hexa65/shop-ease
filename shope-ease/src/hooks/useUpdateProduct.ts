import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import { updateProduct } from "../services/productService";
import type { Product, UpdateProductInput } from "../types/Product";

// A mutation takes ONE value, so id and changes travel together.
interface UpdateProductVariables {
  id: number;
  changes: UpdateProductInput;
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, UpdateProductVariables>({
    mutationFn: ({ id, changes }) => updateProduct(id, changes),
    onSuccess: () => {
      // Every product key starts with ["products"]: the list, the details page
      // and the admin table all refresh from this one call.
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}
