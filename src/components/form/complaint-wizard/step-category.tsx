"use client";

import { Check, Clock, Search, ShieldCheck, Tag } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCategories } from "@/hooks";
import type { Category } from "@/types";

const FALLBACK_CATEGORIES: Category[] = [
  {
    id: "cat-pothole",
    departmentId: "dept-pwd",
    name: "Road Pothole & Asphalt Damage",
    code: "PWD-POT",
    description:
      "Deep craters, missing manhole lids, uneven street surfaces, and broken curb stones.",
    paymentRequired: false,
    isActive: true,
    department: {
      id: "dept-pwd",
      name: "Public Works & Road Maintenance",
      code: "PWD",
      isActive: true,
    },
    slaPolicy: {
      id: "sla-pothole",
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
      "Burst municipal supply mains, low pressure, dirty tap water, or street flooding.",
    paymentRequired: false,
    isActive: true,
    department: {
      id: "dept-wasa",
      name: "Water Supply & Sewerage Authority",
      code: "WASA",
      isActive: true,
    },
    slaPolicy: {
      id: "sla-water",
      categoryId: "cat-water-leak",
      responseWithinHours: 6,
      resolutionWithinHours: 24,
    },
  },
  {
    id: "cat-waste-dump",
    departmentId: "dept-swm",
    name: "Overflowing Garbage & Illegal Dump",
    code: "SWM-DUMP",
    description:
      "Uncollected trash bins, roadside dumping heaps, animal remains, or toxic waste.",
    paymentRequired: false,
    isActive: true,
    department: {
      id: "dept-swm",
      name: "Solid Waste Management",
      code: "SWM",
      isActive: true,
    },
    slaPolicy: {
      id: "sla-waste",
      categoryId: "cat-waste-dump",
      responseWithinHours: 8,
      resolutionWithinHours: 16,
    },
  },
  {
    id: "cat-streetlight",
    departmentId: "dept-elec",
    name: "Streetlight Outage & Damaged Lamp",
    code: "ELEC-LGT",
    description:
      "Dark street segments, broken lamp bulbs, hanging live cables, or faulty timer switches.",
    paymentRequired: false,
    isActive: true,
    department: {
      id: "dept-elec",
      name: "Electrical & Street Lighting",
      code: "ELEC",
      isActive: true,
    },
    slaPolicy: {
      id: "sla-light",
      categoryId: "cat-streetlight",
      responseWithinHours: 12,
      resolutionWithinHours: 24,
    },
  },
  {
    id: "cat-drainage",
    departmentId: "dept-wasa",
    name: "Choked Storm Drain & Waterlogging",
    code: "WASA-DRN",
    description:
      "Monsoon street water stagnation, blocked sewer gratings, and overflowing ditches.",
    paymentRequired: false,
    isActive: true,
    department: {
      id: "dept-wasa",
      name: "Water Supply & Sewerage Authority",
      code: "WASA",
      isActive: true,
    },
    slaPolicy: {
      id: "sla-drainage",
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
      "Dengue vector control spray requests for open drains, wetlands, and schools.",
    paymentRequired: false,
    isActive: true,
    department: {
      id: "dept-hlth",
      name: "Public Health & Mosquito Vector Control",
      code: "HLTH",
      isActive: true,
    },
    slaPolicy: {
      id: "sla-fogging",
      categoryId: "cat-fogging",
      responseWithinHours: 24,
      resolutionWithinHours: 48,
    },
  },
];

interface StepCategoryProps {
  selectedCategoryId: string;
  onSelectCategory: (category: Category) => void;
}

export function StepCategory({
  selectedCategoryId,
  onSelectCategory,
}: StepCategoryProps) {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetCategories();

  const categories = useMemo(() => {
    if (data?.data && data.data.length > 0) {
      return data.data;
    }
    return FALLBACK_CATEGORIES;
  }, [data]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return categories;
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        cat.code?.toLowerCase().includes(q) ||
        cat.department?.name?.toLowerCase().includes(q) ||
        cat.description?.toLowerCase().includes(q),
    );
  }, [categories, search]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-foreground">
          Step 1: Select Complaint Category
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Choose the municipal issue type that best matches the problem. This
          determines the responsible city department and statutory SLA
          turnaround.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search category or issue keyword..."
          className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2 rounded-lg border p-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <Tag className="size-8 text-muted-foreground" />
          <p className="mt-2 text-xs font-semibold text-foreground">
            No matching category found
          </p>
          <p className="text-[11px] text-muted-foreground">
            Try a different search term or clear the filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            const respHours =
              cat.slaPolicy?.responseWithinHours ??
              cat.slaPolicy?.responseHours ??
              24;
            const resHours =
              cat.slaPolicy?.resolutionWithinHours ??
              cat.slaPolicy?.resolutionHours ??
              48;

            return (
              <Card
                key={cat.id}
                onClick={() => onSelectCategory(cat)}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                    : "border-border bg-card hover:border-foreground/20 hover:bg-muted/30"
                }`}
              >
                <CardContent className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[11px] font-semibold text-primary">
                      {cat.code ?? "CAT"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {cat.paymentRequired ? (
                        <Badge variant="warning" className="text-[10px]">
                          Fee Applicable
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[10px] text-emerald-600 dark:text-emerald-400"
                        >
                          Free Public Service
                        </Badge>
                      )}
                      {isSelected && (
                        <div className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="size-2.5" />
                        </div>
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold text-foreground">
                    {cat.name}
                  </h4>

                  <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                    {cat.description ??
                      "Municipal category for citizen reports."}
                  </p>

                  <div className="border-t pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                    <span className="truncate max-w-[140px]">
                      {cat.department?.name ?? "Municipal Dept"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {respHours}h resp
                      </span>
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <ShieldCheck className="size-3" />
                        {resHours}h SLA
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
