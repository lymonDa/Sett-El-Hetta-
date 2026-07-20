import Skeleton from '@/components/base/Skeleton';

export default function ProductCardSkeleton() {
  return (
    <div className="card-luxury flex flex-col">
      {/* Image placeholder */}
      <div className="relative aspect-square overflow-hidden bg-sand-100">
        <Skeleton className="w-full h-full !rounded-none" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <Skeleton className="h-5 w-3/4 mb-3 rounded-md" />

        {/* Description — 2 lines */}
        <Skeleton className="h-4 w-full mb-2 rounded-md" />
        <Skeleton className="h-4 w-2/3 mb-4 rounded-md" />

        {/* Price + button row */}
        <div className="flex items-center justify-between mt-auto">
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-10 w-10 !rounded-xl" />
        </div>
      </div>
    </div>
  );
}