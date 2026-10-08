import { Camera, GitPullRequest, ThumbsUp, Wrench } from "lucide-react";

interface Step {
  step: string;
  title: string;
  description: string;
  icon: typeof Camera;
}

const STEPS: Step[] = [
  {
    step: "01",
    title: "Submit Civic Issue",
    description:
      "Select your municipal category, pinpoint your ward or street location, and attach photographs showing the problem.",
    icon: Camera,
  },
  {
    step: "02",
    title: "Department Routing & SLA",
    description:
      "Our system dispatches the ticket directly to the responsible department case officer with a legally binding SLA countdown.",
    icon: GitPullRequest,
  },
  {
    step: "03",
    title: "Field Inspection & Repair",
    description:
      "Assigned city technicians inspect the issue on-site, perform required repairs, and upload photographic progress notes.",
    icon: Wrench,
  },
  {
    step: "04",
    title: "Citizen Sign-off & Rating",
    description:
      "Receive automated SMS and email notifications upon completion. Confirm resolution quality and rate municipal team performance.",
    icon: ThumbsUp,
  },
];

export function HowItWorks() {
  return (
    <section className="border-b bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            How CityCare Works
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            From problem reporting to confirmed repair, every step is
            transparent, audited, and citizen-first.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col rounded-lg border bg-card p-6 shadow-none"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <span className="font-mono text-sm font-bold text-muted-foreground">
                    {item.step}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
