import {
  ArrowRight,
  FileText,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaBannerSection() {
  return (
    <section className="relative overflow-hidden py-9 sm:py-10 text-white">
      {/* Background Skyline Image: Light Mode */}
      <div className="block dark:hidden absolute inset-0 size-full pointer-events-none">
        <Image
          src="/images/civic/cta-skyline-light.jpg"
          alt="Civic City Skyline Banner (Light)"
          fill
          priority
          className="object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-[#0059b3]/85" />
      </div>

      {/* Background Skyline Image: Dark Mode */}
      <div className="hidden dark:block absolute inset-0 size-full pointer-events-none">
        <Image
          src="/images/civic/cta-skyline-dark.jpg"
          alt="Civic City Skyline Banner (Dark)"
          fill
          priority
          className="object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-[#071733]/85" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          {/* Left: Document/City Icon & Headline */}
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white shadow-md backdrop-blur-sm border border-white/30">
              <FileText className="size-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white sm:text-2xl">
                See a problem? Help your city fix it.
              </h2>
              <p className="mt-0.5 text-xs text-sky-100 sm:text-sm">
                A cleaner, safer and better city starts with you.
              </p>
            </div>
          </div>

          {/* Right: Buttons & Disclaimer */}
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/dashboard/submit-request">
              <Button
                size="default"
                className="gap-2 rounded-lg bg-white px-5 py-2.5 font-bold text-[#0284c7] shadow-xl hover:bg-slate-100"
              >
                <FileText className="size-4 text-[#0284c7]" />
                Report a Civic Issue
                <ArrowRight className="size-4 text-[#0284c7]" />
              </Button>
            </Link>

            <Link href="/track">
              <Button
                variant="outline"
                size="default"
                className="gap-2 rounded-lg border-white/40 bg-white/10 px-5 py-2.5 font-semibold text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <Search className="size-4 text-white" />
                Track a Complaint
              </Button>
            </Link>

            <span className="hidden text-xs text-sky-200/90 xl:inline-block max-w-[130px] leading-tight">
              No account required to check a complaint.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
