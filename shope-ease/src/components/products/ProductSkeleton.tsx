import { PRODUCT_GRID_COLUMNS } from "../../lib/constants";

interface ProductSkeletonProps {
  count?: number;
  columnsClassName?: string;
}

function ProductSkeleton({
  count = 8,
  columnsClassName = PRODUCT_GRID_COLUMNS,
}: ProductSkeletonProps) {
  return (
    <ul aria-hidden="true" className={`grid gap-6 ${columnsClassName}`}>
      {Array.from({ length: count }, (_, index) => (
        <li
          key={index}
          className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
        >
          <div className="aspect-square bg-slate-200" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-1/3 rounded bg-slate-200" />
            <div className="h-5 w-4/5 rounded bg-slate-200" />
            <div className="h-5 w-1/4 rounded bg-slate-200" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ProductSkeleton;