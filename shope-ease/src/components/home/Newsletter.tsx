import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Mail } from "lucide-react";
import Button from "../ui/button";

function Newsletter() {
  const [email, setEmail] = useState<string>("");
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
    setIsSubscribed(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (email.trim() === "") {
      return;
    }

    setIsSubscribed(true);
    setEmail("");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid items-center gap-8 rounded-3xl bg-linear-to-br from-indigo-600 to-indigo-800 p-8 text-white shadow-xl sm:p-12 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Get 10% off your first order
          </h2>
          <p className="mt-3 max-w-md text-indigo-100">
            Join our newsletter for new arrivals, exclusive deals and a
            welcome discount code. No spam, ever.
          </p>
        </div>

        <div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <div className="relative flex-1">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-lg bg-white py-3 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700"
              />
            </div>
            <Button type="submit" variant="secondary" size="lg">
              Subscribe
            </Button>
          </form>

          {isSubscribed && (
            <p role="status" className="mt-4 text-sm font-medium text-indigo-100">
              Thanks for subscribing! Check your inbox for your discount code.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Newsletter;