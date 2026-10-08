import type { Metadata } from "next";
import { PublicTracker } from "@/components/modules/tracking";

export const metadata: Metadata = {
  title: "Track Complaint Status | CityCare Citizen Platform",
  description:
    "Track the real-time progress, assigned officers, and SLA completion status of your municipal service complaint without logging in.",
};

export default function TrackPage() {
  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Track Your Complaint Status
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Enter your unique complaint tracking number (format: REQ-2026-XXXX)
            to view real-time department routing, technician work updates, and
            SLA countdowns.
          </p>
        </div>

        <PublicTracker />
      </div>
    </div>
  );
}
