import type { LucideIcon } from "lucide-react";

export interface AdminNavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  // "end" means: active only on this exact path, not on its sub-paths.
  end?: boolean;
}
