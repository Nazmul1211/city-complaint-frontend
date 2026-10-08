import type { Metadata } from "next";
import { DepartmentList } from "@/components/modules/departments";

export const metadata: Metadata = {
  title: "Municipal Departments | CityCare Citizen Platform",
  description:
    "Directory of city municipal departments responsible for road maintenance, water, waste management, electrical lighting, and public health.",
};

export default function DepartmentsPage() {
  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Municipal Departments & Authorities
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Explore the responsible city agencies handling public
            infrastructure, utility repairs, and community cleanliness across
            all 54 municipal wards.
          </p>
        </div>

        <DepartmentList />
      </div>
    </div>
  );
}
