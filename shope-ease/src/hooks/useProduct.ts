import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import { getProductById } from "../services/productService";
import type { Product } from "../types/Product";

// `id` is null when the id in the URL is missing or not a valid number.
export function useProduct(id: number | null): UseQueryResult<Product, Error> {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => {
      if (id === null) {
        throw new Error("Product id is missing.");
      }
      return getProductById(id);
    },
    enabled: id !== null,
    retry: false,
  });
}
