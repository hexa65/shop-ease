import { Navigate } from "react-router";

// Adding products is an admin job now. This route stays so that old links and
// bookmarks to /products/new still work. `replace` keeps the Back button clean.
export default function CreateProductPage() {
  return <Navigate to="/admin/products/new" replace />;
}