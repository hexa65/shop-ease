import { Link, Outlet } from "react-router";
import { ShoppingBag } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Visual panel: desktop only */}
      <aside className="relative hidden bg-indigo-900 lg:block">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
          alt=""
          aria-hidden="true"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-indigo-950/70" />

        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            <ShoppingBag className="h-6 w-6" aria-hidden="true" />
            ShopEase
          </Link>

          <div className="max-w-md">
            <p className="text-3xl leading-snug font-semibold">
              Your next favorite thing is a few clicks away.
            </p>
            <p className="mt-4 text-indigo-100">
              Save your details once and check out faster every time.
            </p>
          </div>
        </div>
      </aside>

      {/* Form side */}
      <main className="flex flex-col bg-gray-50">
        <div className="px-4 pt-6 sm:px-6 lg:hidden">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-lg font-bold text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            ShopEase
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}