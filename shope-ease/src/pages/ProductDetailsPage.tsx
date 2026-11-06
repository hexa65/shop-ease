import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, ImageOff, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import Toast from "../components/ui/Toast";
import type { ToastProps } from "../components/ui/Toast";
import { useCart } from "../hooks/useCart";
import { useProduct } from "../hooks/useProduct";
import { CART_LINK } from "../lib/constants";
import { formatPrice, parseProductId } from "../lib/utils";
import { isNotFoundError } from "../services/api";
import type { Product } from "../types/Product";

type ToastState = Pick<ToastProps, "message" | "variant">;

/* ---------- The success view (private to this file) ---------- */

interface ProductDetailsViewProps {
  product: Product;
}

function ProductDetailsView({ product }: ProductDetailsViewProps) {
  const { items, addItem } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [imageFailed, setImageFailed] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // useCallback keeps this function the same between renders,
  // so the Toast timer is not restarted every time the page updates.
  const handleCloseToast = useCallback(() => setToast(null), []);

  // How many of this product are already in the cart (0 if none)?
  const inCart = items.find((item) => item.productId === product.id)?.quantity ?? 0;

  // The shelf and the basket share the stock.
  const maxQuantity = Math.max(0, product.stock - inCart);

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isMaxedOut = !isOutOfStock && maxQuantity === 0;
  const canAdd = !isOutOfStock && !isMaxedOut;

  // Never show or add more than what is available.
  const selectedQuantity = Math.min(quantity, Math.max(maxQuantity, 1));

  const decreaseQuantity = (): void => {
    setQuantity(Math.max(1, selectedQuantity - 1));
  };

  const increaseQuantity = (): void => {
    setQuantity(Math.min(maxQuantity, selectedQuantity + 1));
  };

  const handleAddToCart = (): void => {
    addItem(product, selectedQuantity);
    setQuantity(1);
    setToast({
      message: `${selectedQuantity} × ${product.name} added to your cart.`,
      variant: "success",
    });
  };

  const addButtonLabel = isOutOfStock
    ? "Out of stock"
    : isMaxedOut
      ? "All available units are in your cart"
      : "Add to cart";

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
      {/* Image */}
      <div className="overflow-hidden rounded-2xl border border-rule bg-white">
        {imageFailed ? (
          <div className="flex aspect-square items-center justify-center bg-shelf text-muted">
            <ImageOff className="h-12 w-12" aria-hidden="true" />
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageFailed(true)}
            className="aspect-square w-full object-cover"
          />
        )}
      </div>

      {/* Info */}
      <div>
        <p className="text-sm font-semibold tracking-wide text-pine uppercase">
          {product.category}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">{product.name}</h1>

        <div className="mt-3 flex items-center gap-2 text-sm text-muted">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
          <span>{product.rating.toFixed(1)} out of 5</span>
        </div>

        <p className="mt-6 text-3xl font-bold text-ink">{formatPrice(product.price)}</p>

        <p
          className={`mt-2 text-sm font-medium ${
            isOutOfStock ? "text-alert" : isLowStock ? "text-amber-700" : "text-emerald-700"
          }`}
        >
          {isOutOfStock
            ? "Out of stock"
            : isLowStock
              ? `Only ${product.stock} left`
              : "In stock"}
        </p>

        <p className="mt-6 leading-relaxed text-muted">{product.description}</p>

        {/* Quantity + add to cart */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div
            role="group"
            aria-label="Quantity"
            className="inline-flex items-center self-start rounded-xl border border-rule bg-white"
          >
            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={!canAdd || selectedQuantity <= 1}
              aria-label="Decrease quantity"
              className="rounded-l-xl p-3 text-ink transition-colors hover:bg-shelf focus:outline-none focus-visible:ring-2 focus-visible:ring-pine disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
            </button>
            <span aria-live="polite" className="w-12 text-center font-semibold text-ink">
              {selectedQuantity}
            </span>
            <button
              type="button"
              onClick={increaseQuantity}
              disabled={!canAdd || selectedQuantity >= maxQuantity}
              aria-label="Increase quantity"
              className="rounded-r-xl p-3 text-ink transition-colors hover:bg-shelf focus:outline-none focus-visible:ring-2 focus-visible:ring-pine disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-pine px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-pine-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            {addButtonLabel}
          </button>
        </div>

        {inCart > 0 && (
          <p className="mt-4 text-sm text-muted">
            {inCart} in your cart ·{" "}
            <Link
              to={CART_LINK.to}
              className="font-semibold text-pine hover:text-pine-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-pine"
            >
              View cart
            </Link>
          </p>
        )}
      </div>

      {toast && (
        <Toast message={toast.message} variant={toast.variant} onClose={handleCloseToast} />
      )}
    </div>
  );
}

/* ---------- The page ---------- */

export default function ProductDetailsPage() {
  // The route must be written as "/products/:id" in router.tsx.
  const { id } = useParams<{ id: string }>();
  const productId = parseProductId(id) ?? null;

  // Hooks always come first, before any early return.
  const { data: product, isPending, isError, error: queryError, refetch } = useProduct(productId);

  // "Failed" only counts when we have nothing cached to show.
  const hasFailed = isError && product === undefined;

  // A disabled query (invalid id) stays isPending forever, so we check productId too.
  const isLoading = productId !== null && isPending;
  const isNotFound = productId === null || (hasFailed && isNotFoundError(queryError));
  const hasError = hasFailed && !isNotFound;

  const handleRetry = (): void => {
    void refetch();
  };

  // One place decides which of the four states to show.
  let content: ReactNode;

  if (isLoading) {
    content = (
      <div className="grid animate-pulse gap-8 md:grid-cols-2 lg:gap-12" aria-busy="true">
        <div className="aspect-square rounded-2xl bg-rule" />
        <div className="space-y-4">
          <div className="h-4 w-24 rounded bg-rule" />
          <div className="h-9 w-3/4 rounded bg-rule" />
          <div className="h-4 w-32 rounded bg-rule" />
          <div className="h-9 w-40 rounded bg-rule" />
          <div className="h-24 w-full rounded bg-rule" />
          <div className="h-12 w-64 rounded-xl bg-rule" />
        </div>
      </div>
    );
  } else if (isNotFound) {
    content = (
      <div className="rounded-2xl border border-rule bg-white px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-ink">Product not found</h1>
        <p className="mt-2 text-muted">
          We could not find the product you are looking for. It may have been removed.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex rounded-xl bg-pine px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pine-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2"
        >
          Browse all products
        </Link>
      </div>
    );
  } else if (hasError) {
    content = (
      <div role="alert" className="rounded-2xl border border-rule bg-white px-6 py-16 text-center">
        <h1 className="text-xl font-bold text-ink">We could not load this product</h1>
        <p className="mt-2 text-muted">Check your connection and try again.</p>
        <button
          type="button"
          onClick={handleRetry}
          className="mt-6 rounded-xl bg-pine px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pine-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2"
        >
          Try again
        </button>
      </div>
    );
  } else if (product) {
    // key={product.id} resets the quantity when you move to a different product.
    content = <ProductDetailsView key={product.id} product={product} />;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/products"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-pine"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to products
      </Link>

      {content}
    </section>
  );
}