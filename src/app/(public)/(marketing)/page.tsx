import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Search,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="size-3.5" />
              <span>Municipal Citizen Service Portal</span>
            </div>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
              Empowering Citizens,{" "}
              <span className="text-primary">Transforming Our City</span>
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Report civic complaints, track real-time resolution progress, and
              hold municipal departments accountable with transparent SLA
              timelines.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard/submit-request">
                <Button size="lg" className="w-full gap-2 sm:w-auto shadow-md">
                  Report a Civic Issue
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/track">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full gap-2 sm:w-auto"
                >
                  <Search className="size-4" />
                  Track Existing Complaint
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-12 md:py-16 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary mb-4">
                <FileText className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                1. Submit with Photos
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Pinpoint the location, attach photographs, and select the
                relevant city department.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary mb-4">
                <CheckCircle2 className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                2. SLA-Driven Triage
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Automatic routing to responsible department case officers with
                enforced response time guarantees.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary mb-4">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                3. Transparent Resolution
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Receive live status updates, inspection proof from technicians,
                and rate the completed service.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
