import { useState } from "react";
import { Link } from "react-router";
import { ImageOff, Pencil, Trash2 } from "lucide-react";
import StockBadge from "./StockBadge";
import { formatPrice } from "../../lib/utils";
import type { Product } from "../../types/Product";

interface ProductsTableProps {
  products: Product[];
  onDelete: (product: Product) => void;
}

interface ProductThumbProps {
  src: string;
}

// A broken image link must not leave an ugly hole in the table.
function ProductThumb({ src }: ProductThumbProps) {
  const [failed, setFailed] = useState<boolean>(false);

  return (
    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-shelf">
      {failed ? (
        <span className="flex h-full w-full items-center justify-center text-muted">
          <ImageOff className="h-5 w-5" aria-hidden="true" />
        </span>
      ) : (
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}

const headerCell = "px-4 py-3 font-medium";
const focusRing = "focus:outline-none focus-visible:ring-2 focus-visible:ring-pine";

export default function ProductsTable({ products, onDelete }: ProductsTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-rule bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Products</caption>
        <thead className="border-b border-rule bg-shelf text-muted">
          <tr>
            <th scope="col" className={headerCell}>
              Product
            </th>
            <th scope="col" className={`${headerCell} hidden md:table-cell`}>
              Category
            </th>
            <th scope="col" className={`${headerCell} text-right`}>
              Price
            </th>
            <th scope="col" className={headerCell}>
              Stock
            </th>
            <th scope="col" className={`${headerCell} text-right`}>
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-rule">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-shelf/60">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <ProductThumb src={product.image} />
                  <div className="min-w-0">
                    <p className="line-clamp-2 font-medium text-ink">{product.name}</p>
                    {/* The category column is hidden on phones, so show it here instead. */}
                    <p className="mt-0.5 text-xs text-muted md:hidden">{product.category}</p>
                  </div>
                </div>
              </td>

              <td className="hidden px-4 py-3 text-muted md:table-cell">{product.category}</td>

              <td className="px-4 py-3 text-right font-medium tabular-nums text-ink">
                {formatPrice(product.price)}
              </td>

              <td className="px-4 py-3">
                <StockBadge stock={product.stock} />
              </td>

              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    to={`/admin/products/${product.id}/edit`}
                    aria-label={`Edit ${product.name}`}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 font-medium text-ink transition-colors hover:bg-shelf ${focusRing}`}
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Edit</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(product)}
                    aria-label={`Delete ${product.name}`}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 font-medium text-ink transition-colors hover:bg-alert/10 hover:text-alert ${focusRing}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}