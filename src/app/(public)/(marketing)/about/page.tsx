import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Eye,
  HeartHandshake,
  RotateCcw,
  Shield,
  ShieldCheck,
  Sparkles,
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
      {/* 1. Hero Header */}
      <section className="border-b border-border/40 bg-background py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/60 bg-sky-50/80 px-3.5 py-1 text-xs font-semibold text-sky-800 backdrop-blur-sm dark:border-sky-800/60 dark:bg-sky-950/40 dark:text-sky-300">
              <Shield className="size-3.5 text-sky-600 dark:text-sky-400" />
              <span>Civic Transparency Charter</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[50px] leading-tight">
              Transforming Municipal Services Through{" "}
              <span className="text-[#0284c7] dark:text-[#38bdf8]">
                Open Accountability
              </span>
            </h1>

            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
              CityCare was created to bridge the divide between citizens and
              municipal departments. We believe responsive governance requires
              enforceable SLAs, photographic proof of work, and real-time public
              oversight.
            </p>
          </div>

          {/* Quick Transparency Metric Highlights Strip */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
            <div className="rounded-2xl border border-slate-200/90 bg-card p-4 sm:p-5 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Clock className="size-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  SLA Target
                </span>
              </div>
              <p className="mt-1 text-xl sm:text-2xl font-extrabold text-foreground">
                98.4%
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                On-time statutory resolution rate
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-card p-4 sm:p-5 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
              <div className="flex items-center gap-2 text-[#0284c7] dark:text-[#38bdf8]">
                <ShieldCheck className="size-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Jurisdiction
                </span>
              </div>
              <p className="mt-1 text-xl sm:text-2xl font-extrabold text-foreground">
                54 Wards
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Standardized GPS routing equity
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-card p-4 sm:p-5 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
              <div className="flex items-center gap-2 text-[#0284c7] dark:text-[#38bdf8]">
                <Sparkles className="size-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Verification
                </span>
              </div>
              <p className="mt-1 text-xl sm:text-2xl font-extrabold text-foreground">
                100% Photo Proof
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Mandatory before ticket sign-off
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-card p-4 sm:p-5 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <RotateCcw className="size-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Citizen Rights
                </span>
              </div>
              <p className="mt-1 text-xl sm:text-2xl font-extrabold text-foreground">
                48h Reopen
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Direct secondary inspection right
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Principles Section */}
      <section className="border-b border-border/40 bg-muted/20 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Our Core Civic Principles
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              The foundational pillars guiding every department routing, field
              inspection, and citizen interaction.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/90 bg-card p-6 shadow-sm transition-all hover:border-[#0284c7]/40 dark:border-slate-800/80 dark:bg-[#0c1427]">
              <div className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7] dark:bg-sky-950/60 dark:text-[#38bdf8] mb-4">
                <Eye className="size-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Radical Public Transparency
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Every ticket status, technician assignment, and resolution note is
                recorded into an immutable public audit trail accessible to the
                complainant anytime.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-card p-6 shadow-sm transition-all hover:border-[#0284c7]/40 dark:border-slate-800/80 dark:bg-[#0c1427]">
              <div className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7] dark:bg-sky-950/60 dark:text-[#38bdf8] mb-4">
                <CheckCircle2 className="size-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Strict Ward Equity
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Every municipal ward receives equal dispatch priority and
                standardized SLA response timelines, ensuring all neighborhoods
                thrive with equal municipal care.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-card p-6 shadow-sm transition-all hover:border-[#0284c7]/40 dark:border-slate-800/80 dark:bg-[#0c1427]">
              <div className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7] dark:bg-sky-950/60 dark:text-[#38bdf8] mb-4">
                <HeartHandshake className="size-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Citizen-Verified Closure
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Complaints are never quietly closed behind municipal desks.
                Citizens inspect photographic work evidence and hold guaranteed
                48-hour case reopening rights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SLA Commitment Section */}
      <section className="border-b border-border/40 bg-background py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              The Municipal SLA Charter
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
              Statutory and legal turnaround standards enforced across all city
              departments with public accountability.
            </p>
          </div>

          <SlaCommitmentCard />
        </div>
      </section>

      {/* 4. Leadership Section */}
      <section className="border-b border-border/40 bg-muted/20 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Municipal Leadership & Oversight
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
              The dedicated public servants and civil engineers committed to
              advancing metropolitan service excellence.
            </p>
          </div>

          <TeamGrid />
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="bg-background py-16 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Spot a problem in your neighborhood?
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base max-w-xl mx-auto">
            Take a photo, pinpoint your location, and let our municipal teams
            resolve it with full statutory SLA accountability.
          </p>
          <div className="pt-3 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard/submit-request">
              <Button
                size="lg"
                className="gap-2 rounded-xl bg-[#0284c7] font-semibold text-white shadow-sm hover:bg-[#0369a1] dark:bg-[#0284c7] dark:hover:bg-[#0369a1]"
              >
                Report a Civic Issue
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/departments">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl border-border bg-card/60 font-semibold"
              >
                Explore Departments
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
