import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Menu, ShoppingBag, ShoppingCart, X } from "lucide-react";
import CartBadge from "../cart/CartBadge";
import { useCart } from "../../hooks/useCart";
import { APP_NAME, AUTH_LINKS, CART_LINK, NAV_LINKS } from "../../lib/constants";
import MobileMenu from "./MobileMenu";

const desktopLinkClass = ({ isActive }: { isActive: boolean }): string =>
  [
    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-pine",
    isActive
      ? "bg-pine/10 text-pine-dark"
      : "text-muted hover:bg-shelf hover:text-ink",
  ].join(" ");

const iconButtonClass =
  "rounded-lg p-2 text-muted transition-colors hover:bg-shelf hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-pine";

const signUpClass =
  "inline-flex items-center rounded-lg bg-pine px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-pine-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { itemCount } = useCart();

  const toggleMenu = (): void => setIsMenuOpen((prev) => !prev);
  const closeMenu = (): void => setIsMenuOpen(false);

  // Screen readers hear the count, because the visual badge is hidden from them.
  const cartLabel =
    itemCount === 0
      ? CART_LINK.label
      : `${CART_LINK.label}, ${itemCount} ${itemCount === 1 ? "item" : "items"}`;

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-white/80 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-pine"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-pine text-white shadow-sm">
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-xl font-bold tracking-tight text-ink">{APP_NAME}</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end className={desktopLinkClass}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          {/* Account links: desktop only. On mobile they live in the menu. */}
          <div className="mr-2 hidden items-center gap-2 md:flex">
            <NavLink to={AUTH_LINKS.login.to} className={desktopLinkClass}>
              {AUTH_LINKS.login.label}
            </NavLink>
            <Link to={AUTH_LINKS.register.to} className={signUpClass}>
              {AUTH_LINKS.register.label}
            </Link>
          </div>

          <Link
            to={CART_LINK.to}
            aria-label={cartLabel}
            onClick={closeMenu}
            className={`${iconButtonClass} relative`}
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            <CartBadge count={itemCount} className="absolute -top-1 -right-1" />
          </Link>

          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={toggleMenu}
            className={`${iconButtonClass} md:hidden`}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </header>
  );
}

export default Navbar;