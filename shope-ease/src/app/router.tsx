import { createBrowserRouter } from "react-router";
import MainLayout from "../types/MainLayouts";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import HomePage from "../pages/HomePage";
import ProductsPage from "../pages/ProductPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import CreateProductPage from "../pages/CreateProductPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import OrderConfirmationPage from "../pages/OrderConfirmationPage";
import DashboardPage from "../pages/admin/DashboardPage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AdminProductFormPage from "../pages/admin/AdminProductFormPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminOrderDetailsPage from "../pages/admin/AdminOrderDetailsPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  // 1. Routes that use the Auth Layout (Login, Register)
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },

  // 2. Routes that use the Admin Layout (the back office, sidebar)
  // No login yet: see the note in AdminLayout.
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "products", element: <AdminProductsPage /> },
      { path: "products/new", element: <AdminProductFormPage /> },
      { path: "products/:id/edit", element: <AdminProductFormPage /> },
      { path: "orders", element: <AdminOrdersPage /> },
      { path: "orders/:id", element: <AdminOrderDetailsPage /> },
      // Unknown admin URLs keep the sidebar instead of falling out to the store.
      { path: "*", element: <NotFoundPage /> },
    ],
  },

  // 3. Routes that use the Main Layout (the store itself)
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "products/new", element: <CreateProductPage /> },
      { path: "products/:id", element: <ProductDetailsPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "orders/:id", element: <OrderConfirmationPage /> },
      { path: "*", element: <NotFoundPage /> }, // Catch-all 404 should be last
    ],
  },
]);