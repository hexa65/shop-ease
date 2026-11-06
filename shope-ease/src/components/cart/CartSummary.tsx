import { Link } from "react-router";
import {
  FREE_SHIPPING_THRESHOLD,
  getOrderTotal,
  getShippingFee,
} from "../../lib/pricing";
import { formatPrice } from "../../lib/utils";

interface CartSummaryProps {
  itemCount: number;
  subtotal: number;
}

const CHECKOUT_PATH = "/checkout";

export default function CartSummary({ itemCount, subtotal }: CartSummaryProps) {
  const shipping = getShippingFee(subtotal);
  const total = getOrderTotal(subtotal);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <aside
      aria-labelledby="order-summary-heading"
      className="rounded-2xl border border-rule bg-white p-6 shadow-sm"
    >
      <h2 id="order-summary-heading" className="text-lg font-bold text-ink">
        Order summary
      </h2>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">
            Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
          </dt>
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

      {/* Free shipping hint */}
      <div className="mt-6">
        <p className="text-sm text-muted">
          {remaining > 0
            ? `Add ${formatPrice(remaining)} more for free shipping.`
            : "You have free shipping."}
        </p>
        <div aria-hidden="true" className="mt-2 h-2 overflow-hidden rounded-full bg-shelf">
          <div className="h-full rounded-full bg-pine" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <Link
        to={CHECKOUT_PATH}
        className="mt-6 flex w-full items-center justify-center rounded-xl bg-pine px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-pine-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2"
      >
        Checkout
      </Link>
      <Link
        to="/products"
        className="mt-3 block text-center text-sm font-medium text-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-pine"
      >
        Continue shopping
      </Link>
    </aside>
  );
}