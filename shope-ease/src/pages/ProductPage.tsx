import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { SearchX } from "lucide-react";
import ProductFilters from "../components/products/ProductFilters";
import ProductGrid from "../components/products/ProductGrid";
import ProductSkeleton from "../components/products/ProductSkeleton";
import ErrorMessage from "../components/ui/ErrorMessage";
import { useDebounce } from "../hooks/useDebounce";
import { useProducts } from "../hooks/useProducts";
import type { CategoryFilter } from "../types/Product";

export default function ProductPage() {
  // UI state: things only this page owns.
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const debouncedSearch = useDebounce(search, 300);

  // Server state: TanStack Query owns it.
  const { data: products = [], isPending, isError, isFetching, refetch } = useProducts();

  // isPending = "no data yet". On a retry after an error we also want the skeleton.
  const isLoading = isPending || (isError && isFetching);
  // Only an error when we have nothing cached to show.
  const hasFailed = isError && products.length === 0;

  const handleRetry = (): void => {
    void refetch();
  };

  // Filtering happens in the browser, on the cached list.
  const visibleProducts = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const matchesSearch = term === "" || product.name.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [products, debouncedSearch, category]);

  // One place decides which of the four states to show.
  let content: ReactNode;

  if (isLoading) {
    content = <ProductSkeleton />;
  } else if (hasFailed) {
    content = (
      <ErrorMessage message="We could not load the products." onRetry={handleRetry} />
    );
  } else if (visibleProducts.length === 0) {
    content = (
      <div className="rounded-2xl border border-rule bg-white px-6 py-16 text-center">
        <SearchX className="mx-auto h-10 w-10 text-muted" aria-hidden="true" />
        <h2 className="mt-4 text-xl font-bold text-ink">No products found</h2>
        <p className="mt-2 text-muted">
          Try a different search or choose another category.
        </p>
      </div>
    );
  } else {
    content = <ProductGrid products={visibleProducts} />;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">All products</h1>
        <p className="mt-2 text-muted">
          {isLoading || hasFailed
            ? "Browse the full ShopEase catalog."
            : `Showing ${visibleProducts.length} of ${products.length} items`}
        </p>
      </header>

      <ProductFilters
        search={search}
        category={category}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
      />

      <div className="mt-8">{content}</div>
    </section>
  );
}