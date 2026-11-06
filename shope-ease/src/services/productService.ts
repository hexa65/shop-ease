import { api } from "./api";
import type {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from "../types/Product";

const PRODUCTS_PATH = "/products";

// GET /products -> all products
export async function getProducts(): Promise<Product[]> {
  const res = await api.get<Product[]>(PRODUCTS_PATH);
  return res.data;
}

// GET /products/:id -> one product (axios throws on 404)
export async function getProductById(id: number): Promise<Product> {
  const res = await api.get<Product>(`${PRODUCTS_PATH}/${id}`);
  return res.data;
}

// POST /products -> creates a product, the server adds the id
export async function createProduct(
  input: CreateProductInput,
): Promise<Product> {
  const res = await api.post<Product>(PRODUCTS_PATH, input);
  return res.data;
}

// PATCH /products/:id -> changes only the fields we send, returns the saved product.
// (PUT would replace the whole product, and a forgotten field would be erased.)
export async function updateProduct(
  id: number,
  changes: UpdateProductInput,
): Promise<Product> {
  const res = await api.patch<Product>(`${PRODUCTS_PATH}/${id}`, changes);
  return res.data;
}

// DELETE /products/:id -> removes the product for good.
// json-server answers with an empty object, so there is nothing to return.
export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`${PRODUCTS_PATH}/${id}`);
}

// Read the real stock from the server (the cart's copy may be old).
export async function getProductStock(id: number): Promise<number> {
  const product = await getProductById(id);
  return product.stock;
}

// Only the stock changes. It reuses updateProduct, so there is one
// place that knows how to PATCH a product.
export async function updateProductStock(
  id: number,
  stock: number,
): Promise<void> {
  await updateProduct(id, { stock });
}
