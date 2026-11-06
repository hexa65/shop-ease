import { Link, Navigate, useNavigate } from "react-router";
import CheckoutForm from "../components/checkout/CheckoutForm";
import OrderSummary from "../components/checkout/OrderSummary";
import { useCart } from "../hooks/useCart";
import { useCreateOrder } from "../hooks/useCreateOrder";
import { getOrderTotal, getShippingFee } from "../lib/pricing";
import type { CheckoutDetails } from "../types/order";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal } = useCart();
  const createOrder = useCreateOrder();

  // An empty cart has nothing to check out.
  if (items.length === 0) {
    // The cart is cleared the moment an order succeeds. In that case we are
    // already leaving for the confirmation page, so show nothing.
    if (createOrder.isSuccess) {
      return null;
    }
    return <Navigate to="/cart" replace />;
  }

  const handleSubmit = (details: CheckoutDetails): void => {
    createOrder.mutate(
      { details, items },
      {
        onSuccess: (order) => {
          // replace: the Back button must not return to a finished checkout.
          navigate(`/orders/${order.id}`, { replace: true });
        },
      },
    );
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-8">
        <Link
          to="/cart"
          className="text-sm font-medium text-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-pine"
        >
          Back to cart
        </Link>
        <h1 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">Checkout</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2">
          <CheckoutForm
            onSubmit={handleSubmit}
            isSubmitting={createOrder.isPending}
            submitError={createOrder.error?.message ?? null}
          />
        </div>

        <div className="lg:sticky lg:top-24">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shipping={getShippingFee(subtotal)}
            total={getOrderTotal(subtotal)}
          />
        </div>
      </div>
    </section>
  );
}