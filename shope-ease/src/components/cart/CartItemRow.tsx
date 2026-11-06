import { useState } from "react";
import { Link } from "react-router";
import { ImageOff, Trash2 } from "lucide-react";
import QuantitySelector from "./QuantitySelector";
import { formatPrice } from "../../lib/utils";
import type { CartItem } from "../../types/cart";

interface CartItemRowProps {
  item: CartItem;
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export default function CartItemRow({ item, onQuantityChange, onRemove }: CartItemRowProps) {
  const [imageFailed, setImageFailed] = useState<boolean>(false);

  return (
    <div className="flex gap-4 p-4 sm:p-6">
      {/* Image */}
      <Link
        to={`/products/${item.productId}`}
        aria-hidden="true"
        tabIndex={-1}
        className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-shelf sm:h-28 sm:w-28"
      >
        {imageFailed ? (
          <span className="flex h-full w-full items-center justify-center text-muted">
            <ImageOff className="h-8 w-8" aria-hidden="true" />
          </span>
        ) : (
          <img
            src={item.image}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
        )}
      </Link>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <Link
            to={`/products/${item.productId}`}
            className="line-clamp-2 font-semibold text-ink hover:text-pine focus:outline-none focus-visible:ring-2 focus-visible:ring-pine"
          >
            {item.name}
          </Link>
          <p className="mt-1 text-sm text-muted">{formatPrice(item.price)} each</p>
          {item.quantity >= item.stock && (
            <p className="mt-1 text-xs font-medium text-amber-700">Maximum available</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-6">
          <QuantitySelector
            value={item.quantity}
            max={item.stock}
            itemName={item.name}
            onChange={(quantity) => onQuantityChange(item.productId, quantity)}
          />

          <p className="w-24 text-right font-bold text-ink">
            {formatPrice(item.price * item.quantity)}
          </p>

          <button
            type="button"
            onClick={() => onRemove(item.productId)}
            aria-label={`Remove ${item.name} from cart`}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-alert/10 hover:text-alert focus:outline-none focus-visible:ring-2 focus-visible:ring-pine"
          >
            <Trash2 className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}