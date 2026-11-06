import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { Plus, Search } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import ProductsTable from "../../components/admin/ProductTable";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EmptyState from "../../components/ui/EmptyState";
import { useAdminProducts } from "../../hooks/useAdminProducts";
import { useDeleteProduct } from "../../hooks/useDeleteProduct";
import { searchProducts } from "../../lib/productSearch";
import type { Product } from "../../types/Product";

function pluralize(count: number): string {
  return `${count} ${count === 1 ? "product" : "products"}`;
}

export default function AdminProductsPage() {
  const { data: products, isPending, error, refetch } = useAdminProducts();
  const remove = useDeleteProduct();

  // UI state: only this page cares about these three.
  const [query, setQuery] = useState<string>("");
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Derived state: calculated from the list and the search text, never stored.
  const visibleProducts = useMemo(
    () => searchProducts(products ?? [], query),
    [products, query],
  );

  const openDeleteDialog = (product: Product): void => {
    remove.reset();
    setNotice(null);
    setProductToDelete(product);
  };

  const closeDeleteDialog = (): void => {
    if (remove.isPending) {
      return;
    }
    remove.reset();
    setProductToDelete(null);
  };

  const confirmDelete = (): void => {
    if (!productToDelete) {
      return;
    }
    const { id, name } = productToDelete;
    remove.mutate(id, {
      onSuccess: () => {
        setProductToDelete(null);
        setNotice(`Deleted ${name}.`);
      },
    });
  };

  let content: ReactNode;

  if (isPending) {
    content = (
      <div role="status" aria-live="polite" className="animate-pulse space-y-3">
        <span className="sr-only">Loading products...</span>
        <div className="h-11 rounded-xl bg-shelf" />
        <div className="h-72 rounded-2xl bg-shelf" />
      </div>
    );
  } else if (error) {
    content = (
      <EmptyState
        title="We could not load the products"
        description="Check that the server is running, then try again."
        actionLabel="Try again"
        onAction={() => {
          void refetch();
        }}
      />
    );
  } else if (products.length === 0) {
    content = (
      <EmptyState
        title="No products yet"
        description="Add your first product to start selling."
        actionLabel="Add product"
        onAction={() => {
          window.location.assign("/admin/products/new");
        }}
      />
    );
  } else {
    content = (
      <>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-sm">
            <label htmlFor="product-search" className="sr-only">
              Search products
            </label>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              id="product-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or category"
              autoComplete="off"
              className="w-full rounded-xl border border-rule bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-pine"
            />
          </div>

          <p aria-live="polite" className="text-sm text-muted">
            {visibleProducts.length === products.length
              ? pluralize(products.length)
              : `${visibleProducts.length} of ${pluralize(products.length)}`}
          </p>
        </div>

        {visibleProducts.length === 0 ? (
          <EmptyState
            title="No products found"
            description={`Nothing matches "${query.trim()}". Try a different word.`}
            actionLabel="Clear search"
            onAction={() => setQuery("")}
          />
        ) : (
          <ProductsTable products={visibleProducts} onDelete={openDeleteDialog} />
        )}
      </>
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Products"
        description="Search, add, edit and remove products."
        actions={
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-xl bg-pine px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-pine-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add product
          </Link>
        }
      />

      {/* Always in the page, so a screen reader announces the message when it appears. */}
      <p role="status" className="mb-4 min-h-5 text-sm font-medium text-pine-dark">
        {notice}
      </p>

      {content}

      <ConfirmDialog
        open={productToDelete !== null}
        title="Delete this product?"
        description={
          productToDelete
            ? `${productToDelete.name} will be removed from the store. Orders already placed keep their own copy of it. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete product"
        pendingLabel="Deleting..."
        isPending={remove.isPending}
        errorMessage={remove.error ? remove.error.message : null}
        onConfirm={confirmDelete}
        onDismiss={closeDeleteDialog}
      />
    </>
  );
}