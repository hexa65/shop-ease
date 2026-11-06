import type { HTMLAttributes } from "react";

type BadgeVariant = "primary" | "neutral" | "success" | "warning" | "danger";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const baseStyles =
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-pine/10 text-pine-dark",
  neutral: "bg-shelf text-ink",
  success: "bg-emerald-50 text-emerald-800",
  warning: "bg-amber-50 text-amber-800",
  danger: "bg-alert/10 text-alert",
};

function Badge({
  variant = "neutral",
  className = "",
  children,
  ...props
}: BadgeProps) {
  const classes = [baseStyles, variantStyles[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}

export default Badge;