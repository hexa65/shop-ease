interface CartBadgeProps {
  count: number;
  className?: string;
}

// A small round counter. It hides itself when the cart is empty.
// aria-hidden: the link around it already says "Cart, 3 items" for screen readers.
export default function CartBadge({ count, className = "" }: CartBadgeProps) {
  if (count < 1) {
    return null;
  }

  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-pine px-1.5 text-xs font-semibold text-white ${className}`.trim()}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}