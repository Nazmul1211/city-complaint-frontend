import { Skeleton } from "@/components/ui/skeleton";

export default function RequestDetailsLoading() {
  return (
    <div className="space-y-6">
      {/* Header breadcrumb & actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-7 w-72" />
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      {/* Main Two-Column Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2 Cols) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Main Description Card */}
          <div className="space-y-4 rounded-lg border bg-card p-6">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <div className="grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Media Evidence Gallery Skeleton */}
          <div className="space-y-4 rounded-lg border bg-card p-6">
            <Skeleton className="h-5 w-48" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </div>

          {/* Field Work Updates Skeleton */}
          <div className="space-y-4 rounded-lg border bg-card p-6">
            <Skeleton className="h-5 w-44" />
            <div className="space-y-3">
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          {/* SLA & Status Summary Card */}
          <div className="space-y-3 rounded-lg border bg-card p-6">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Department Information Card */}
          <div className="space-y-3 rounded-lg border bg-card p-6">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-12 w-full rounded" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Timeline Audit Trail Stepper */}
          <div className="space-y-4 rounded-lg border bg-card p-6">
            <Skeleton className="h-5 w-36" />
            <div className="space-y-6 pl-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
