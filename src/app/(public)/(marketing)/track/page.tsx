import type { Metadata } from "next";
import { Suspense } from "react";
import { PublicTracker } from "@/components/modules/tracking";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Track Complaint Status | CityCare Citizen Platform",
  description:
    "Track the real-time progress, department routing, technician work updates, and SLA countdowns for your municipal service complaint.",
};

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
            <Skeleton className="h-44 w-full rounded-2xl" />
            <Skeleton className="h-72 w-full rounded-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <Skeleton className="lg:col-span-7 h-96 rounded-2xl" />
              <Skeleton className="lg:col-span-5 h-96 rounded-2xl" />
            </div>
          </div>
        }
      >
        <PublicTracker />
      </Suspense>
    </div>
  );
}
