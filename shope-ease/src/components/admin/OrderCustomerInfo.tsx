import type { Order } from "../../types/order";

interface OrderCustomerInfoProps {
  order: Order;
}

const linkClass =
  "rounded text-pine underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-pine";

export default function OrderCustomerInfo({ order }: OrderCustomerInfoProps) {
  return (
    <section
      aria-labelledby="order-customer-heading"
      className="rounded-2xl border border-rule bg-white p-5"
    >
      <h2 id="order-customer-heading" className="text-base font-semibold text-ink">
        Customer
      </h2>

      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-muted">Name</dt>
          <dd className="font-semibold text-ink">{order.customerName}</dd>
        </div>
        <div>
          <dt className="text-muted">Email</dt>
          <dd className="break-all">
            <a href={`mailto:${order.customerEmail}`} className={linkClass}>
              {order.customerEmail}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-muted">Phone</dt>
          <dd>
            <a href={`tel:${order.phone}`} className={linkClass}>
              {order.phone}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-muted">Delivery address</dt>
          <dd className="whitespace-pre-line text-ink">{order.address}</dd>
        </div>
      </dl>
    </section>
  );
}