export type Category = "Electronics" | "Fashion" | "Home" | "Beauty";

export type CategoryFilter = Category | "All";

export interface Product {
  id: number;
  name: string;
  price: number;
  category: Category;
  image: string;
  description: string;
  rating: number;
  stock: number;
}

export type CreateProductInput = Omit<Product, "id">;

// What the form holds while the user types.
// Inputs always give us strings, even for numbers.
export interface ProductFormValues {
  name: string;
  price: string;
  category: Category | "";
  image: string;
  description: string;
  rating: string;
  stock: string;
}

// One optional message per field of the real product shape.
export type ProductFormErrors = Partial<
  Record<keyof CreateProductInput, string>
>;

// Any subset of the editable fields. The id is not here: it must never change.
export type UpdateProductInput = Partial<CreateProductInput>;
