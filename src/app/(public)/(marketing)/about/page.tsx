import {
  ArrowRight,
  CheckCircle2,
  Eye,
  HeartHandshake,
  Shield,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { SlaCommitmentCard, TeamGrid } from "@/components/modules/about";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us & Civic Charter | CityCare Municipal Platform",
  description:
    "Learn about CityCare's mission, municipal SLA transparency charter, and our commitment to responsive, accountable city services.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Header */}
      <section className="border-b bg-background py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3.5 py-1 text-xs font-medium text-foreground">
              <Shield className="size-3.5 text-primary" />
              <span>Civic Transparency Charter</span>
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              Transforming Municipal Services Through Open Accountability
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              CityCare was created to bridge the divide between citizens and
              municipal departments. We believe responsive governance requires
              enforceable SLAs, photographic proof of work, and real-time public
              oversight.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles Section */}
      <section className="border-b bg-muted/20 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Our Core Civic Principles
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              The foundational pillars guiding every department routing and
              field inspection.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6">
              <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary mb-4">
                <Eye className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                Radical Public Transparency
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Every ticket status, technician assignment, and resolution note
                is recorded into an immutable audit trail accessible to the
                complainant.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary mb-4">
                <CheckCircle2 className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                Strict Ward Equity
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Every municipal ward receives equal dispatch priority and
                standardized SLA response timelines, ensuring all neighborhoods
                thrive equally.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary mb-4">
                <HeartHandshake className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                Citizen-Verified Closure
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Complaints are never quietly closed behind closed doors.
                Citizens inspect work evidence and possess guaranteed 48-hour
                case reopening rights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SLA Commitment Section */}
      <section className="border-b bg-background py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              The Municipal SLA Charter
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Legal and statutory turnaround standards enforced across all city
              departments.
            </p>
          </div>

          <SlaCommitmentCard />
        </div>
      </section>

      {/* Leadership Section */}
      <section className="border-b bg-muted/20 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Municipal Leadership & Oversight
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              The public servants and civil engineers dedicated to transforming
              metropolitan delivery.
            </p>
          </div>

          <TeamGrid />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background py-16 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Spot a problem in your neighborhood?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Take a photo, pinpoint your location, and let our municipal teams
            resolve it with full SLA accountability.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/dashboard/submit-request">
              <Button size="lg" className="gap-2">
                Report a Civic Issue
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/departments">
              <Button variant="outline" size="lg">
                Explore Departments
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
