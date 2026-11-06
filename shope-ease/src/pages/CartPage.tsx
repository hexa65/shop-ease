import { useNavigate } from "react-router";
import CartItemRow from "../components/cart/CartItemRow";
import CartSummary from "../components/cart/CartSummary";
import EmptyState from "../components/ui/EmptyState";
import { useCart } from "../hooks/useCart";

export default function CartPage() {
  const navigate = useNavigate();
  const { items, itemCount, subtotal, setQuantity, removeItem, clearCart } = useCart();

  const handleClearCart = (): void => {
    // A simple confirmation for now. In Part 12 we build a nicer ConfirmDialog.
    if (window.confirm("Remove all items from your cart?")) {
      clearCart();
    }
  };

  // Empty state
  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
        <h1 className="mb-8 text-3xl font-extrabold text-ink sm:text-4xl">Your cart</h1>
        <EmptyState
          title="Your cart is empty"
          description="Browse our products and add something you like."
          actionLabel="Browse products"
          onAction={() => navigate("/products")}
        />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">Your cart</h1>
          <p className="mt-2 text-muted">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>

        <button
          type="button"
          onClick={handleClearCart}
          className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-alert/10 hover:text-alert focus:outline-none focus-visible:ring-2 focus-visible:ring-pine"
        >
          Clear cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
        <ul className="divide-y divide-rule overflow-hidden rounded-2xl border border-rule bg-white shadow-sm lg:col-span-2">
          {items.map((item) => (
            <li key={item.productId}>
              <CartItemRow
                item={item}
                onQuantityChange={setQuantity}
                onRemove={removeItem}
              />
            </li>
          ))}
        </ul>

        <div className="lg:sticky lg:top-24">
          <CartSummary itemCount={itemCount} subtotal={subtotal} />
        </div>
      </div>
    </section>
  );
}