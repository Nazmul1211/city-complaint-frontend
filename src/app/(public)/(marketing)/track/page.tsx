import type { Metadata } from "next";
import { Suspense } from "react";
import { PublicTracker } from "@/components/modules/tracking";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Track Complaint Status | CityCare Citizen Platform",
  description:
    "Track the real-time progress, assigned officers, and SLA completion status of your municipal service complaint without logging in.",
};

export default function TrackPage() {
  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-0.5 text-xs font-semibold text-sky-800 dark:border-sky-900 dark:bg-sky-950/60 dark:text-sky-300">
            Citizen Telemetry & Audit
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Track Your Complaint Status
          </h1>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">
            Enter your unique complaint reference number (e.g. REQ-2026-0891)
            to view real-time department routing, technician work logs, SLA benchmarks,
            and verified photographic proof.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="space-y-6">
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          }
        >
          <PublicTracker />
        </Suspense>
      </div>
    </div>
  );
}
