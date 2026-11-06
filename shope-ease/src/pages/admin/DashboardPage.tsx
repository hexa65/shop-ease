import {
  CircleCheck,
  ClipboardList,
  Clock,
  Package,
  PackageX,
  Users,
} from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import LowStockCard from "../../components/admin/LowStockCard";
import RecentOrdersCard from "../../components/admin/RecentOrdersCard";
import StatCard from "../../components/admin/StatCard";
import EmptyState from "../../components/ui/EmptyState";
import { useDashboardStats } from "../../hooks/useDashboardStats";

const TITLE = "Dashboard";
const DESCRIPTION = "A quick look at your store.";

export default function DashboardPage() {
  const { stats, recentOrders, lowStockProducts, isPending, error, refetch } =
    useDashboardStats();

  // 1. Something failed. Shown first, even if another list is still loading.
  if (error) {
    return (
      <>
        <AdminPageHeader title={TITLE} description={DESCRIPTION} />
        <EmptyState
          title="We could not load the dashboard"
          description="Check that the server is running, then try again."
          actionLabel="Try again"
          onAction={refetch}
        />
      </>
    );
  }

  // 2. Loading. A skeleton with the same shape as the real page.
  if (isPending || !stats) {
    return (
      <>
        <AdminPageHeader title={TITLE} description={DESCRIPTION} />
        <div role="status" aria-live="polite" className="animate-pulse space-y-6">
          <span className="sr-only">Loading the dashboard...</span>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="h-24 rounded-2xl bg-shelf" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-72 rounded-2xl bg-shelf" />
            <div className="h-72 rounded-2xl bg-shelf" />
          </div>
        </div>
      </>
    );
  }

  // 3. Loaded. `stats` is a real object from here on.
  return (
    <>
      <AdminPageHeader title={TITLE} description={DESCRIPTION} />

      <section aria-label="Store summary">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Total orders" value={stats.totalOrders} icon={ClipboardList} />
          <StatCard label="Total products" value={stats.totalProducts} icon={Package} />
          <StatCard label="Total customers" value={stats.totalCustomers} icon={Users} />
          <StatCard
            label="Pending orders"
            value={stats.pendingOrders}
            icon={Clock}
            tone={stats.pendingOrders > 0 ? "warning" : "default"}
          />
          <StatCard
            label="Completed orders"
            value={stats.completedOrders}
            icon={CircleCheck}
            tone="success"
          />
          <StatCard
            label="Out of stock"
            value={stats.outOfStock}
            icon={PackageX}
            tone={stats.outOfStock > 0 ? "danger" : "default"}
          />
        </dl>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentOrdersCard orders={recentOrders} />
        <LowStockCard products={lowStockProducts} />
      </div>
    </>
  );
}