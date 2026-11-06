import type { LucideIcon } from "lucide-react";

type StatTone = "default" | "success" | "warning" | "danger";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: StatTone;
}

// One style per tone. Add a tone and TypeScript reminds you to style it here.
const TONE_STYLES: Record<StatTone, string> = {
  default: "bg-shelf text-pine",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
};

export default function StatCard({ label, value, icon: Icon, tone = "default" }: StatCardProps) {
  return (
    // A div, not a li: the page puts these inside a <dl>, where <div>
    // groups one <dt> and its <dd>.
    <div className="flex items-center gap-4 rounded-2xl border border-rule bg-white p-5">
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${TONE_STYLES[tone]}`}
      >
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <div>
        <dt className="text-sm text-muted">{label}</dt>
        <dd className="text-3xl font-bold tabular-nums text-ink">
          {value.toLocaleString("en-US")}
        </dd>
      </div>
    </div>
  );
}