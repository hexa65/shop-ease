import { Link } from "react-router";
import type { Product } from "../../types/Product";

interface LowStockCardProps {
  products: Product[];
  limit?: number;
}

const focusClass =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-pine";

export default function LowStockCard({ products, limit = 5 }: LowStockCardProps) {
  const shown = products.slice(0, limit);
  const hiddenCount = products.length - shown.length;

  return (
    <section
      aria-labelledby="low-stock-heading"
      className="rounded-2xl border border-rule bg-white p-5"
    >
      <h2 id="low-stock-heading" className="text-base font-semibold text-ink">
        Low stock
      </h2>

      {shown.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Everything is well stocked.</p>
      ) : (
        <ul className="mt-2 divide-y divide-rule">
          {shown.map((product) => (
            <li key={product.id}>
              <Link
                to={`/admin/products/${product.id}/edit`}
                className={`flex items-center justify-between gap-3 rounded-lg py-3 transition-colors hover:bg-shelf/60 ${focusClass}`}
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{product.name}</p>
                  <p className="text-sm text-muted">{product.category}</p>
                </div>
                {/* The words carry the meaning. The color only helps the eye. */}
                {product.stock <= 0 ? (
                  <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-800 ring-1 ring-inset ring-red-600/20">
                    Out of stock
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-600/20">
                    {product.stock} left
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {hiddenCount > 0 && (
        <Link
          to="/admin/products"
          className={`mt-3 inline-block rounded-lg px-2 py-1 text-sm font-semibold text-pine hover:text-pine-dark ${focusClass}`}
        >
          and {hiddenCount} more
        </Link>
      )}
    </section>
  );
}