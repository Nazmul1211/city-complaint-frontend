"use client";

import {
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  HardHat,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Shield,
  ShieldAlert,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAllRequests,
  useGetCategories,
  useGetDepartmentById,
  useGetDepartmentMembers,
  useGetDepartments,
  useGetMe,
} from "@/hooks";
import type { DepartmentMemberInfo, DepartmentMembership, User } from "@/types";

export default function StaffDepartmentPage() {
  const { data: meData, isLoading: isMeLoading } = useGetMe();
  const {
    data: deptsData,
    isLoading: isDeptsLoading,
    refetch: refetchDepts,
    isRefetching: isDeptsRefetching,
  } = useGetDepartments();

  const user = meData?.data;
  const departments = deptsData?.data ?? [];

  // Determine the staff user's assigned department ID
  // Check membership in user payload or match membership across departments
  const defaultDepartmentId = useMemo(() => {
    if (!departments.length) return "";

    // 1. Check user.departmentMemberships if present
    const userWithMemberships = user as User | undefined;
    if (
      userWithMemberships?.departmentMemberships &&
      userWithMemberships.departmentMemberships.length > 0
    ) {
      const activeMembership = userWithMemberships.departmentMemberships.find(
        (m: DepartmentMembership) => m.isActive,
      );
      if (activeMembership?.departmentId) {
        return activeMembership.departmentId;
      }
    }

    // 2. Default to Road & Infrastructure (RD) or first department
    const roadDept = departments.find(
      (d) => d.code === "RD" || d.name.toLowerCase().includes("road"),
    );
    return roadDept?.id || departments[0]?.id || "";
  }, [departments, user]);

  const [selectedDeptId, setSelectedDeptId] = useState<string>("");
  const activeDeptId = selectedDeptId || defaultDepartmentId;

  // Fetch full details of the active department
  const {
    data: deptDetailsData,
    isLoading: isDeptLoading,
    refetch: refetchDeptDetails,
  } = useGetDepartmentById(activeDeptId);

  // Fetch verified members roster for this department
  const {
    data: membersData,
    isLoading: isMembersLoading,
    refetch: refetchMembers,
  } = useGetDepartmentMembers(activeDeptId);

  // Fetch categories associated with this department
  const { data: categoriesData } = useGetCategories(activeDeptId);

  // Fetch requests for caseload calculations
  const { data: requestsData } = useGetAllRequests({
    limit: 100,
  });

  const department = deptDetailsData?.data;
  const members = (membersData?.data ?? department?.members ?? []) as DepartmentMemberInfo[];
  const categories = categoriesData?.data ?? [];
  const allRequests = requestsData?.data ?? [];

  // Filter requests for the current department
  const departmentRequests = allRequests.filter(
    (r) => r.currentDepartmentId === activeDeptId,
  );

  const activeCaseload = departmentRequests.filter(
    (r) => r.status !== "RESOLVED" && r.status !== "CLOSED",
  );

  const urgentCaseload = departmentRequests.filter(
    (r) =>
      (r.priority === "URGENT" || r.priority === "HIGH") &&
      r.status !== "RESOLVED" &&
      r.status !== "CLOSED",
  );

  const resolvedCaseload = departmentRequests.filter(
    (r) => r.status === "RESOLVED" || r.status === "CLOSED",
  );

  // Find current user's membership in this department
  const myMembership = useMemo(() => {
    if (!user || !members.length) return null;
    return members.find(
      (m) =>
        m.user?.id === user.id ||
        m.userId === user.id ||
        m.user?.email === user.email,
    );
  }, [user, members]);

  const handleRefreshAll = () => {
    refetchDepts();
    if (activeDeptId) {
      refetchDeptDetails();
      refetchMembers();
    }
  };

  if (isMeLoading || (isDeptsLoading && !departments.length)) {
    return (
      <div className="space-y-6">
        <div className="space-y-2 border-b pb-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`skel-card-${i + 1}`} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link
              href="/staff"
              className="hover:text-foreground transition-colors"
            >
              Staff Dashboard
            </Link>
            <span>/</span>
            <span className="font-medium text-foreground">My Department</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {department?.name || "Municipal Department"}
            </h1>
            {department?.code && (
              <Badge variant="outline" className="font-mono text-xs px-2 py-0.5">
                CODE: {department.code}
              </Badge>
            )}
            <Badge
              variant={department?.isActive !== false ? "success" : "secondary"}
              className="text-[11px]"
            >
              {department?.isActive !== false ? "ACTIVE JURISDICTION" : "INACTIVE"}
            </Badge>
          </div>

          <p className="mt-1 text-xs text-muted-foreground sm:text-sm max-w-2xl">
            {department?.description ||
              "Departmental jurisdiction, active field personnel, category workflows, and assigned casework backlog."}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Department Quick Switcher if multiple municipal departments exist */}
          {departments.length > 1 && (
            <select
              value={activeDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              aria-label="Select Municipal Department"
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs font-medium shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isDeptsRefetching || isDeptLoading}
            className="h-9 gap-1.5 text-xs"
          >
            <RefreshCw
              className={`size-3.5 ${
                isDeptsRefetching || isDeptLoading ? "animate-spin" : ""
              }`}
            />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Staff Position Spotlight Banner */}
      <Card className="border-primary/20 bg-linear-to-r from-primary/5 via-background to-muted/20">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                <HardHat className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-foreground">
                    {user?.name || "Field Officer"}
                  </h2>
                  <Badge variant="warning" className="font-mono text-[10px] uppercase">
                    {myMembership?.position || "TECHNICIAN"}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="size-3" />
                    Verified On-Duty
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Assigned to{" "}
                  <strong className="text-foreground">
                    {department?.name || "Municipal Service"}
                  </strong>{" "}
                  • Authorized for ticket dispatch, field work logs & SLA updates.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:self-center">
              <Link href="/staff/assigned">
                <Button size="sm" className="gap-1.5 text-xs h-8">
                  <span>My Assigned Casework</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operational Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border bg-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Department Caseload
              </span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="size-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {departmentRequests.length}
              </span>
              <span className="text-xs text-muted-foreground">tickets total</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Across all assigned municipal categories
            </p>
          </CardContent>
        </Card>

        <Card className="border bg-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Active Field Queue
              </span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Clock className="size-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {activeCaseload.length}
              </span>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                in progress / assigned
              </span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Awaiting technician verification
            </p>
          </CardContent>
        </Card>

        <Card className="border bg-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                High / Urgent Priority
              </span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <ShieldAlert className="size-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400 sm:text-3xl">
                {urgentCaseload.length}
              </span>
              <span className="text-xs text-muted-foreground">urgent cases</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Requiring accelerated 24h triage
            </p>
          </CardContent>
        </Card>

        <Card className="border bg-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Active Field Force
              </span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Users className="size-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {members.length}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                officers & techs
              </span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Registered in this jurisdiction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2 Cols): Department Team Roster */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="border bg-card">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <Users className="size-4 text-primary" />
                    Department Team Roster & Field Staff
                  </CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Technicians, case officers, and dispatch supervisors registered in {department?.name}.
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {members.length} Members
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isMembersLoading ? (
                <div className="p-6 space-y-3">
                  <Skeleton className="h-12 w-full rounded-md" />
                  <Skeleton className="h-12 w-full rounded-md" />
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
              ) : members.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="mx-auto size-8 text-muted-foreground/60" />
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    No Members Registered
                  </p>
                  <p className="text-xs text-muted-foreground">
                    No active staff personnel have been assigned to this department yet.
                  </p>
                </div>
              ) : (
                <div className="divide-y text-xs">
                  {members.map((member) => {
                    const isCurrentUser =
                      member.user?.id === user?.id ||
                      member.userId === user?.id ||
                      member.user?.email === user?.email;

                    return (
                      <div
                        key={member.id}
                        className={`flex items-center justify-between p-4 transition-colors ${
                          isCurrentUser
                            ? "bg-primary/5 hover:bg-primary/10"
                            : "hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex size-9 items-center justify-center rounded-full bg-muted font-semibold text-xs text-foreground uppercase border shrink-0">
                            {member.user?.name
                              ? member.user.name.charAt(0)
                              : "S"}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground truncate">
                                {member.user?.name || "Staff Member"}
                              </span>
                              {isCurrentUser && (
                                <Badge
                                  variant="default"
                                  className="text-[10px] px-1.5 py-0"
                                >
                                  You
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground text-[11px] truncate flex items-center gap-1.5 mt-0.5">
                              <Mail className="size-3 shrink-0" />
                              {member.user?.email || "No email"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <Badge
                            variant={
                              member.position === "MANAGER"
                                ? "destructive"
                                : member.position === "CASE_OFFICER"
                                ? "default"
                                : "warning"
                            }
                            className="font-mono text-[10px] uppercase"
                          >
                            {member.position}
                          </Badge>

                          <div className="hidden sm:flex flex-col items-end text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="size-3" />
                              {member.joinedAt
                                ? new Date(member.joinedAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )
                                : "Active"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Department Categories & Workflows */}
          <Card className="border bg-card">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <Briefcase className="size-4 text-primary" />
                    Civic Service Categories Managed
                  </CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Public complaint categories routed to this department for inspection and remediation.
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {categories.length} Categories
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {categories.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  No public service categories configured for this department.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="rounded-lg border bg-muted/20 p-3.5 space-y-2 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-xs text-foreground">
                          {cat.name}
                        </span>
                        <Badge
                          variant={cat.paymentRequired ? "warning" : "success"}
                          className="text-[10px]"
                        >
                          {cat.paymentRequired ? "Fee Required" : "Free Service"}
                        </Badge>
                      </div>

                      {cat.description && (
                        <p className="text-[11px] text-muted-foreground line-clamp-2">
                          {cat.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t text-[10px] text-muted-foreground">
                        <span>Target SLA:</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                          {cat.slaPolicy?.resolutionHours
                            ? `Within ${cat.slaPolicy.resolutionHours} hrs`
                            : "Standard 24-48 hrs"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col): Department Meta & Emergency Dispatch Info */}
        <div className="space-y-6">
          {/* Official Department Credentials */}
          <Card className="border bg-card">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <Building2 className="size-4 text-primary" />
                Department Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3.5 text-xs">
              <div>
                <span className="text-muted-foreground">Official Name:</span>
                <p className="font-semibold text-foreground mt-0.5">
                  {department?.name}
                </p>
              </div>

              <div className="border-t pt-2.5">
                <span className="text-muted-foreground">Department Code:</span>
                <p className="font-mono font-semibold text-primary mt-0.5">
                  {department?.code}
                </p>
              </div>

              <div className="border-t pt-2.5">
                <span className="text-muted-foreground">Department UUID:</span>
                <p className="font-mono text-[11px] text-muted-foreground truncate bg-muted/50 p-1.5 rounded mt-0.5">
                  {department?.id}
                </p>
              </div>

              <div className="border-t pt-2.5">
                <span className="text-muted-foreground">Operational Status:</span>
                <div className="flex items-center gap-1.5 mt-0.5 font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active 24/7 Dispatch Center
                </div>
              </div>

              <div className="border-t pt-2.5">
                <span className="text-muted-foreground">Established / Recorded:</span>
                <p className="font-medium text-foreground mt-0.5">
                  {department?.createdAt
                    ? new Date(department.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "September 2026"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Rapid Casework Actions */}
          <Card className="border bg-card">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <Shield className="size-4 text-primary" />
                Casework Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              <Link
                href="/staff/assigned"
                className="flex items-center justify-between rounded-lg border bg-muted/20 p-3 text-xs transition-colors hover:bg-muted"
              >
                <div>
                  <p className="font-semibold text-foreground">
                    Assigned Complaints
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Triage & perform field work updates
                  </p>
                </div>
                <ExternalLink className="size-3.5 text-muted-foreground" />
              </Link>

              <Link
                href="/staff"
                className="flex items-center justify-between rounded-lg border bg-muted/20 p-3 text-xs transition-colors hover:bg-muted"
              >
                <div>
                  <p className="font-semibold text-foreground">
                    Workload Overview
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Monitor SLA burn rates & statistics
                  </p>
                </div>
                <ExternalLink className="size-3.5 text-muted-foreground" />
              </Link>

              <Link
                href="/staff/profile"
                className="flex items-center justify-between rounded-lg border bg-muted/20 p-3 text-xs transition-colors hover:bg-muted"
              >
                <div>
                  <p className="font-semibold text-foreground">
                    Staff Profile & Settings
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Update phone, photo & credentials
                  </p>
                </div>
                <ExternalLink className="size-3.5 text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>

          {/* Municipal Emergency Hotline */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs space-y-2">
            <h3 className="font-bold text-foreground flex items-center gap-1.5">
              <Phone className="size-3.5 text-primary" />
              Internal Dispatch Hotline
            </h3>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              For urgent structural hazards, main line bursts, or inter-department escalations, contact the Municipal Emergency Control Room directly.
            </p>
            <div className="font-mono font-semibold text-primary text-xs pt-1">
              Control Room: Dial 333 (Ext. 402)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
