import {
  ArrowRight,
  Camera,
  CheckCircle2,
  GitBranch,
  ShieldCheck,
  Star,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Step {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  icon: typeof Camera;
}

const STEPS: Step[] = [
  {
    step: "01",
    title: "Report an Issue",
    subtitle: "Citizen Intake",
    description:
      "Select your municipal category, pinpoint your street location or ward number, and upload clear photographic proof of the issue.",
    tag: "Mobile & Web",
    icon: Camera,
  },
  {
    step: "02",
    title: "Auto-Route & SLA",
    subtitle: "Department Dispatch",
    description:
      "Our system verifies ward jurisdiction and instantly assigns the case to the responsible municipal desk with an SLA deadline.",
    tag: "24–48h Target",
    icon: GitBranch,
  },
  {
    step: "03",
    title: "Field Repair",
    subtitle: "Technician Execution",
    description:
      "Assigned field crews inspect the site, complete physical repairs, and record timestamped work updates with photo evidence.",
    tag: "GPS Tracked",
    icon: Wrench,
  },
  {
    step: "04",
    title: "Verify & Rate",
    subtitle: "Citizen Sign-off",
    description:
      "Review the verified 'After' photograph, confirm problem resolution, and rate the municipal service team's performance.",
    tag: "Quality Audit",
    icon: Star,
  },
];

export function HowItWorks() {
  return (
    <section className="relative border-b bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-0.5 text-xs font-semibold text-primary">
            <ShieldCheck className="size-3.5" />
            Transparent Civic Pipeline
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            How CityCare Resolves Your Complaint
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            A 4-step accountable municipal process designed for fast triage,
            strict statutory SLA turnaround, and verified photographic closure.
          </p>
        </div>

        {/* 4-Step Pipeline Container */}
        <div className="relative mt-16">
          {/* Desktop Connecting Bar behind steps */}
          <div
            aria-hidden="true"
            className="absolute left-12 right-12 top-10 hidden h-0.5 bg-gradient-to-r from-sky-500/30 via-blue-500/30 to-emerald-500/30 lg:block"
          />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="group relative flex flex-col rounded-2xl border border-slate-200/90 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/70"
                >
                  {/* Step Header with Number + Icon */}
                  <div className="flex items-center justify-between">
                    <div className="relative flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-6" />
                    </div>
                    <span className="font-mono text-2xl font-black text-slate-300 dark:text-slate-700 transition-colors group-hover:text-primary">
                      {step.step}
                    </span>
                  </div>

                  {/* Subtitle tag */}
                  <div className="mt-5 flex items-center gap-2">
                    <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                      {step.tag}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {step.subtitle}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-2 text-lg font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {step.description}
                  </p>

                  {/* Step Footer Checkmark */}
                  <div className="mt-6 flex items-center gap-1.5 border-t pt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-3.5 shrink-0" />
                    <span>Stage {idx + 1} Audited</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA for Pipeline */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 text-center sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Ready to lodge an issue in your ward? Triage begins within 60 minutes.
          </p>
          <Link href="/dashboard/submit-request">
            <Button size="sm" className="gap-2 font-semibold">
              File a Complaint
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
