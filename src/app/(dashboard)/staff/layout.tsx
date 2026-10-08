import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default function StaffDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleGuard roles={["STAFF"]}>
      <DashboardShell userRole="STAFF">{children}</DashboardShell>
    </RoleGuard>
  );
}
