import type { Product } from "../types/Product";

// Pure function: the list and the text in, the matching products out.
// An empty search returns everything.
export function searchProducts(products: Product[], query: string): Product[] {
  const needle = query.trim().toLowerCase();
  if (needle === "") {
    return products;
  }

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(needle) ||
      product.category.toLowerCase().includes(needle),
  );
}
