"use client";

import {
  Car,
  ChevronRight,
  Droplets,
  LayoutGrid,
  Leaf,
  Lightbulb,
  Search,
  TrafficCone,
  Trash2,
  Trees,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: typeof TrafficCone;
  href: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: "roads",
    title: "Roads & Potholes",
    description: "Report damaged roads, potholes and sidewalk issues",
    icon: TrafficCone,
    href: "/dashboard/submit-request?category=roads-potholes",
  },
  {
    id: "lighting",
    title: "Street Lighting",
    description: "Report faulty street lights and electrical issues",
    icon: Lightbulb,
    href: "/dashboard/submit-request?category=street-lighting",
  },
  {
    id: "waste",
    title: "Waste & Sanitation",
    description: "Report garbage collection, cleanliness and dumping",
    icon: Trash2,
    href: "/dashboard/submit-request?category=waste-sanitation",
  },
  {
    id: "water",
    title: "Water & Drainage",
    description: "Report water supply, leakage and drainage problems",
    icon: Droplets,
    href: "/dashboard/submit-request?category=water-drainage",
  },
  {
    id: "parks",
    title: "Public Spaces",
    description: "Report issues in parks, playgrounds and public areas",
    icon: Trees,
    href: "/dashboard/submit-request?category=public-spaces",
  },
  {
    id: "environment",
    title: "Environment",
    description: "Report pollution, illegal dumping and environmental hazards",
    icon: Leaf,
    href: "/dashboard/submit-request?category=environmental-hazards",
  },
  {
    id: "traffic",
    title: "Traffic & Transport",
    description: "Report traffic signals, signs and transportation issues",
    icon: Car,
    href: "/dashboard/submit-request?category=traffic-transport",
  },
  {
    id: "other",
    title: "Other Civic Issues",
    description: "Report any other municipal service related issue",
    icon: LayoutGrid,
    href: "/dashboard/submit-request",
  },
];

export function CityServicesSection() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return SERVICES;
    return SERVICES.filter(
      (s) =>
        s.title.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  return (
    <section className="border-b bg-background py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with Search Bar on the Right */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Find a city service
            </h2>
            <p className="text-sm text-muted-foreground">
              See common municipal services or search for a specific issue.
            </p>
          </div>

          {/* Search Box on the Right */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search services (e.g. street light, garbage...)"
              className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* 8 Service Cards (4 Columns x 2 Rows) */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            return (
              <Link key={service.id} href={service.href} className="group">
                <Card className="h-full border border-border/80 bg-card p-4 transition-all hover:border-[#0284c7] hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-[#38bdf8]">
                  <CardContent className="flex items-center justify-between p-0">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-[#0284c7] transition-colors group-hover:bg-[#0284c7] group-hover:text-white dark:bg-sky-500/15 dark:text-[#38bdf8]">
                        <Icon className="size-5" />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-bold text-foreground transition-colors group-hover:text-[#0284c7] dark:group-hover:text-[#38bdf8]">
                          {service.title}
                        </h3>
                        <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                          {service.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-[#0284c7] dark:group-hover:text-[#38bdf8]" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
