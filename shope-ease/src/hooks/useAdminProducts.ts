import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import { getProducts } from "../services/productService";
import type { Product } from "../types/Product";

// The admin always wants the full list. It uses the same key as the store's
// list, so both screens share one cache and one invalidation.
export function useAdminProducts() {
  return useQuery<Product[], Error>({
    queryKey: queryKeys.products.all,
    queryFn: getProducts,
  });
}
