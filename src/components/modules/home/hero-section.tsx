"use client";

import {
  ArrowRight,
  Camera,
  Clock,
  FileText,
  Search,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const router = useRouter();
  const [complaintNo, setComplaintNo] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintNo.trim()) {
      router.push("/track");
      return;
    }
    router.push(`/track?trackingId=${encodeURIComponent(complaintNo.trim())}`);
  };

  return (
    <section className="relative overflow-hidden bg-background py-8 md:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Civic Hero Copy & Search */}
          <div className="space-y-5 lg:col-span-6">
            {/* Official Municipal Citizen Service Portal Pill */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/60 bg-sky-50/80 px-3 py-0.5 text-xs font-medium text-sky-800 backdrop-blur-sm dark:border-sky-800/60 dark:bg-sky-950/40 dark:text-sky-300">
              <ShieldCheck className="size-3.5 text-sky-600 dark:text-sky-400" />
              <span>Official Municipal Citizen Service Portal</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[52px] leading-[1.12]">
              Report it. Track it.
              <br />
              <span className="text-[#0284c7] dark:text-[#38bdf8]">
                Get it resolved.
              </span>
            </h1>

            {/* Subparagraph */}
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Submit public service complaints directly to municipal authorities,
              track progress in real time, and verify completed repairs with
              photographic proof.
            </p>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href="/dashboard/submit-request">
                <Button
                  size="default"
                  className="gap-2 rounded-lg bg-[#0284c7] px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-[#0369a1] dark:bg-[#0284c7] dark:hover:bg-[#0369a1]"
                >
                  <FileText className="size-4" />
                  Report a Civic Issue
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/track">
                <Button
                  variant="outline"
                  size="default"
                  className="gap-2 rounded-lg border-border bg-card/60 px-5 py-2.5 font-semibold text-foreground hover:bg-muted"
                >
                  <Search className="size-4" />
                  Track a Complaint
                </Button>
              </Link>
            </div>

            {/* Quick Complaint Search Box */}
            <form
              onSubmit={handleSearch}
              className="flex max-w-lg items-center rounded-lg border border-border bg-card p-1 shadow-sm dark:bg-slate-900/90"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={complaintNo}
                  onChange={(e) => setComplaintNo(e.target.value)}
                  placeholder="Enter complaint number, e.g. CCR-2026-0891"
                  className="h-10 w-full bg-transparent pl-9 pr-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <Button
                type="submit"
                size="sm"
                className="h-9 rounded-md bg-[#0284c7] px-5 font-semibold text-white hover:bg-[#0369a1]"
              >
                Search
              </Button>
            </form>

            {/* 3 Value Pillars */}
            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center text-[#0284c7] dark:text-[#38bdf8]">
                  <Clock className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    24–48h SLA tracking
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Fast and reliable response
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center text-[#0284c7] dark:text-[#38bdf8]">
                  <Camera className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    Photo-verified resolution
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Real evidence, no delay
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center text-[#0284c7] dark:text-[#38bdf8]">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    Transparent accountability
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Open data & ward-wise status
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Seamless GIS Activity Map Blended with Hero Colors */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] overflow-hidden">
              {/* Light Theme Map Asset */}
              <div className="block dark:hidden relative size-full">
                <Image
                  src="/images/civic/map-light.png"
                  alt="CityCare Municipal GIS Live Activity Map (Light Mode)"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 700px"
                  className="object-cover object-center"
                />
              </div>

              {/* Dark Theme Map Asset */}
              <div className="hidden dark:block relative size-full">
                <Image
                  src="/images/civic/map-dark.png"
                  alt="CityCare Municipal GIS Live Activity Map (Dark Mode)"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 700px"
                  className="object-cover object-center"
                />
              </div>

              {/* Smooth Edge Blend Overlays: Left, Top, Bottom, and Right */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-32 md:w-44 bg-gradient-to-r from-background via-background/40 to-transparent z-10" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-10 sm:h-16 bg-gradient-to-b from-background via-background/25 to-transparent z-10" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 sm:h-16 bg-gradient-to-t from-background via-background/25 to-transparent z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-16 bg-gradient-to-l from-background/50 to-transparent z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
