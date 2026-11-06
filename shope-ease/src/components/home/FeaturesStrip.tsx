import { Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

const features: Feature[] = [
  {
    title: "Free Shipping",
    description: "On all orders over $50.",
    icon: Truck,
  },
  {
    title: "Secure Payment",
    description: "Your details are always protected.",
    icon: ShieldCheck,
  },
  {
    title: "Easy Returns",
    description: "30 days to change your mind.",
    icon: RotateCcw,
  },
  {
    title: "24/7 Support",
    description: "Friendly help whenever you need it.",
    icon: Headphones,
  },
];

function FeaturesStrip() {
  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="sr-only">Why shop with ShopEase</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ title, description, icon: Icon }) => (
            <li
              key={title}
              className="flex items-center gap-4 rounded-2xl p-4 transition-colors duration-200 hover:bg-slate-50"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="mt-0.5 text-sm text-slate-600">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default FeaturesStrip;