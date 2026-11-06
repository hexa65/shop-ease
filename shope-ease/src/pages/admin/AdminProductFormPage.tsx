import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import ProductForm from "../../components/products/ProductForm";
import EmptyState from "../../components/ui/EmptyState";
import Toast from "../../components/ui/Toast";
import type { ToastProps } from "../../components/ui/Toast";
import { useCreateProduct } from "../../hooks/useCreateProduct";
import { useProductById } from "../../hooks/useProductById";
import { useUpdateProduct } from "../../hooks/useUpdateProduct";
import { isNotFoundError } from "../../lib/errors";
import { getProductChanges, toProductFormValues } from "../../lib/productForm";
import type { CreateProductInput, Product } from "../../types/Product";

type ToastState = Pick<ToastProps, "message" | "variant">;

const PRODUCTS_PATH = "/admin/products";

interface ProductFormScreenProps {
  // The product to edit, or undefined when we are creating a new one.
  initialProduct: Product | undefined;
}

// The form plus the saving. It only appears AFTER the product has loaded,
// so the form's starting values are always the real ones.
function ProductFormScreen({ initialProduct }: ProductFormScreenProps) {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const [toast, setToast] = useState<ToastState | null>(null);
  const redirectTimer = useRef<number | undefined>(undefined);

  // A snapshot of what the form started with. useState keeps the FIRST value
  // and ignores later changes, so a background refetch cannot change what
  // "unchanged" means while the admin is typing.
  const [original] = useState<Product | undefined>(initialProduct);

  // Stop the redirect timer if the admin leaves this page early.
  useEffect(() => {
    return () => window.clearTimeout(redirectTimer.current);
  }, []);

  // useCallback keeps this function the same between renders,
  // so the Toast timer is not restarted every time the page updates.
  const handleCloseToast = useCallback(() => setToast(null), []);

  const showSavedAndLeave = (message: string): void => {
    setToast({ message, variant: "success" });
    redirectTimer.current = window.setTimeout(() => navigate(PRODUCTS_PATH), 1500);
  };

  const showError = (error: Error): void => {
    console.error(error);
    setToast({
      message:
        "We could not save the product. Check that the server is running, then try again.",
      variant: "error",
    });
  };

  const handleSubmit = (input: CreateProductInput): void => {
    // Editing: send ONLY what changed.
    if (original) {
      const changes = getProductChanges(original, input);

      // Nothing changed: no request, just go back.
      if (Object.keys(changes).length === 0) {
        navigate(PRODUCTS_PATH);
        return;
      }

      updateProduct.mutate(
        { id: original.id, changes },
        {
          onSuccess: (saved) => showSavedAndLeave(`"${saved.name}" was updated.`),
          onError: showError,
        },
      );
      return;
    }

    // Creating.
    createProduct.mutate(input, {
      onSuccess: (created) => showSavedAndLeave(`"${created.name}" was added to the store.`),
      onError: showError,
    });
  };

  // Stay disabled while saving AND after success, until we leave the page.
  const isSaving =
    createProduct.isPending ||
    createProduct.isSuccess ||
    updateProduct.isPending ||
    updateProduct.isSuccess;

  return (
    <>
      <div className="max-w-3xl">
        <ProductForm
          initialValues={original ? toProductFormValues(original) : undefined}
          submitLabel={original ? "Save changes" : "Save product"}
          cancelHref={PRODUCTS_PATH}
          onSubmit={handleSubmit}
          isSubmitting={isSaving}
        />
      </div>

      {toast && (
        <Toast message={toast.message} variant={toast.variant} onClose={handleCloseToast} />
      )}
    </>
  );
}

// One page for two routes: /admin/products/new and /admin/products/:id/edit.
// The presence of an :id in the URL tells us which one we are on.
export default function AdminProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== undefined;
  const productId = Number(id);
  const isValidId = Number.isInteger(productId) && productId > 0;

  // Hooks first, always. In "create" mode we pass 0 and the query stays silent.
  const {
    data: product,
    isPending,
    error,
    refetch,
  } = useProductById(isEditing ? productId : 0);

  // Create mode: nothing to load.
  if (!isEditing) {
    return (
      <>
        <AdminPageHeader
          title="New product"
          description="Fill in the details below. Fields with problems will tell you what to fix."
        />
        <ProductFormScreen key="new" initialProduct={undefined} />
      </>
    );
  }

  // 1. Bad id, or the server says it does not exist.
  if (!isValidId || (error && isNotFoundError(error))) {
    return (
      <>
        <AdminPageHeader title="Edit product" />
        <EmptyState
          title="Product not found"
          description="We could not find that product. It may have been deleted."
          actionLabel="Back to products"
          onAction={() => navigate(PRODUCTS_PATH)}
        />
      </>
    );
  }

  // 2. Loading.
  if (isPending) {
    return (
      <>
        <AdminPageHeader title="Edit product" />
        <div role="status" aria-live="polite" className="max-w-3xl animate-pulse space-y-4">
          <span className="sr-only">Loading the product...</span>
          <div className="h-80 rounded-2xl bg-shelf" />
        </div>
      </>
    );
  }

  // 3. Something else went wrong (network, server down).
  if (error) {
    return (
      <>
        <AdminPageHeader title="Edit product" />
        <EmptyState
          title="We could not load this product"
          description="Check that the server is running, then try again."
          actionLabel="Try again"
          onAction={() => {
            void refetch();
          }}
        />
      </>
    );
  }

  // 4. Loaded. `key` builds a fresh form if the id ever changes.
  return (
    <>
      <AdminPageHeader title={`Edit ${product.name}`} description="Change the details below, then save." />
      <ProductFormScreen key={product.id} initialProduct={product} />
    </>
  );
}