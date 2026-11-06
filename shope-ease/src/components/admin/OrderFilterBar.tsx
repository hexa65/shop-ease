import type { OrderStatusFilter } from "../../types/orderFilter";

interface OrderFilterBarProps {
  value: OrderStatusFilter;
  counts: Record<OrderStatusFilter, number>;
  onChange: (value: OrderStatusFilter) => void;
}

const OPTIONS: { value: OrderStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

export default function OrderFilterBar({ value, counts, onChange }: OrderFilterBarProps) {
  return (
    <div role="group" aria-label="Filter orders by status" className="flex flex-wrap gap-2">
      {OPTIONS.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2 ${
              isActive
                ? "bg-pine text-white"
                : "border border-rule text-ink hover:bg-shelf"
            }`}
          >
            {option.label}
            <span className={isActive ? "text-white/80" : "text-muted"}>
              {counts[option.value]}
            </span>
          </button>
        );
      })}
    </div>
  );
}