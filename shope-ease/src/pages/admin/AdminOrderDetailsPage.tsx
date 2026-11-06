import { useCallback, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import OrderCustomerInfo from "../../components/admin/OrderCustomerInfo";
import OrderItemsList from "../../components/admin/OrderItemsList";
import OrderStatusBadge from "../../components/admin/OrderStatusBadge";
import Button from "../../components/ui/button";
import EmptyState from "../../components/ui/EmptyState";
import Toast from "../../components/ui/Toast";
import type { ToastProps } from "../../components/ui/Toast";
import { useOrder } from "../../hooks/useOrder";
import { useUpdateOrderStatus } from "../../hooks/useUpdateOrderStatus";
import { formatOrderDateTime } from "../../lib/dates";
import { isNotFoundError } from "../../lib/errors";

type ToastState = Pick<ToastProps, "message" | "variant">;

const ORDERS_PATH = "/admin/orders";

export default function AdminOrderDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const isValidId = Number.isInteger(orderId) && orderId > 0;

  // Hooks first, always. A bad id becomes 0, so the query never asks the server.
  const { data: order, isPending, error, refetch } = useOrder(isValidId ? orderId : 0);
  const updateStatus = useUpdateOrderStatus();
  const [toast, setToast] = useState<ToastState | null>(null);
  const statusPanelRef = useRef<HTMLElement>(null);

  // useCallback keeps this function the same between renders,
  // so the Toast timer is not restarted every time the page updates.
  const handleCloseToast = useCallback(() => setToast(null), []);

  // 1. Bad id, or the server says it does not exist.
  if (!isValidId || (error && isNotFoundError(error))) {
    return (
      <>
        <AdminPageHeader title="Order" />
        <EmptyState
          title="Order not found"
          description="We could not find that order. The link may be wrong."
          actionLabel="Back to orders"
          onAction={() => navigate(ORDERS_PATH)}
        />
      </>
    );
  }

  // 2. Loading.
  if (isPending) {
    return (
      <>
        <AdminPageHeader title="Order" />
        <div role="status" aria-live="polite" className="animate-pulse space-y-4">
          <span className="sr-only">Loading the order...</span>
          <div className="h-24 rounded-2xl bg-shelf" />
          <div className="h-64 rounded-2xl bg-shelf" />
        </div>
      </>
    );
  }

  // 3. Something else went wrong (network, server down).
  if (error) {
    return (
      <>
        <AdminPageHeader title="Order" />
        <EmptyState
          title="We could not load this order"
          description="Check that the server is running, then try again."
          actionLabel="Try again"
          onAction={() => {
            void refetch();
          }}
        />
      </>
    );
  }

  // 4. Loaded. `order` is a real Order from here on.
  const handleMarkCompleted = (): void => {
    updateStatus.mutate(
      { id: order.id, status: "completed" },
      {
        onSuccess: (saved) => {
          setToast({
            message: `Order #${saved.id} was marked as completed.`,
            variant: "success",
          });
          // The button is about to disappear. Move focus somewhere stable.
          statusPanelRef.current?.focus();
        },
        onError: (saveError) => {
          console.error(saveError);
          setToast({
            message:
              "We could not update the order. Check that the server is running, then try again.",
            variant: "error",
          });
        },
      },
    );
  };

  return (
    <>
      <Link
        to={ORDERS_PATH}
        className="mb-4 inline-flex items-center gap-1 rounded-lg text-sm font-semibold text-pine transition-colors hover:text-pine-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-pine"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to orders
      </Link>

      <AdminPageHeader
        title={`Order #${order.id}`}
        description={`Placed on ${formatOrderDateTime(order.createdAt)}`}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-start-3 lg:row-start-1">
          <section
            ref={statusPanelRef}
            tabIndex={-1}
            aria-labelledby="order-status-heading"
            className="rounded-2xl border border-rule bg-white p-5 focus:outline-none"
          >
            <h2 id="order-status-heading" className="text-base font-semibold text-ink">
              Status
            </h2>
            <div className="mt-3">
              <OrderStatusBadge status={order.status} />
            </div>

            {order.status === "pending" ? (
              <Button
                type="button"
                onClick={handleMarkCompleted}
                disabled={updateStatus.isPending}
                className="mt-5 w-full"
              >
                {updateStatus.isPending ? "Marking..." : "Mark as completed"}
              </Button>
            ) : (
              <p className="mt-4 text-sm text-muted">This order is completed.</p>
            )}
          </section>

          <OrderCustomerInfo order={order} />
        </div>

        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1">
          <OrderItemsList items={order.items} total={order.total} />
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} variant={toast.variant} onClose={handleCloseToast} />
      )}
    </>
  );
}