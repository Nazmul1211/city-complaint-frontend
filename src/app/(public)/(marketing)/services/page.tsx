import type { Metadata } from "next";
import { ServiceCatalog } from "@/components/modules/services";

export const metadata: Metadata = {
  title: "Municipal Services & Complaints | CityCare Citizen Platform",
  description:
    "Directory of municipal public services, complaint categories, official SLA turnaround response limits, and fee schedules.",
};

export default function ServicesPage() {
  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            City Services & Complaint Catalog
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Browse all official civic service categories, check legal SLA
            turnaround windows, and file complaints directly to responsible
            departments.
          </p>
        </div>

        <ServiceCatalog />
      </div>
    </div>
  );
}
