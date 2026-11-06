import { formatPrice } from "../../lib/utils";
import type { Order } from "../../types/order";

interface OrderItemsListProps {
  items: Order["items"];
  total: number;
}

export default function OrderItemsList({ items, total }: OrderItemsListProps) {
  return (
    <section
      aria-labelledby="order-items-heading"
      className="rounded-2xl border border-rule bg-white p-5"
    >
      <h2 id="order-items-heading" className="text-base font-semibold text-ink">
        Items
      </h2>

      <ul className="mt-4 divide-y divide-rule">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-4 py-3">
            {/* The gray box behind the image shows if the picture fails to load. */}
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-shelf">
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-ink">{item.name}</p>
              <p className="text-sm text-muted">
                {item.quantity} x {formatPrice(item.price)}
              </p>
            </div>
            <p className="font-semibold tabular-nums text-ink">
              {formatPrice(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-2 flex items-center justify-between border-t border-rule pt-4">
        <p className="font-semibold text-ink">Total</p>
        <p className="text-lg font-bold tabular-nums text-ink">{formatPrice(total)}</p>
      </div>
    </section>
  );
}