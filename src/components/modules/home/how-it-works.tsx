import {
  ArrowRight,
  Camera,
  GitBranch,
  ThumbsUp,
  Wrench,
} from "lucide-react";

interface StepItem {
  num: string;
  title: string;
  description: string;
  icon: typeof Camera;
}

const STEPS: StepItem[] = [
  {
    num: "01",
    title: "Report an issue",
    description:
      "Select your municipal category, location, and add photos showing the problem.",
    icon: Camera,
  },
  {
    num: "02",
    title: "Auto-route to department",
    description:
      "Your complaint is automatically routed to the responsible department with an SLA deadline.",
    icon: GitBranch,
  },
  {
    num: "03",
    title: "Field Inspection & repair",
    description:
      "Assigned technicians inspect the issue, perform required repairs, and upload progress.",
    icon: Wrench,
  },
  {
    num: "04",
    title: "Verify resolution",
    description:
      "You receive a notification with photo proof. Rate the resolution and help improve city services.",
    icon: ThumbsUp,
  },
];

export function HowItWorks() {
  return (
    <section className="border-b bg-background py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Left-Aligned Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How CityCare works
          </h2>
          <p className="text-sm text-muted-foreground">
            From the first report to verified resolution, every step stays visible.
          </p>
        </div>

        {/* MOBILE VIEW (< sm): Connected Vertical Timeline */}
        <div className="relative mt-8 space-y-4 sm:hidden before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#0284c7]/25 dark:before:bg-[#38bdf8]/25">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="relative flex items-start gap-3.5">
                {/* Connected Node with Icon on the vertical line */}
                <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/80 bg-card text-[#0284c7] shadow-sm dark:border-sky-800/80 dark:bg-[#0c1427] dark:text-[#38bdf8]">
                  <Icon className="size-4" />
                </div>

                {/* Step Card with Step Number Badge, Title, and Description */}
                <div className="flex-1 rounded-xl border border-slate-200/90 bg-card p-3.5 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-[#0284c7] dark:text-[#38bdf8]">
                      Step {step.num}
                    </span>
                  </div>
                  <h3 className="mt-1 text-sm font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* DESKTOP & TABLET VIEW (sm and up): Exact Horizontal Stepper Preserved */}
        <div className="relative mt-12 hidden sm:block">
          {/* Continuous Horizontal Blue Line across the 4 nodes on desktop */}
          <div
            aria-hidden="true"
            className="absolute left-10 right-10 top-3.5 hidden h-0.5 bg-[#0284c7]/30 dark:bg-[#38bdf8]/30 lg:block"
          />

          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isLast = idx === STEPS.length - 1;

              return (
                <div key={step.num} className="relative flex flex-col items-start">
                  {/* Numbered Pill on the line */}
                  <div className="z-10 flex h-7 items-center justify-center rounded-full border border-[#0284c7] bg-card px-2.5 font-mono text-xs font-bold text-[#0284c7] shadow-sm dark:border-[#38bdf8] dark:bg-slate-900 dark:text-[#38bdf8]">
                    {step.num}
                  </div>

                  {/* Icon + Step Info */}
                  <div className="mt-5 w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex size-12 items-center justify-center rounded-xl bg-sky-500/10 text-[#0284c7] dark:bg-sky-500/15 dark:text-[#38bdf8]">
                        <Icon className="size-6" />
                      </div>

                      {/* Right connecting arrow for desktop */}
                      {!isLast && (
                        <div className="hidden text-muted-foreground/40 lg:block">
                          <ArrowRight className="size-4" />
                        </div>
                      )}
                    </div>

                    <h3 className="mt-4 text-base font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
