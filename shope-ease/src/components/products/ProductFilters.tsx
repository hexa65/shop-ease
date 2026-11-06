import type { ChangeEvent } from "react";
import { ChevronDown, Search } from "lucide-react";
import { CATEGORIES } from "../../lib/constants";
import type { CategoryFilter } from "../../types/Product";

interface ProductFiltersProps {
  search: string;
  category: CategoryFilter;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: CategoryFilter) => void;
}

const isCategoryFilter = (value: string): value is CategoryFilter =>
  value === "All" || CATEGORIES.some((category) => category === value);

const fieldClass =
  "w-full rounded-lg border border-slate-300 bg-white py-2.5 text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30";

function ProductFilters({
  search,
  category,
  onSearchChange,
  onCategoryChange,
}: ProductFiltersProps) {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onSearchChange(event.target.value);
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const value = event.target.value;
    if (isCategoryFilter(value)) {
      onCategoryChange(value);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end">
      <div className="flex-1">
        <label
          htmlFor="product-search"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Search
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="product-search"
            type="search"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className={`${fieldClass} pl-10 pr-4`}
          />
        </div>
      </div>

      <div className="sm:w-56">
        <label
          htmlFor="product-category"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Category
        </label>
        <div className="relative">
          <select
            id="product-category"
            value={category}
            onChange={handleCategoryChange}
            className={`${fieldClass} appearance-none pl-3 pr-10`}
          >
            <option value="All">All categories</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

export default ProductFilters;