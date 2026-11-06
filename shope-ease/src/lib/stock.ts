import type { StockStatus } from "../types/stock";

// "Low" means this many or fewer. One number, one place.
export const LOW_STOCK_THRESHOLD = 5;

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) {
    return "out";
  }
  if (stock <= LOW_STOCK_THRESHOLD) {
    return "low";
  }
  return "in";
}
