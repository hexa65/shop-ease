import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import { getProducts } from "../services/productService";
import type { Product } from "../types/Product";

export function useProducts(): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: queryKeys.products.all, // the label on the folder
    queryFn: getProducts, // how to fill the folder (the function, NOT getProducts())
  });
}
