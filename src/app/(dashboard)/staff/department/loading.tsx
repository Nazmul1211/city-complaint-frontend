import { Skeleton } from "@/components/ui/skeleton";

export default function StaffDepartmentLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2 border-b pb-4">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-9 w-32" />
        </div>
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={`stat-${i + 1}`} className="h-28 rounded-xl" />
        ))}
      </div>

      {/* Staff Spotlight Card Skeleton */}
      <Skeleton className="h-32 rounded-xl" />

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Skeleton className="h-96 rounded-xl lg:col-span-2" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </div>
  );
}
