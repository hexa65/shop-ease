import { useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { CheckCircle2 } from "lucide-react";
import OrderSummary from "../components/checkout/OrderSummary";
import EmptyState from "../components/ui/EmptyState";
import { useOrder } from "../hooks/useOrder";
import { isNotFoundError } from "../lib/errors";
import { formatDate } from "../lib/formatDate";
import { calculateSubtotal } from "../lib/orderBuilder";
import type { OrderStatus } from "../types/order";

// Record<OrderStatus, string> needs EVERY status. Add a new status later and
// the compiler tells you to write its message here.
const STATUS_TEXT: Record<OrderStatus, string> = {
  pending: "Pending. We have your order and are getting it ready.",
  completed: "Completed. Your order has been processed.",
};

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const isValidId = Number.isInteger(orderId) && orderId > 0;

  const { data: order, isPending, error, refetch } = useOrder(orderId);

  // Move focus to the heading when the order appears, so screen reader users
  // hear that something new is on the page.
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (order) {
      headingRef.current?.focus();
    }
  }, [order]);

  // 1. Bad id, or the server says it does not exist.
  if (!isValidId || (error && isNotFoundError(error))) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
        <EmptyState
          title="Order not found"
          description="We could not find that order. Check the link, or keep browsing."
          actionLabel="Browse products"
          onAction={() => navigate("/products")}
        />
      </section>
    );
  }

  // 2. Loading.
  if (isPending) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
        <div role="status" aria-live="polite" className="animate-pulse space-y-4">
          <span className="sr-only">Loading your order...</span>
          <div className="h-10 w-2/3 rounded-lg bg-shelf" />
          <div className="h-5 w-1/3 rounded-lg bg-shelf" />
          <div className="h-64 rounded-2xl bg-shelf" />
        </div>
      </section>
    );
  }

  // 3. Something else went wrong (network, server down).
  if (error) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
        <EmptyState
          title="We could not load your order"
          description="Check your connection and try again."
          actionLabel="Try again"
          onAction={() => {
            void refetch();
          }}
        />
      </section>
    );
  }

  // 4. Success. `order` is a real Order from here on.
  const subtotal = calculateSubtotal(order.items);
  // Derived from the saved total, so old orders keep showing what was really paid.
  const shipping = Math.round((order.total - subtotal) * 100) / 100;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="mb-10 flex items-start gap-4">
        <CheckCircle2 className="mt-1 h-8 w-8 shrink-0 text-pine" aria-hidden="true" />
        <div>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-3xl font-extrabold text-ink focus:outline-none sm:text-4xl"
          >
            Thank you for your order, {order.customerName}
          </h1>
          <p className="mt-2 text-muted">
            Order <span className="font-semibold text-ink">#{order.id}</span> placed on{" "}
            {formatDate(order.createdAt)}. Keep your order number for reference.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="space-y-6">
          <div className="rounded-2xl border border-rule bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-ink">Status</h2>
            <p className="mt-3 text-sm text-ink">{STATUS_TEXT[order.status]}</p>
          </div>

          <div className="rounded-2xl border border-rule bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-ink">Delivery details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-muted">Name</dt>
                <dd className="font-medium text-ink">{order.customerName}</dd>
              </div>
              <div>
                <dt className="text-muted">Email</dt>
                <dd className="font-medium text-ink">{order.customerEmail}</dd>
              </div>
              <div>
                <dt className="text-muted">Phone</dt>
                <dd className="font-medium text-ink">{order.phone}</dd>
              </div>
              <div>
                <dt className="text-muted">Address</dt>
                <dd className="whitespace-pre-line font-medium text-ink">{order.address}</dd>
              </div>
            </dl>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-xl bg-pine px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-pine-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2"
          >
            Continue shopping
          </Link>
        </div>

        <OrderSummary
          items={order.items}
          subtotal={subtotal}
          shipping={shipping}
          total={order.total}
        />
      </div>
    </section>
  );
}