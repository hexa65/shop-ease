import { useQuery } from "@tanstack/react-query";
import { isNotFoundError } from "../lib/errors";
import { queryKeys } from "../lib/queryKeys";
import { getProductById } from "../services/productService";
import type { Product } from "../types/Product";

export function useProductById(id: number) {
  return useQuery<Product, Error>({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => getProductById(id),
    // A bad id (NaN, 0, 1.5) never reaches the server. In "create" mode the
    // page passes 0, so this query stays silent.
    enabled: Number.isInteger(id) && id > 0,
    // Retrying "404 Not Found" only makes the admin wait for the same answer.
    retry: (failureCount, error) => !isNotFoundError(error) && failureCount < 2,
  });
}
