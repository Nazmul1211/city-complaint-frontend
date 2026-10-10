import { Skeleton } from "@/components/ui/skeleton";

export default function StaffProfileLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 border-b pb-4">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
