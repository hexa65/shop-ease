import ProductCard from "./ProductCard";
import { PRODUCT_GRID_COLUMNS } from "../../lib/constants";
import type { Product } from "../../types/Product";

interface ProductGridProps {
  products: Product[];
  columnsClassName?: string;
}

function ProductGrid({
  products,
  columnsClassName = PRODUCT_GRID_COLUMNS,
}: ProductGridProps) {
  return (
    <ul className={`grid gap-6 ${columnsClassName}`}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

export default ProductGrid;