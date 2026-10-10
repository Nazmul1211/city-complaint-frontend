"use client";

import {
  AlertTriangle,
  ArrowRight,
  Clock,
  Compass,
  Droplets,
  HelpCircle,
  Lightbulb,
  Search,
  TrafficCone,
  Trash2,
  Trees,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CivicServiceCategory {
  id: string;
  title: string;
  slug: string;
  description: string;
  typicalSLA: string;
  activeCases: number;
  icon: typeof Trash2;
  color: string;
  popularIssues: string[];
}

const CIVIC_CATEGORIES: CivicServiceCategory[] = [
  {
    id: "roads",
    title: "Roads & Potholes",
    slug: "roads-potholes",
    description:
      "Asphalt damage, deep potholes, broken sidewalks, and street cave-ins.",
    typicalSLA: "24–48 hrs",
    activeCases: 42,
    icon: TrafficCone,
    color: "text-amber-500 bg-amber-500/10",
    popularIssues: ["Deep Potholes", "Damaged Curb", "Road Resurfacing"],
  },
  {
    id: "lighting",
    title: "Street Lighting",
    slug: "street-lighting",
    description:
      "Dark street poles, blown sodium/LED fixtures, and faulty substation feeders.",
    typicalSLA: "12–24 hrs",
    activeCases: 19,
    icon: Lightbulb,
    color: "text-yellow-500 bg-yellow-500/10",
    popularIssues: ["Unlit Fixture", "Flickering Light", "Fallen Pole"],
  },
  {
    id: "waste",
    title: "Waste & Sanitation",
    slug: "waste-sanitation",
    description:
      "Overflowing dumpsters, illegal trash dumping, uncollected bags, and gutter litter.",
    typicalSLA: "8–16 hrs",
    activeCases: 31,
    icon: Trash2,
    color: "text-emerald-500 bg-emerald-500/10",
    popularIssues: ["Overflowing Bin", "Illegal Dumping", "Drain Blockage"],
  },
  {
    id: "water",
    title: "Water Supply & Sewerage",
    slug: "water-sewerage",
    description:
      "Pipeline bursts, open sewer manholes, contaminated drinking water, and flooding.",
    typicalSLA: "6–24 hrs",
    activeCases: 27,
    icon: Droplets,
    color: "text-sky-500 bg-sky-500/10",
    popularIssues: ["Pipe Leakage", "Open Manhole", "Low Water Pressure"],
  },
  {
    id: "parks",
    title: "Public Parks & Greenery",
    slug: "parks-greenery",
    description:
      "Fallen branches, overgrown park pathways, broken children playground equipment.",
    typicalSLA: "48–72 hrs",
    activeCases: 14,
    icon: Trees,
    color: "text-green-500 bg-green-500/10",
    popularIssues: ["Fallen Tree", "Damaged Bench", "Overgrown Grass"],
  },
  {
    id: "environment",
    title: "Environmental Hazards",
    slug: "environmental-hazards",
    description:
      "Air pollution, chemical odor, industrial effluent runoff, and stagnant water.",
    typicalSLA: "24 hrs",
    activeCases: 8,
    icon: AlertTriangle,
    color: "text-rose-500 bg-rose-500/10",
    popularIssues: ["Stagnant Pool", "Toxic Odor", "Noise Violation"],
  },
  {
    id: "traffic",
    title: "Traffic & Transit Signage",
    slug: "traffic-transit",
    description:
      "Non-functioning traffic lights, obscured regulatory signs, and damaged zebra crossings.",
    typicalSLA: "12–24 hrs",
    activeCases: 12,
    icon: Truck,
    color: "text-indigo-500 bg-indigo-500/10",
    popularIssues: ["Faulty Signal", "Missing Sign", "Blind Corner"],
  },
  {
    id: "general",
    title: "General Municipal Support",
    slug: "general-municipal",
    description:
      "Illegal street encroachments, stray animal welfare, and general civic inquiries.",
    typicalSLA: "48 hrs",
    activeCases: 16,
    icon: HelpCircle,
    color: "text-purple-500 bg-purple-500/10",
    popularIssues: ["Encroachment", "Stray Animals", "Public Nuisance"],
  },
];

export function CityServicesSection() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return CIVIC_CATEGORIES;
    return CIVIC_CATEGORIES.filter(
      (cat) =>
        cat.title.toLowerCase().includes(term) ||
        cat.description.toLowerCase().includes(term) ||
        cat.popularIssues.some((issue) => issue.toLowerCase().includes(term))
    );
  }, [searchTerm]);

  return (
    <section className="relative border-b bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header & Search Bar */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-0.5 text-xs font-semibold text-sky-800 dark:border-sky-900 dark:bg-sky-950/60 dark:text-sky-300">
            <Compass className="size-3.5" />
            Streamlined Service Directory
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Find Your City Service & File Directly
          </h2>
          <p className="mt-2 text-base text-muted-foreground">
            Browse official civic departments, inspect current caseloads, and lodge
            direct requests with guaranteed SLA resolution targets.
          </p>

          {/* Quick Filter Input */}
          <div className="mt-8 relative mx-auto max-w-md">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search category or issue (e.g. pothole, light, waste)..."
              className="h-11 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* 8 Civic Category Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Card
                key={cat.id}
                className="group flex flex-col justify-between border border-slate-200/90 bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80"
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex size-11 items-center justify-center rounded-xl ${cat.color}`}
                    >
                      <Icon className="size-5" />
                    </div>
                    <Badge variant="outline" className="font-mono text-[11px]">
                      {cat.activeCases} Active
                    </Badge>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {cat.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {cat.description}
                  </p>

                  {/* Typical Issues tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {cat.popularIssues.map((issue) => (
                      <span
                        key={issue}
                        className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        {issue}
                      </span>
                    ))}
                  </div>

                  {/* SLA indicator */}
                  <div className="mt-4 flex items-center justify-between border-t border-dashed pt-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                      <Clock className="size-3" />
                      {cat.typicalSLA} SLA
                    </span>
                    <Link
                      href={`/dashboard/submit-request?category=${cat.slug}`}
                      className="font-semibold text-primary inline-flex items-center gap-1 hover:underline"
                    >
                      Report <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Directory Footer Link */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-xl border bg-muted/40 p-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="hidden sm:flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Compass className="size-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Looking for detailed municipal department rosters & SLA policies?
              </p>
              <p className="text-xs text-muted-foreground">
                Explore all 54 digital wards and officer contact hierarchies.
              </p>
            </div>
          </div>
          <Link href="/services">
            <Button variant="default" size="sm" className="gap-2 font-medium shrink-0">
              Explore Full Service Catalog
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
