import type { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
import ProductGrid from "../products/ProductGrid";
import ProductSkeleton from "../products/ProductSkeleton";
import ErrorMessage from "../ui/ErrorMessage";

const FEATURED_COUNT = 4;

export default function FeaturedProducts() {
  const { data: products = [], isPending, isError, isFetching, refetch } = useProducts();

  // isPending = "no data yet". On a retry after an error we also want the skeleton.
  const isLoading = isPending || (isError && isFetching);
  // Only an error when we have nothing cached to show.
  const hasFailed = isError && products.length === 0;

  const featured = products.slice(0, FEATURED_COUNT);

  const handleRetry = (): void => {
    void refetch();
  };

  let content: ReactNode;

  if (isLoading) {
    content = <ProductSkeleton count={FEATURED_COUNT} />;
  } else if (hasFailed) {
    content = (
      <ErrorMessage message="We could not load the featured products." onRetry={handleRetry} />
    );
  } else if (featured.length === 0) {
    content = <p className="text-muted">New products are coming soon. Check back shortly.</p>;
  } else {
    content = <ProductGrid products={featured} />;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">Featured products</h2>
          <p className="mt-2 text-muted">A few favorites to get you started.</p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-pine transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-pine/40"
        >
          View all
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {content}
    </section>
  );
}