import type { Order } from "./order";

// The three choices in the filter bar: one for each status, plus "all".
export type OrderStatusFilter = Order["status"] | "all";
