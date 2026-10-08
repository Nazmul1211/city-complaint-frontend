"use client";

import { ArrowRight, Clock, Search, ShieldCheck, Tag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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

export function ServiceCatalog() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetCategories();

  const fetchedCategories =
    data?.data && data.data.length > 0 ? data.data : null;
  const categories = fetchedCategories ?? FALLBACK_SERVICES;

  const filtered = categories.filter((cat) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      cat.name.toLowerCase().includes(q) ||
      cat.code?.toLowerCase().includes(q) ||
      cat.description?.toLowerCase().includes(q) ||
      cat.department?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by civic issue name, code, or keyword..."
          className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
        />
      </div>

      {isLoading ? (
        <ServiceCatalogLoading />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Tag className="size-6" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">
            No service categories found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            No civic services match your search query "{search}". Try searching
            by another keyword.
          </p>
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
                className="flex h-full flex-col justify-between border bg-card"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-primary">
                      {service.code ?? "SVC"}
                    </span>
                    {service.paymentRequired ? (
                      <Badge variant="warning">
                        {service.currency ?? "BDT"} {service.defaultFeeAmount}{" "}
                        FEE
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-emerald-600 dark:text-emerald-400"
                      >
                        FREE PUBLIC SERVICE
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="mt-2 text-base font-semibold text-foreground">
                    {service.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 pb-3 text-xs text-muted-foreground">
                  <p className="line-clamp-2 leading-relaxed">
                    {service.description ??
                      "Municipal service category for citizen reporting."}
                  </p>

                  <div className="space-y-2 border-t pt-3">
                    {service.department && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Department:
                        </span>
                        <span className="font-medium text-foreground">
                          {service.department.name}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="size-3 text-muted-foreground" />
                        First Response SLA:
                      </span>
                      <span className="font-medium text-foreground">
                        Within {respHours} hrs
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
                        Resolution SLA:
                      </span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        Within {resHours} hrs
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-t pt-3">
                  <Link
                    href={`/dashboard/submit-request?categoryId=${service.id}`}
                    className="w-full"
                  >
                    <Button size="sm" className="w-full gap-1.5">
                      Report This Issue
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </Link>
                </CardFooter>
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
        <div key={item} className="space-y-3 rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <div className="border-t pt-3 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
          </div>
          <div className="border-t pt-3">
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
