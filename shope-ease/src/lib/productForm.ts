import type {
  CreateProductInput,
  Product,
  ProductFormValues,
  UpdateProductInput,
} from "../types/Product";

// A product -> what the form fields show. Inputs always hold strings,
// even for numbers, so every number becomes text here.
export function toProductFormValues(product: Product): ProductFormValues {
  return {
    name: product.name,
    price: String(product.price),
    category: product.category,
    image: product.image,
    description: product.description,
    rating: String(product.rating),
    stock: String(product.stock),
  };
}

// Compares what the admin submitted with what the form started with and
// returns ONLY the fields that changed. This avoids the "lost update":
// if a customer buys something while the admin has the form open, an
// untouched stock field is not sent, so it cannot overwrite the new number.
export function getProductChanges(
  original: Product,
  input: CreateProductInput,
): UpdateProductInput {
  const changes: UpdateProductInput = {};

  if (input.name !== original.name) {
    changes.name = input.name;
  }
  if (input.price !== original.price) {
    changes.price = input.price;
  }
  if (input.category !== original.category) {
    changes.category = input.category;
  }
  if (input.image !== original.image) {
    changes.image = input.image;
  }
  if (input.description !== original.description) {
    changes.description = input.description;
  }
  if (input.rating !== original.rating) {
    changes.rating = input.rating;
  }
  if (input.stock !== original.stock) {
    changes.stock = input.stock;
  }

  return changes;
}
