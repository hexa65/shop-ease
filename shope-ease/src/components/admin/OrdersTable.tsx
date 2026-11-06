import { Link } from "react-router";
import { formatOrderDate } from "../../lib/dates";
import { formatPrice } from "../../lib/utils";
import type { Order } from "../../types/order";
import OrderStatusBadge from "./OrderStatusBadge";

interface OrdersTableProps {
  orders: Order[];
}

const headerClass = "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted";

export default function OrdersTable({ orders }: OrdersTableProps) {
  return (
    // tabIndex 0 lets keyboard users scroll the table sideways on small screens.
    <div
      role="region"
      aria-label="Orders table"
      tabIndex={0}
      className="overflow-x-auto rounded-2xl border border-rule bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-pine"
    >
      <table className="w-full min-w-44rem text-left text-sm">
        <caption className="sr-only">Customer orders, newest first</caption>
        <thead className="bg-shelf">
          <tr>
            <th scope="col" className={headerClass}>Order</th>
            <th scope="col" className={headerClass}>Customer</th>
            <th scope="col" className={headerClass}>Date</th>
            <th scope="col" className={`${headerClass} text-right`}>Items</th>
            <th scope="col" className={`${headerClass} text-right`}>Total</th>
            <th scope="col" className={headerClass}>Status</th>
            <th scope="col" className={headerClass}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <tr key={order.id} className="border-t border-rule hover:bg-shelf/60">
                <td className="px-4 py-3 font-semibold text-ink">#{order.id}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-ink">{order.customerName}</p>
                  <p className="text-muted">{order.customerEmail}</p>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-ink">
                  {formatOrderDate(order.createdAt)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-ink">{itemCount}</td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-ink">
                  {formatPrice(order.total)}
                </td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/admin/orders/${order.id}`}
                    aria-label={`View order ${order.id}`}
                    className="rounded-lg px-3 py-1.5 text-sm font-semibold text-pine transition-colors hover:bg-shelf hover:text-pine-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-pine"
                  >
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}