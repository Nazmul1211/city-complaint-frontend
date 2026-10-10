"use client";

import {
  ArrowRight,
  Building2,
  Clock,
  Droplets,
  Hammer,
  Lightbulb,
  Search,
  ShieldAlert,
  ShieldCheck,
  Tag,
  Trash2,
  Trees,
  Wrench,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCategories } from "@/hooks";
import type { Category } from "@/types";

const FALLBACK_SERVICES: Category[] = [
  {
    id: "cat-pothole",
    departmentId: "dept-pwd",
    name: "Road Pothole & Asphalt Damage",
    code: "PWD-POT",
    description:
      "Deep potholes, surface cracks, missing manhole covers, and hazardous asphalt craters on public thoroughfares.",
    paymentRequired: false,
    isActive: true,
    department: {
      id: "dept-pwd",
      name: "Public Works & Road Maintenance",
      code: "PWD",
      isActive: true,
    },
    slaPolicy: {
      id: "sla-pwd-pot",
      categoryId: "cat-pothole",
      responseWithinHours: 24,
      resolutionWithinHours: 48,
    },
  },
  {
    id: "cat-water-leak",
    departmentId: "dept-wasa",
    name: "Drinking Water Pipeline Leakage",
    code: "WASA-LEAK",
    description:
      "Underground main pipe bursts, low municipal supply pressure, contaminated tap water, or street pooling.",
    paymentRequired: false,
    isActive: true,
    department: {
      id: "dept-wasa",
      name: "Water Supply & Sewerage Authority",
      code: "WASA",
      isActive: true,
    },
    slaPolicy: {
      id: "sla-wasa-leak",
      categoryId: "cat-water-leak",
      responseWithinHours: 6,
      resolutionWithinHours: 24,
    },
  },
  {
    id: "cat-waste-dump",
    departmentId: "dept-swm",
    name: "Overflowing Garbage & Dumping",
    code: "SWM-DUMP",
    description:
      "Uncollected neighborhood dumpster overflow, illegal roadside waste deposits, or hazardous medical litter.",
    paymentRequired: false,
    isActive: true,
    department: {
      id: "dept-swm",
      name: "Solid Waste Management",
      code: "SWM",
      isActive: true,
    },
    slaPolicy: {
      id: "sla-swm-dump",
      categoryId: "cat-waste-dump",
      responseWithinHours: 8,
      resolutionWithinHours: 16,
    },
  },
  {
    id: "cat-streetlight",
    departmentId: "dept-elec",
    name: "Streetlight Outage & Dark Strip",
    code: "ELEC-LGT",
    description:
      "Non-functional streetlamp poles, flickering halogen lamps, damaged cables, or dark road hazard spots.",
    paymentRequired: false,
    isActive: true,
    department: {
      id: "dept-elec",
      name: "Electrical & Street Lighting",
      code: "ELEC",
      isActive: true,
    },
    slaPolicy: {
      id: "sla-elec-lgt",
      categoryId: "cat-streetlight",
      responseWithinHours: 12,
      resolutionWithinHours: 24,
    },
  },
  {
    id: "cat-drainage",
    departmentId: "dept-wasa",
    name: "Storm Drainage & Waterlogging",
    code: "WASA-DRN",
    description:
      "Blocked culverts, choked storm drains causing water stagnation, or open sewer line hazards.",
    paymentRequired: false,
    isActive: true,
    department: {
      id: "dept-wasa",
      name: "Water Supply & Sewerage Authority",
      code: "WASA",
      isActive: true,
    },
    slaPolicy: {
      id: "sla-wasa-drn",
      categoryId: "cat-drainage",
      responseWithinHours: 4,
      resolutionWithinHours: 18,
    },
  },
  {
    id: "cat-fogging",
    departmentId: "dept-hlth",
    name: "Mosquito Larvicide Fogging",
    code: "HLTH-FOG",
    description:
      "Severe mosquito breeding outbreaks in open drains, construction ponds, and residential alleyways.",
    paymentRequired: false,
    isActive: true,
    department: {
      id: "dept-hlth",
      name: "Public Health & Mosquito Vector Control",
      code: "HLTH",
      isActive: true,
    },
    slaPolicy: {
      id: "sla-hlth-fog",
      categoryId: "cat-fogging",
      responseWithinHours: 24,
      resolutionWithinHours: 48,
    },
  },
  {
    id: "cat-tree-pruning",
    departmentId: "dept-prk",
    name: "Hazardous Tree Pruning & Removal",
    code: "PRK-TREE",
    description:
      "Branches interfering with power lines, fallen timber blocking pedestrian alleys, or storm-damaged trees.",
    paymentRequired: false,
    isActive: true,
    department: {
      id: "dept-prk",
      name: "Parks, Recreation & Urban Forestry",
      code: "PRK",
      isActive: true,
    },
    slaPolicy: {
      id: "sla-prk-tree",
      categoryId: "cat-tree-pruning",
      responseWithinHours: 24,
      resolutionWithinHours: 72,
    },
  },
  {
    id: "cat-comm-waste",
    departmentId: "dept-swm",
    name: "Bulk Commercial Waste Disposal",
    code: "SWM-COMM",
    description:
      "Scheduled municipal heavy hauling for restaurant bio-waste, construction rubble, or event venues.",
    paymentRequired: true,
    defaultFeeAmount: 1200,
    currency: "BDT",
    isActive: true,
    department: {
      id: "dept-swm",
      name: "Solid Waste Management",
      code: "SWM",
      isActive: true,
    },
    slaPolicy: {
      id: "sla-swm-comm",
      categoryId: "cat-comm-waste",
      responseWithinHours: 24,
      resolutionWithinHours: 48,
    },
  },
];

const DEPARTMENT_FILTERS = [
  { id: "ALL", label: "All Departments" },
  { id: "PWD", label: "Roads & PWD" },
  { id: "WASA", label: "Water & Sewer (WASA)" },
  { id: "SWM", label: "Solid Waste" },
  { id: "ELEC", label: "Street Lighting" },
  { id: "HLTH", label: "Public Health" },
  { id: "PRK", label: "Parks & Forestry" },
];

function getDepartmentIcon(code?: string) {
  switch (code?.toUpperCase()) {
    case "PWD":
      return <Wrench className="size-4 text-[#0284c7] dark:text-[#38bdf8]" />;
    case "WASA":
      return <Droplets className="size-4 text-sky-500" />;
    case "SWM":
      return <Trash2 className="size-4 text-emerald-500" />;
    case "ELEC":
      return <Lightbulb className="size-4 text-amber-500" />;
    case "HLTH":
      return <ShieldAlert className="size-4 text-rose-500" />;
    case "PRK":
      return <Trees className="size-4 text-teal-500" />;
    default:
      return <Building2 className="size-4 text-muted-foreground" />;
  }
}

export function ServiceCatalog() {
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedFee, setSelectedFee] = useState<"ALL" | "FREE" | "PAID">("ALL");

  const { data, isLoading } = useGetCategories();

  const fetchedCategories =
    data?.data && data.data.length > 0 ? data.data : null;
  const categories = fetchedCategories ?? FALLBACK_SERVICES;

  // Filter categories by search, department, and fee status
  const filtered = useMemo(() => {
    return categories.filter((cat) => {
      // 1. Department Filter
      if (selectedDept !== "ALL") {
        const deptCode = cat.department?.code?.toUpperCase();
        if (deptCode !== selectedDept) return false;
      }

      // 2. Fee Filter
      if (selectedFee === "FREE" && cat.paymentRequired) return false;
      if (selectedFee === "PAID" && !cat.paymentRequired) return false;

      // 3. Search Query
      const q = search.toLowerCase().trim();
      if (!q) return true;
      return (
        cat.name.toLowerCase().includes(q) ||
        cat.code?.toLowerCase().includes(q) ||
        cat.description?.toLowerCase().includes(q) ||
        cat.department?.name?.toLowerCase().includes(q) ||
        cat.department?.code?.toLowerCase().includes(q)
      );
    });
  }, [categories, selectedDept, selectedFee, search]);

  const clearAllFilters = () => {
    setSearch("");
    setSelectedDept("ALL");
    setSelectedFee("ALL");
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-card p-4 sm:p-5 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427] space-y-4">
        {/* Top Search Input & Fee Filter Toggle */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by civic issue name, code (e.g. PWD-POT), or department..."
              className="h-10 sm:h-11 w-full rounded-xl border border-input bg-background pl-10 pr-9 text-xs sm:text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-[#0284c7] focus:ring-1 focus:ring-[#0284c7]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Free vs Fee Segment Toggle */}
          <div className="inline-flex rounded-lg border border-border p-1 bg-muted/40 dark:bg-slate-900/60 text-xs">
            <button
              type="button"
              onClick={() => setSelectedFee("ALL")}
              className={`rounded-md px-3 py-1.5 font-semibold transition-all ${
                selectedFee === "ALL"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Types
            </button>
            <button
              type="button"
              onClick={() => setSelectedFee("FREE")}
              className={`rounded-md px-3 py-1.5 font-semibold transition-all ${
                selectedFee === "FREE"
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Free Public
            </button>
            <button
              type="button"
              onClick={() => setSelectedFee("PAID")}
              className={`rounded-md px-3 py-1.5 font-semibold transition-all ${
                selectedFee === "PAID"
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Commercial (Fee)
            </button>
          </div>
        </div>

        {/* 1-Click Department Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-border/50">
          <span className="text-xs font-semibold text-muted-foreground mr-1">
            Department:
          </span>
          {DEPARTMENT_FILTERS.map((dept) => {
            const isSelected = selectedDept === dept.id;
            return (
              <button
                key={dept.id}
                type="button"
                onClick={() => setSelectedDept(dept.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-[#0284c7] text-white shadow-sm font-semibold dark:bg-[#0284c7]"
                    : "border border-border/70 bg-card text-muted-foreground hover:border-slate-400 hover:text-foreground dark:bg-slate-900/40"
                }`}
              >
                {dept.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          Showing <strong className="text-foreground">{filtered.length}</strong>{" "}
          of {categories.length} civic services
        </span>
        {(search || selectedDept !== "ALL" || selectedFee !== "ALL") && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs font-semibold text-[#0284c7] hover:underline dark:text-[#38bdf8]"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Services Grid or Empty State */}
      {isLoading ? (
        <ServiceCatalogLoading />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center bg-card/40 dark:bg-[#0c1427]/40">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Tag className="size-6" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">
            No matching service categories found
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
            No civic services match your current query or department filters.
            Try adjusting keywords or reset filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="mt-4 text-xs"
          >
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((service) => {
            const respHours =
              service.slaPolicy?.responseWithinHours ??
              service.slaPolicy?.responseHours ??
              24;
            const resHours =
              service.slaPolicy?.resolutionWithinHours ??
              service.slaPolicy?.resolutionHours ??
              48;

            return (
              <Card
                key={service.id}
                className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200/90 bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0284c7]/50 hover:shadow-md dark:border-slate-800/80 dark:bg-[#0c1427]"
              >
                <div>
                  {/* Top Bar: Dept Icon, Code, Fee Badge */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-950/60">
                        {getDepartmentIcon(service.department?.code)}
                      </div>
                      <span className="font-mono text-xs font-bold text-[#0284c7] dark:text-[#38bdf8]">
                        {service.code ?? "SVC"}
                      </span>
                    </div>

                    {service.paymentRequired ? (
                      <Badge
                        variant="warning"
                        className="font-bold text-[10px] tracking-wider uppercase"
                      >
                        {service.currency ?? "BDT"} {service.defaultFeeAmount}{" "}
                        FEE
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] tracking-wider uppercase"
                      >
                        FREE SERVICE
                      </Badge>
                    )}
                  </div>

                  {/* Service Title & Department */}
                  <div className="mt-4 space-y-1">
                    <CardTitle className="text-base font-bold text-foreground leading-snug group-hover:text-[#0284c7] dark:group-hover:text-[#38bdf8] transition-colors">
                      {service.name}
                    </CardTitle>
                    {service.department && (
                      <p className="text-[11px] font-medium text-muted-foreground">
                        {service.department.name}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {service.description ??
                      "Official municipal service category for citizen grievance filing."}
                  </p>

                  {/* SLA Benchmarks Strip */}
                  <div className="mt-4 space-y-2 rounded-xl bg-muted/40 p-3 text-xs dark:bg-slate-900/60">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="size-3 text-muted-foreground" />
                        First Response SLA:
                      </span>
                      <span className="font-semibold text-foreground">
                        Within {respHours} hrs
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                        <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
                        Target Resolution:
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        Within {resHours} hrs
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-5 pt-4 border-t border-border/50">
                  <Link
                    href={`/dashboard/submit-request?categoryId=${service.id}`}
                    className="w-full block"
                  >
                    <Button
                      size="sm"
                      className="w-full gap-1.5 rounded-xl bg-[#0284c7] font-semibold text-white shadow-sm hover:bg-[#0369a1] dark:bg-[#0284c7] dark:hover:bg-[#0369a1]"
                    >
                      <span>Report This Issue</span>
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ServiceCatalogLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="space-y-4 rounded-2xl border border-slate-200/90 bg-card p-6 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <Skeleton className="h-5 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <div className="rounded-xl bg-muted/40 p-3 space-y-2">
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-full rounded" />
          </div>
          <Skeleton className="h-9 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}
