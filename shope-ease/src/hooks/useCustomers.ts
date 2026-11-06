import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import { getCustomers } from "../services/customerService";
import type { Customer } from "../types/customer";

export function useCustomers() {
  return useQuery<Customer[], Error>({
    queryKey: queryKeys.customers.all,
    queryFn: getCustomers,
  });
}
