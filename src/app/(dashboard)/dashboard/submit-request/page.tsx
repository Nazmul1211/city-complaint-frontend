import type { Metadata } from "next";
import { Suspense } from "react";
import { ComplaintWizard } from "@/components/form/complaint-wizard";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Submit Civic Complaint | CityCare Citizen Portal",
  description:
    "File a municipal service complaint or public infrastructure repair request with SLA tracking.",
};

export default function SubmitRequestPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Lodge a Civic Complaint
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete the 4-step wizard to file an issue with full municipal
          tracking, photographic evidence, and statutory SLA turnaround
          guarantees.
        </p>
      </div>

      <Suspense fallback={<WizardFallback />}>
        <ComplaintWizard />
      </Suspense>
    </div>
  );
}

function WizardFallback() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-md" />
        ))}
      </div>
      <div className="rounded-lg border bg-card p-8 space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Skeleton className="h-28 w-full rounded-md" />
          <Skeleton className="h-28 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
