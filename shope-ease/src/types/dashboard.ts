// The six numbers on the admin dashboard. They are calculated, never saved.
export interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  completedOrders: number;
  outOfStock: number;
}
