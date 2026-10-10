import { CheckCircle2, Clock, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { ServiceCatalog } from "@/components/modules/services";

export const metadata: Metadata = {
  title: "Municipal Services & Complaints Directory | CityCare Platform",
  description:
    "Directory of municipal public services, complaint categories, official SLA turnaround response limits, and fee schedules.",
};

export default function ServicesPage() {
  return (
    <div className="py-8 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Hero */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/60 bg-sky-50/80 px-3.5 py-1 text-xs font-semibold text-sky-800 backdrop-blur-sm dark:border-sky-800/60 dark:bg-sky-950/40 dark:text-sky-300">
            <ShieldCheck className="size-3.5 text-sky-600 dark:text-sky-400" />
            <span>Official Municipal Service Directory</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
            City Services &{" "}
            <span className="text-[#0284c7] dark:text-[#38bdf8]">
              Complaint Catalog
            </span>
          </h1>

          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Browse all official civic service categories, check statutory SLA
            turnaround response limits, and file complaints directly to responsible
            municipal departments.
          </p>
        </div>

        {/* 4 Value Pillars / Quick Metrics Bar */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
          <div className="rounded-xl border border-slate-200/90 bg-card p-4 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
            <div className="flex items-center gap-2 text-[#0284c7] dark:text-[#38bdf8]">
              <Sparkles className="size-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Categories
              </span>
            </div>
            <p className="mt-1 text-lg sm:text-xl font-extrabold text-foreground">
              8+ Civic Sectors
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Roads, water, power, waste & health
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/90 bg-card p-4 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Clock className="size-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Turnaround
              </span>
            </div>
            <p className="mt-1 text-lg sm:text-xl font-extrabold text-foreground">
              4h – 48h SLA
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Enforced statutory response targets
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/90 bg-card p-4 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
            <div className="flex items-center gap-2 text-[#0284c7] dark:text-[#38bdf8]">
              <ShieldCheck className="size-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Evidence
              </span>
            </div>
            <p className="mt-1 text-lg sm:text-xl font-extrabold text-foreground">
              100% Photo Proof
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Time-stamped before & after verification
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/90 bg-card p-4 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Pricing
              </span>
            </div>
            <p className="mt-1 text-lg sm:text-xl font-extrabold text-foreground">
              0 ৳ Public Grievances
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Free civic grievance redressal
            </p>
          </div>
        </div>

        {/* Interactive Service Catalog with Filters */}
        <ServiceCatalog />
      </div>
    </div>
  );
}
