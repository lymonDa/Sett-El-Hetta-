import Skeleton from '@/components/base/Skeleton';

export default function ProductDetailSkeleton() {
  return (
    <div className="bg-white">
      <div className="section-padding py-6 md:py-10">
        {/* Breadcrumb */}
        <Skeleton className="h-4 w-52 mb-6 rounded-md" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Image column */}
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full !rounded-xl" />

            {/* Thumbnails */}
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-20 !rounded-lg" />
              ))}
            </div>
          </div>

          {/* Info column */}
          <div className="flex flex-col">
            {/* Stock badge */}
            <Skeleton className="h-6 w-20 mb-3 !rounded-full" />

            {/* Title — 2 lines on mobile, 3 on desktop */}
            <Skeleton className="h-8 w-3/4 mb-2 rounded-md" />
            <Skeleton className="h-8 w-1/2 mb-4 rounded-md" />

            {/* Description — 4 lines */}
            <Skeleton className="h-4 w-full mb-2 rounded-md" />
            <Skeleton className="h-4 w-full mb-2 rounded-md" />
            <Skeleton className="h-4 w-5/6 mb-2 rounded-md" />
            <Skeleton className="h-4 w-2/3 mb-6 rounded-md" />

            {/* Specs — 3 rows */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-4 w-32 rounded-md" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-4 w-28 rounded-md" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-4 w-20 rounded-md" />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-cream-200 mb-6" />

            {/* Price */}
            <Skeleton className="h-9 w-36 mb-6 rounded-md" />

            {/* Quantity + Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Skeleton className="h-12 w-36 !rounded-lg" />
              <Skeleton className="h-12 flex-1 !rounded-lg" />
            </div>

            {/* WhatsApp button */}
            <Skeleton className="h-12 w-full !rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}