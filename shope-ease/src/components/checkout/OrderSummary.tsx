import { formatPrice } from "../../lib/utils";
import type { OrderItem } from "../../types/order";

interface OrderSummaryProps {
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export default function OrderSummary({ items, subtotal, shipping, total }: OrderSummaryProps) {
  return (
    <aside
      aria-labelledby="checkout-summary-heading"
      className="rounded-2xl border border-rule bg-white p-6 shadow-sm"
    >
      <h2 id="checkout-summary-heading" className="text-lg font-bold text-ink">
        Order summary
      </h2>

      <ul className="mt-6 divide-y divide-rule">
        {items.map((item) => (
          <li key={item.productId} className="flex gap-4 py-4 first:pt-0 last:pb-0">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-shelf">
              <img
                src={item.image}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium text-ink">{item.name}</p>
              <p className="mt-1 text-sm text-muted">Qty {item.quantity}</p>
            </div>
            <p className="text-sm font-semibold text-ink">
              {formatPrice(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-3 border-t border-rule pt-6 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="font-medium text-ink">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd className="font-medium text-ink">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-rule pt-3 text-base">
          <dt className="font-bold text-ink">Total</dt>
          <dd className="font-bold text-ink">{formatPrice(total)}</dd>
        </div>
      </dl>
    </aside>
  );
}