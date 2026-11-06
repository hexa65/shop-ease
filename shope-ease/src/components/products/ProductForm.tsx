import { useRef, useState } from "react";
import { Link } from "react-router";
import Button from "../ui/button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import { toCreateProductInput, validateProductForm } from "../../lib/utils";
import type {
  CreateProductInput,
  ProductFormErrors,
  ProductFormValues,
} from "../../types/Product";

interface ProductFormProps {
  onSubmit: (input: CreateProductInput) => void | Promise<void>;
  isSubmitting?: boolean;
  // Pre-filled values for editing. Read ONCE, when the form first appears.
  initialValues?: ProductFormValues;
  submitLabel?: string;
  // Where the Cancel link goes. Without it, no Cancel link is shown.
  cancelHref?: string;
}

const EMPTY_VALUES: ProductFormValues = {
  name: "",
  price: "",
  category: "",
  image: "",
  description: "",
  rating: "",
  stock: "",
};

// The order we check fields when moving focus to the first problem.
const FIELD_ORDER: (keyof ProductFormValues)[] = [
  "name",
  "price",
  "category",
  "image",
  "rating",
  "stock",
  "description",
];

export default function ProductForm({
  onSubmit,
  isSubmitting = false,
  initialValues,
  submitLabel = "Save product",
  cancelHref,
}: ProductFormProps) {
  // useState only uses its argument on the FIRST render. That is why the page
  // must render this form AFTER the product has loaded.
  const [values, setValues] = useState<ProductFormValues>(initialValues ?? EMPTY_VALUES);
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    // Clear the message for the field the user is fixing.
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const foundErrors = validateProductForm(values);
    setErrors(foundErrors);

    const firstInvalid = FIELD_ORDER.find((field) => foundErrors[field]);
    if (firstInvalid) {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
        ?.focus();
      return;
    }

    await onSubmit(toCreateProductInput(values));
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          label="Product name"
          name="name"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Wireless headphones"
        />

        <Input
          label="Price (USD)"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={values.price}
          onChange={handleChange}
          error={errors.price}
          placeholder="49.99"
        />

        <Select
          label="Category"
          name="category"
          value={values.category}
          onChange={handleChange}
          error={errors.category}
        >
          <option value="">Choose a category</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Home">Home</option>
          <option value="Beauty">Beauty</option>
        </Select>

        <Input
          label="Image link"
          name="image"
          type="url"
          value={values.image}
          onChange={handleChange}
          error={errors.image}
          placeholder="https://images.unsplash.com/..."
        />

        <Input
          label="Rating (1 to 5)"
          name="rating"
          type="number"
          min="1"
          max="5"
          step="0.1"
          value={values.rating}
          onChange={handleChange}
          error={errors.rating}
          placeholder="4.5"
        />

        <Input
          label="Stock"
          name="stock"
          type="number"
          min="0"
          step="1"
          value={values.stock}
          onChange={handleChange}
          error={errors.stock}
          placeholder="25"
        />

        <div className="md:col-span-2">
          <Textarea
            label="Description"
            name="description"
            rows={4}
            value={values.description}
            onChange={handleChange}
            error={errors.description}
            placeholder="What makes this product worth buying?"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-3">
        {cancelHref && (
          <Link
            to={cancelHref}
            className="rounded-xl border border-rule px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-shelf focus:outline-none focus-visible:ring-2 focus-visible:ring-pine"
          >
            Cancel
          </Link>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}