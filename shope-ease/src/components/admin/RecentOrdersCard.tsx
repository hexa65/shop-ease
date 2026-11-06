import { Link } from "react-router";
import { formatOrderDate } from "../../lib/dates";
import { formatPrice } from "../../lib/utils";
import type { Order } from "../../types/order";
import OrderStatusBadge from "./OrderStatusBadge";

interface RecentOrdersCardProps {
  orders: Order[];
}

const focusClass =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-pine";

export default function RecentOrdersCard({ orders }: RecentOrdersCardProps) {
  return (
    <section
      aria-labelledby="recent-orders-heading"
      className="rounded-2xl border border-rule bg-white p-5"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 id="recent-orders-heading" className="text-base font-semibold text-ink">
          Recent orders
        </h2>
        <Link
          to="/admin/orders"
          className={`rounded-lg px-2 py-1 text-sm font-semibold text-pine hover:text-pine-dark ${focusClass}`}
        >
          View all
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No orders yet.</p>
      ) : (
        <ul className="mt-2 divide-y divide-rule">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                to={`/admin/orders/${order.id}`}
                className={`flex items-center justify-between gap-3 rounded-lg py-3 transition-colors hover:bg-shelf/60 ${focusClass}`}
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{order.customerName}</p>
                  <p className="text-sm text-muted">
                    Order #{order.id} on {formatOrderDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="font-semibold tabular-nums text-ink">
                    {formatPrice(order.total)}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}