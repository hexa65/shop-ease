import { Link, NavLink } from "react-router";
import CartBadge from "../cart/CartBadge";
import { useCart } from "../../hooks/useCart";
import { AUTH_LINKS, CART_LINK, NAV_LINKS } from "../../lib/constants";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const mobileLinkClass = ({ isActive }: { isActive: boolean }): string =>
  [
    "block rounded-lg px-4 py-3 text-base font-medium transition-colors",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-pine",
    isActive ? "bg-pine/10 text-pine-dark" : "text-ink hover:bg-shelf",
  ].join(" ");

const authButtonBase =
  "block rounded-lg px-4 py-3 text-center text-base font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2";

function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Hooks always run before any early return, so their order never changes.
  const { itemCount } = useCart();

  if (!isOpen) {
    return null;
  }

  return (
    <div
      id="mobile-menu"
      className="absolute inset-x-0 top-full border-b border-rule bg-white shadow-lg md:hidden"
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <ul className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end onClick={onClose} className={mobileLinkClass}>
                {link.label}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink to={CART_LINK.to} onClick={onClose} className={mobileLinkClass}>
              <span className="flex items-center justify-between">
                {CART_LINK.label}
                <CartBadge count={itemCount} />
              </span>
            </NavLink>
          </li>
        </ul>

        {/* Account buttons, full width and easy to tap */}
        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-rule pt-4">
          <Link
            to={AUTH_LINKS.login.to}
            onClick={onClose}
            className={`${authButtonBase} border border-rule bg-white text-ink hover:border-pine hover:text-pine`}
          >
            {AUTH_LINKS.login.label}
          </Link>
          <Link
            to={AUTH_LINKS.register.to}
            onClick={onClose}
            className={`${authButtonBase} bg-pine text-white shadow-sm hover:bg-pine-dark`}
          >
            {AUTH_LINKS.register.label}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;