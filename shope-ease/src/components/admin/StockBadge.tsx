import { getStockStatus } from "../../lib/stock";
import type { StockStatus } from "../../types/stock";

interface StockBadgeProps {
  stock: number;
}

// Record<StockStatus, ...> needs EVERY status. Add one and the compiler tells you.
const BADGE_CLASSES: Record<StockStatus, string> = {
  out: "bg-alert/10 text-alert",
  low: "bg-amber-100 text-amber-800",
  in: "bg-pine/10 text-pine-dark",
};

function getLabel(status: StockStatus, stock: number): string {
  switch (status) {
    case "out":
      return "Out of stock";
    case "low":
      return `Only ${stock} left`;
    case "in":
      return `${stock} in stock`;
  }
}

// The words carry the meaning. The color only helps.
export default function StockBadge({ stock }: StockBadgeProps) {
  const status = getStockStatus(stock);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${BADGE_CLASSES[status]}`}
    >
      {getLabel(status, stock)}
    </span>
  );
}