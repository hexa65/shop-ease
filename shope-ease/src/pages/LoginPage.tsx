import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import Button from "../components/ui/button";
import Input from "../components/ui/Input";
import PasswordInput from "../components/ui/PasswordInput";
import { focusField, validateLoginForm } from "../lib/utils";
import type { LoginFormErrors, LoginFormValues } from "../types/auth";

const FIELD_ORDER = ["email", "password"] as const;

export default function LoginPage() {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<LoginFormValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const foundErrors = validateLoginForm(values);
    setErrors(foundErrors);

    const firstInvalid = FIELD_ORDER.find((field) => foundErrors[field]);
    if (firstInvalid) {
      focusField(formRef.current, firstInvalid);
      return;
    }

    setIsSubmitting(true);
    // Pretend to sign in. Real authentication is not part of this course.
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    navigate("/");
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h1>
      <p className="mt-2 text-sm text-gray-600">Sign in to see your orders and saved items.</p>

      <form ref={formRef} onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="name@example.com"
        />

        <PasswordInput
          label="Password"
          name="password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />

        {/* flex-col makes the button fill the full width */}
        <div className="flex flex-col pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        New here?{" "}
        <Link
          to="/register"
          className="font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}