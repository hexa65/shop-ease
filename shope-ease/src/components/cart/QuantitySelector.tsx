import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  value: number;
  max: number;
  min?: number;
  onChange: (value: number) => void;
  itemName: string;
}

const buttonClass =
  "p-2.5 text-ink transition-colors hover:bg-shelf focus:outline-none focus-visible:ring-2 focus-visible:ring-pine disabled:cursor-not-allowed disabled:opacity-40";

// A controlled component: it remembers nothing. The parent owns the number.
export default function QuantitySelector({
  value,
  max,
  min = 1,
  onChange,
  itemName,
}: QuantitySelectorProps) {
  return (
    <div
      role="group"
      aria-label={`Quantity for ${itemName}`}
      className="inline-flex items-center rounded-xl border border-rule bg-white"
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`Decrease quantity of ${itemName}`}
        className={`rounded-l-xl ${buttonClass}`}
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>

      <span aria-live="polite" className="w-10 text-center text-sm font-semibold text-ink">
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Increase quantity of ${itemName}`}
        className={`rounded-r-xl ${buttonClass}`}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}