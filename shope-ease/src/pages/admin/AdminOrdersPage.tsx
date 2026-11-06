import { useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import OrderFilterBar from "../../components/admin/OrderFilterBar";
import OrdersTable from "../../components/admin/OrdersTable";
import EmptyState from "../../components/ui/EmptyState";
import { useOrders } from "../../hooks/useOrders";
import { countOrdersByStatus, filterOrders } from "../../lib/orderFilters";
import type { OrderStatusFilter } from "../../types/orderFilter";

const PAGE_TITLE = "Orders";
const PAGE_DESCRIPTION = "See every customer order and filter by status.";

export default function AdminOrdersPage() {
  // Hooks first, always. The early returns below come after them.
  const { data: orders, isPending, error, refetch } = useOrders();
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("all");

  // 1. Loading.
  if (isPending) {
    return (
      <>
        <AdminPageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <div role="status" aria-live="polite" className="animate-pulse space-y-4">
          <span className="sr-only">Loading orders...</span>
          <div className="h-10 w-80 max-w-full rounded-xl bg-shelf" />
          <div className="h-72 rounded-2xl bg-shelf" />
        </div>
      </>
    );
  }

  // 2. The request failed (server down, network problem).
  if (error) {
    return (
      <>
        <AdminPageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <EmptyState
          title="We could not load the orders"
          description="Check that the server is running, then try again."
          actionLabel="Try again"
          onAction={() => {
            void refetch();
          }}
        />
      </>
    );
  }

  // 3. The shop has no orders at all.
  if (orders.length === 0) {
    return (
      <>
        <AdminPageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <EmptyState
          title="No orders yet"
          description="When a customer checks out, their order will show up here."
        />
      </>
    );
  }

  // Derived data: calculated while rendering, never stored in state.
  const counts = countOrdersByStatus(orders);
  const visibleOrders = filterOrders(orders, statusFilter);

  return (
    <>
      <AdminPageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />

      <div className="space-y-4">
        <OrderFilterBar value={statusFilter} counts={counts} onChange={setStatusFilter} />

        <p aria-live="polite" className="text-sm text-muted">
          Showing {visibleOrders.length} of {orders.length} orders
        </p>

        {visibleOrders.length === 0 ? (
          <EmptyState
            title="No orders match this filter"
            description="There are no orders with this status right now."
            actionLabel="Show all orders"
            onAction={() => setStatusFilter("all")}
          />
        ) : (
          <OrdersTable orders={visibleOrders} />
        )}
      </div>
    </>
  );
}