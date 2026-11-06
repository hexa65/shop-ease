import { useState } from "react";
import { Link } from "react-router";
import { ImageOff, Star } from "lucide-react";
import Badge from "../ui/Badge";
import { formatPrice } from "../../lib/utils";
import type { Product } from "../../types/Product";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState<boolean>(false);

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        {imageFailed ? (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <ImageOff className="h-10 w-10" aria-hidden="true" />
            <span className="sr-only">Image not available</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        <div className="absolute right-3 top-3">
          {product.stock === 0 && <Badge variant="danger">Out of stock</Badge>}
          {product.stock > 0 && product.stock < 10 && (
            <Badge variant="warning">Only {product.stock} left</Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div>
          <Badge variant="primary">{product.category}</Badge>
        </div>
        <h3 className="mt-2 line-clamp-2 font-semibold text-slate-900">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-1 text-sm text-slate-600">
          <Star
            className="h-4 w-4 fill-amber-400 text-amber-400"
            aria-hidden="true"
          />
          <span>{product.rating.toFixed(1)}</span>
        </div>
        <p className="mt-auto pt-3 text-lg font-bold text-slate-900">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;