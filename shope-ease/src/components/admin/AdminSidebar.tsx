import { Link, NavLink } from "react-router";
import { Store } from "lucide-react";
import { ADMIN_NAV_ITEMS } from "../../lib/adminNav";

interface AdminSidebarProps {
  // Called when a link is used. The phone drawer passes "close the menu".
  onNavigate?: () => void;
}

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-pine-dark";

const linkBase = `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${focusRing}`;

export default function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  return (
    <div className="flex h-full flex-col bg-pine-dark px-4 py-6 text-white">
      <div className="px-3">
        <Link
          to="/admin"
          onClick={onNavigate}
          className={`rounded text-xl font-extrabold tracking-tight ${focusRing}`}
        >
          ShopEase
        </Link>
        <p className="mt-1 text-sm text-white/70">Store admin</p>
      </div>

      <nav aria-label="Admin" className="mt-10 flex-1">
        <ul className="space-y-1">
          {ADMIN_NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `${linkBase} ${
                    isActive
                      ? "bg-white text-pine-dark"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-white/20 pt-4">
        <Link
          to="/"
          onClick={onNavigate}
          className={`${linkBase} text-white/80 hover:bg-white/10 hover:text-white`}
        >
          <Store className="h-5 w-5" aria-hidden="true" />
          View store
        </Link>
      </div>
    </div>
  );
}