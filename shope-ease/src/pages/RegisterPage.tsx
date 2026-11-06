import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import Button from "../components/ui/button";
import Input from "../components/ui/Input";
import PasswordInput from "../components/ui/PasswordInput";
import { focusField, validateRegisterForm } from "../lib/utils";
import type { RegisterFormErrors, RegisterFormValues } from "../types/auth";

const FIELD_ORDER = ["name", "email", "password", "confirmPassword"] as const;

const EMPTY_VALUES: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<RegisterFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const foundErrors = validateRegisterForm(values);
    setErrors(foundErrors);

    const firstInvalid = FIELD_ORDER.find((field) => foundErrors[field]);
    if (firstInvalid) {
      focusField(formRef.current, firstInvalid);
      return;
    }

    setIsSubmitting(true);
    // Pretend to create the account. Real authentication is not part of this course.
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    navigate("/");
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create your account</h1>
      <p className="mt-2 text-sm text-gray-600">It takes less than a minute.</p>

      <form ref={formRef} onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        <Input
          label="Full name"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Ada Lovelace"
        />

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
          autoComplete="new-password"
          hint="At least 8 characters."
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />

        <PasswordInput
          label="Confirm password"
          name="confirmPassword"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <div className="flex flex-col pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}