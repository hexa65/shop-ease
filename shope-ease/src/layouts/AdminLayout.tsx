import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet } from "react-router";
import { Menu, X } from "lucide-react";
import AdminSidebar from "../components/admin/AdminSidebar";
import SkipLink from "../components/ui/SkipLink";

// 1024px is Tailwind's "lg:" breakpoint.
const DESKTOP_QUERY = "(min-width: 1024px)";

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-pine-dark";

// NOTE FOR THE PRESENTATION: there is no login yet. Anyone who opens /admin
// gets in. A real shop checks the user on the server before showing any of this.
export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<boolean>(false);

  const closeMenu = useCallback((returnFocus: boolean): void => {
    returnFocusRef.current = returnFocus;
    setMenuOpen(false);
  }, []);

  // Move focus into the drawer when it opens. When it closes by Escape,
  // overlay or close button, give focus back to the button that opened it.
  // (This runs AFTER the page behind stops being inert, so focus() works.)
  useEffect(() => {
    if (menuOpen) {
      closeButtonRef.current?.focus();
    } else if (returnFocusRef.current) {
      menuButtonRef.current?.focus();
      returnFocusRef.current = false;
    }
  }, [menuOpen]);

  // While the drawer is open: Escape closes it and the page does not scroll.
  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        closeMenu(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen, closeMenu]);

  // If the window grows to desktop size with the drawer open, close it.
  // Otherwise the page would stay inert with no visible reason.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const handleChange = (event: MediaQueryListEvent): void => {
      if (event.matches) {
        setMenuOpen(false);
      }
    };
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return (

    
    <div className="min-h-screen bg-shelf">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink focus:shadow-lg"
      >
        Skip to content
      </a>
      <SkipLink />
      {/* Desktop: a fixed sidebar. */}
      <div className="fixed inset-y-0 left-0 hidden w-64 lg:block">
        <AdminSidebar />
      </div>

      {/* Phone: a drawer that slides in over a dark overlay. */}
      <div className="lg:hidden">
        <div
          aria-hidden="true"
          onClick={() => closeMenu(true)}
          className={menuOpen ? "fixed inset-0 z-40 bg-black/50" : "hidden"}
        />
        <div
          id="admin-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Admin menu"
          inert={!menuOpen}
          className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transition-transform duration-200 motion-reduce:transition-none ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AdminSidebar onNavigate={() => closeMenu(false)} />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => closeMenu(true)}
            aria-label="Close menu"
            className={`absolute right-3 top-5 rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white ${focusRing}`}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* The page. `inert` while the drawer is open: no Tab, no clicks, no screen reader. */}
      <div className="lg:pl-64" inert={menuOpen}>
        <header className="sticky top-0 z-30 flex items-center gap-3 bg-pine-dark px-4 py-3 text-white lg:hidden">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="admin-drawer"
            className={`rounded-lg p-2 transition-colors hover:bg-white/10 ${focusRing}`}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <span className="text-lg font-extrabold tracking-tight">ShopEase admin</span>
        </header>

        <main
          id="admin-main"
          tabIndex={-1}
          className="mx-auto max-w-7xl px-4 py-8 focus:outline-none sm:px-6 lg:px-8 lg:py-10"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}