interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden bg-sand-100 rounded-md ${className}`}
    >
      <div className="absolute inset-0 skeleton-shimmer" />
    </div>
  );
}