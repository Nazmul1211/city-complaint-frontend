import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Search,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative border-b bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3.5 py-1 text-xs font-medium text-foreground">
            <ShieldCheck className="size-3.5 text-primary" />
            <span>Official Municipal Citizen Service Portal</span>
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Empowering Citizens,{" "}
            <span className="text-primary">Resolving City Issues</span>
          </h1>

          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Submit public service complaints directly to municipal authorities,
            track technician assignments in real-time, and verify completed
            repairs with photographic proof and strict SLA timelines.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/dashboard/submit-request" className="w-full sm:w-auto">
              <Button size="lg" className="w-full gap-2 font-medium sm:w-auto">
                Report a Civic Issue
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/track" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 font-medium sm:w-auto"
              >
                <Search className="size-4" />
                Track Complaint
              </Button>
            </Link>
            <Link href="/departments" className="w-full sm:w-auto">
              <Button
                variant="ghost"
                size="lg"
                className="w-full gap-2 font-medium sm:w-auto"
              >
                <Building2 className="size-4" />
                City Departments
              </Button>
            </Link>
          </div>

          {/* Quick trust metrics */}
          <div className="mt-12 grid grid-cols-1 gap-4 border-t pt-8 sm:grid-cols-3">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4 text-primary shrink-0" />
              <span>24–48h SLA Triage Guarantee</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Photo-Verified Resolution</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="size-4 text-primary shrink-0" />
              <span>Transparent Public Accountability</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
