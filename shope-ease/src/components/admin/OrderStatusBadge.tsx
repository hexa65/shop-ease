import type { Order } from "../../types/order";

interface OrderStatusBadgeProps {
  status: Order["status"];
}

// One entry per status. Add a status to the type and TypeScript
// reminds you to add its style here.
const STATUS_STYLES: Record<Order["status"], { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-800 ring-amber-600/20",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-800 ring-emerald-600/20",
  },
};

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const { label, className } = STATUS_STYLES[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${className}`}
    >
      {label}
    </span>
  );
}