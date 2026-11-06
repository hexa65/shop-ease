import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";

const HERO_IMAGE = "https://picsum.photos/seed/shopease-hero/900/700";

function Hero() {
  const [imageFailed, setImageFailed] = useState<boolean>(false);

  return (
    <section className="overflow-hidden bg-linear-to-br from-indigo-50 via-white to-indigo-100">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            New season deals
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Everything you love,{" "}
            <span className="text-indigo-600">delivered with ease.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Discover quality electronics, fashion, home and beauty products at
            fair prices. Shop in a few clicks and enjoy fast, friendly service.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Shop now
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              to="/products/new"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 transition-all duration-200 hover:border-indigo-600 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Add a product
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Free shipping over $50 - 30-day returns
          </p>
        </div>

        <div className="relative">
          <div
            className="absolute -inset-4 rounded-3xl bg-indigo-200/50 blur-2xl"
            aria-hidden="true"
          />
          {imageFailed ? (
            <div
              className="relative flex aspect-4/3 w-full items-center justify-center rounded-3xl bg-linear-to-br from-indigo-500 to-indigo-700 shadow-xl"
              role="img"
              aria-label="ShopEase product showcase"
            >
              <ShoppingBag
                className="h-16 w-16 text-white/80"
                aria-hidden="true"
              />
            </div>
          ) : (
            <img
              src={HERO_IMAGE}
              alt="A colorful selection of ShopEase products"
              onError={() => setImageFailed(true)}
              className="relative aspect-4/3 w-full rounded-3xl object-cover shadow-xl"
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;