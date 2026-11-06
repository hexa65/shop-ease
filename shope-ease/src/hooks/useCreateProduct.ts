import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import { createProduct } from "../services/productService";
import type { CreateProductInput, Product } from "../types/Product";

// Slots: what comes back (Product), the error type (Error), what we send (CreateProductInput).
export function useCreateProduct(): UseMutationResult<
  Product,
  Error,
  CreateProductInput
> {
  const queryClient = useQueryClient(); // the librarian's memory, from Providers

  return useMutation({
    mutationFn: createProduct, // the function itself, NOT createProduct()
    onSuccess: () => {
      // Stamp every copy that starts with ["products"] as out of date:
      // the list AND every ["products", id] folder.
      // Returning the promise makes the mutation wait until the refresh is done.
      return queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      });
    },
  });
}
