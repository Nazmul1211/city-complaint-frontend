"use client";

import { Building2, Search } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDepartments } from "@/hooks";
import type { Department } from "@/types";
import { DepartmentCard } from "./department-card";

const FALLBACK_DEPARTMENTS: Department[] = [
  {
    id: "dept-pwd",
    name: "Public Works & Road Maintenance",
    code: "PWD",
    description:
      "Responsible for city roadway repairs, asphalt resurfacing, pedestrian sidewalks, and bridge maintenance.",
    contactEmail: "pwd@city.gov.bd",
    contactPhone: "+880 2-9568123",
    isActive: true,
    _count: { members: 18, categories: 4 },
  },
  {
    id: "dept-wasa",
    name: "Water Supply & Sewerage Authority",
    code: "WASA",
    description:
      "Overseeing municipal water line connections, storm drainage clearance, pipeline leak repair, and sewage control.",
    contactEmail: "water@city.gov.bd",
    contactPhone: "+880 2-9842134",
    isActive: true,
    _count: { members: 24, categories: 5 },
  },
  {
    id: "dept-swm",
    name: "Solid Waste Management",
    code: "SWM",
    description:
      "Managing residential garbage collection, street sweeping, dumpsters, recycling operations, and community sanitation.",
    contactEmail: "waste@city.gov.bd",
    contactPhone: "+880 2-8391204",
    isActive: true,
    _count: { members: 32, categories: 3 },
  },
  {
    id: "dept-elec",
    name: "Electrical & Street Lighting",
    code: "ELEC",
    description:
      "Maintaining municipal street lamps, public park illumination, signal lights, and high-voltage feeder line safety.",
    contactEmail: "lighting@city.gov.bd",
    contactPhone: "+880 2-9883412",
    isActive: true,
    _count: { members: 14, categories: 4 },
  },
  {
    id: "dept-hlth",
    name: "Public Health & Mosquito Vector Control",
    code: "HLTH",
    description:
      "Executing larvicide fogging, disease vector prevention, food safety inspections, and stray animal containment.",
    contactEmail: "health@city.gov.bd",
    contactPhone: "+880 2-7174921",
    isActive: true,
    _count: { members: 21, categories: 3 },
  },
  {
    id: "dept-prk",
    name: "Parks, Recreation & Urban Forestry",
    code: "PRK",
    description:
      "Maintaining municipal parks, playground equipment, hazardous tree pruning, and urban green zone development.",
    contactEmail: "parks@city.gov.bd",
    contactPhone: "+880 2-8839012",
    isActive: true,
    _count: { members: 11, categories: 2 },
  },
];

export function DepartmentList() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetDepartments();

  const fetchedDepartments =
    data?.data && data.data.length > 0 ? data.data : null;
  const departments = fetchedDepartments ?? FALLBACK_DEPARTMENTS;

  const filtered = departments.filter((dept) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      dept.name.toLowerCase().includes(q) ||
      dept.code.toLowerCase().includes(q) ||
      dept.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by department name, code, or service..."
          className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
        />
      </div>

      {isLoading ? (
        <DepartmentListLoading />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Building2 className="size-6" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">
            No departments found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            No municipal department matches your query "{search}". Try searching
            by another keyword or code.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((department) => (
            <DepartmentCard key={department.id} department={department} />
          ))}
        </div>
      )}
    </div>
  );
}

function DepartmentListLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="space-y-3 rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="size-10 rounded-md" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="border-t pt-3 space-y-2">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <div className="border-t pt-3 flex gap-2">
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
