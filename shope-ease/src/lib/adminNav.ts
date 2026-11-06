import { ClipboardList, LayoutDashboard, Package } from "lucide-react";
import type { AdminNavItem } from "../types/admin";

// One list for the desktop sidebar AND the phone drawer.
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  // "end" matters here: /admin is the start of every admin path.
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Orders", to: "/admin/orders", icon: ClipboardList },
];
