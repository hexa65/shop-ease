import { Link } from "react-router";
import { Globe, Mail, MessageCircle, ShoppingBag } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { APP_NAME } from "../../lib/constants";

interface SocialLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

const socialLinks: SocialLink[] = [
  { label: "Email us", href: "#", icon: Mail },
  { label: "Chat with us", href: "#", icon: MessageCircle },
  { label: "Visit our community", href: "#", icon: Globe },
];

const footerColumns = [
  {
    title: "Shop",
    links: [
      { label: "All Products", to: "/products" },
      { label: "Add a Product", to: "/products/new" },
      { label: "Home", to: "/" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", to: "/" },
      { label: "Shipping Info", to: "/" },
      { label: "Returns", to: "/" },
      { label: "Contact Us", to: "/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/" },
      { label: "Careers", to: "/" },
      { label: "Privacy Policy", to: "/" },
    ],
  },
] as const;

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link
              to="/"
              className={`inline-flex items-center gap-2 rounded-lg ${focusRing}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-xl font-bold tracking-tight text-white">
                {APP_NAME}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6">
              Quality products, fair prices and a smooth shopping experience.
            </p>
            <ul className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition-colors hover:bg-indigo-600 hover:text-white ${focusRing}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className={`rounded text-sm transition-colors hover:text-white ${focusRing}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-slate-800 pt-6 text-sm sm:flex-row">
          <p>
            &copy; {year} {APP_NAME}. All rights reserved.
          </p>
          <p>Built with React, TypeScript and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;