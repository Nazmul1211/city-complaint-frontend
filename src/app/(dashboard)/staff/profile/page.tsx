"use client";

import {
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  HardHat,
  KeyRound,
  Mail,
  Phone,
  Save,
  Shield,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AvatarUpload,
  ChangePasswordModal,
} from "@/components/modules/profile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import {
  useGetAllRequests,
  useGetDepartments,
  useGetMe,
  useUpdateProfile,
} from "@/hooks";
import type { DepartmentMembership, User } from "@/types";

export default function StaffProfilePage() {
  const { data: meData, isLoading: isMeLoading } = useGetMe();
  const { data: deptsData } = useGetDepartments();
  const { data: requestsData } = useGetAllRequests({ limit: 100 });
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const rawUser = meData?.data;
  const departments = deptsData?.data ?? [];
  const allRequests = requestsData?.data ?? [];

  const user: User | undefined = rawUser as User | undefined;

  // Local form state for editable fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Update local state when user data finishes loading
  useMemo(() => {
    if (rawUser?.name) setName(rawUser.name);
    if (rawUser?.phone) setPhone(rawUser.phone);
  }, [rawUser]);

  // Determine assigned department name and position
  const departmentInfo = useMemo(() => {
    const userWithMemberships = rawUser as User | undefined;
    if (
      userWithMemberships?.departmentMemberships &&
      userWithMemberships.departmentMemberships.length > 0
    ) {
      const active = userWithMemberships.departmentMemberships.find(
        (m: DepartmentMembership) => m.isActive,
      );
      if (active) {
        return {
          name: active.department?.name || "Municipal Operations",
          code: active.department?.code || "MO",
          position: active.position || "FIELD_TECHNICIAN",
        };
      }
    }

    const firstDept = departments[0];
    return {
      name: firstDept?.name || "Municipal Operations",
      code: firstDept?.code || "MO",
      position: "FIELD_TECHNICIAN",
    };
  }, [departments, rawUser]);

  // Casework workload statistics for this staff member
  const myCasework = useMemo(() => {
    if (!user?.id) {
      return { total: 0, resolved: 0, inProgress: 0 };
    }

    const assigned = allRequests.filter(
      (r) =>
        r.assignedTechnicianId === user.id ||
        r.assignments?.some((a) => a.assigneeId === user.id && !a.releasedAt),
    );

    const resolved = assigned.filter(
      (r) => r.status === "RESOLVED" || r.status === "CLOSED",
    );

    const inProgress = assigned.filter(
      (r) => r.status === "IN_PROGRESS" || r.status === "ASSIGNED",
    );

    return {
      total: assigned.length,
      resolved: resolved.length,
      inProgress: inProgress.length,
    };
  }, [allRequests, user?.id]);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.add({
      title: "Copied Staff ID",
      description: "Staff UUID copied to clipboard.",
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.add({
        title: "Validation Error",
        description: "Staff name cannot be empty.",
      });
      return;
    }

    updateProfile({
      name: name.trim(),
      phone: phone.trim() || undefined,
    });
  };

  if (isMeLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2 border-b pb-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-96 rounded-xl lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-card space-y-4">
        <HardHat className="size-10 text-muted-foreground" />
        <h2 className="text-lg font-bold">Staff Profile Unavailable</h2>
        <p className="text-xs text-muted-foreground max-w-sm">
          Please sign in with a verified technician or staff account.
        </p>
        <Link href="/login">
          <Button size="sm">Go to Login</Button>
        </Link>
      </div>
    );
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "September 2026";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link
              href="/staff"
              className="hover:text-foreground transition-colors"
            >
              Staff Dashboard
            </Link>
            <span>/</span>
            <span className="font-medium text-foreground">Staff Profile</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Field Staff Profile & Settings
            </h1>
            <Badge variant="warning" className="font-mono text-xs px-2 py-0.5">
              <HardHat className="size-3 mr-1" />
              {departmentInfo.position}
            </Badge>
            <Badge variant="success" className="text-[11px]">
              VERIFIED MUNICIPAL OFFICER
            </Badge>
          </div>

          <p className="mt-1 text-xs text-muted-foreground sm:text-sm max-w-2xl">
            Manage your field contact details, public credentials, avatar, and
            security passwords.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/staff/department">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-9">
              <Building2 className="size-3.5" />
              <span>My Department</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (1 Col): Avatar Upload & Credentials */}
        <div className="space-y-6">
          {/* Avatar Upload Card */}
          <Card className="border bg-card">
            <CardHeader className="pb-3 text-center border-b">
              <CardTitle className="text-sm font-bold text-foreground">
                Staff Identity Photo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <AvatarUpload
                currentAvatarUrl={user.avatarUrl}
                name={user.name}
                role={user.role}
              />
              <p className="mt-3 text-[11px] text-center text-muted-foreground">
                Visible to citizens and supervisors on assigned ticket work
                updates.
              </p>
            </CardContent>
          </Card>

          {/* Official Municipal Credentials Card */}
          <Card className="border bg-card">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <Shield className="size-4 text-primary" />
                Staff Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3.5 text-xs">
              <div>
                <span className="text-muted-foreground">
                  Official Staff ID:
                </span>
                <div className="flex items-center justify-between mt-1 rounded-md bg-muted/50 p-2 font-mono text-[11px] text-foreground">
                  <span className="truncate max-w-[190px]">{user.id}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyId(user.id)}
                    className="text-muted-foreground hover:text-foreground ml-1"
                    title="Copy Staff ID"
                  >
                    <Copy className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="border-t pt-2.5 flex items-center justify-between">
                <span className="text-muted-foreground">Department:</span>
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <Building2 className="size-3 text-muted-foreground" />
                  {departmentInfo.name}
                </span>
              </div>

              <div className="border-t pt-2.5 flex items-center justify-between">
                <span className="text-muted-foreground">Position Role:</span>
                <Badge
                  variant="warning"
                  className="font-mono text-[10px] uppercase"
                >
                  {departmentInfo.position}
                </Badge>
              </div>

              <div className="border-t pt-2.5 flex items-center justify-between">
                <span className="text-muted-foreground">Account Status:</span>
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {user.status || "ACTIVE"}
                </span>
              </div>

              <div className="border-t pt-2.5 flex items-center justify-between">
                <span className="text-muted-foreground">Registered:</span>
                <span className="font-medium text-foreground flex items-center gap-1">
                  <Calendar className="size-3 text-muted-foreground" />
                  {memberSince}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Security & Credentials Card */}
          <Card className="border bg-card">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                Security & Password
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Staff authentication tokens and dispatch credentials are
                encrypted. You can rotate your password at any time.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setChangePasswordOpen(true)}
                className="w-full gap-1.5 text-xs h-8"
              >
                <KeyRound className="size-3.5" />
                <span>Change Account Password</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (2 Cols): Profile Form & Field Workload */}
        <div className="space-y-6 lg:col-span-2">
          {/* Personal Information Form Card */}
          <Card className="border bg-card">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <UserIcon className="size-4 text-primary" />
                Officer Contact & Dispatch Information
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Ensure your contact telephone is up to date so municipal
                dispatchers and citizens can reach you for on-site inspections.
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <FieldGroup>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Full Name */}
                    <Field>
                      <FieldLabel
                        htmlFor="staff-name"
                        className="text-xs font-semibold"
                      >
                        Full Name <span className="text-destructive">*</span>
                      </FieldLabel>
                      <div className="relative mt-1">
                        <Input
                          id="staff-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Rakibul Karim"
                          className="pl-9 text-xs"
                          required
                        />
                        <UserIcon className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
                      </div>
                    </Field>

                    {/* Official Email (Read-Only) */}
                    <Field>
                      <FieldLabel
                        htmlFor="staff-email"
                        className="text-xs font-semibold"
                      >
                        Official Municipal Email
                      </FieldLabel>
                      <div className="relative mt-1">
                        <Input
                          id="staff-email"
                          value={user.email}
                          disabled
                          className="pl-9 text-xs bg-muted/50 cursor-not-allowed"
                        />
                        <Mail className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Official staff email is managed by your municipal
                        administrator.
                      </p>
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                    {/* Contact Phone */}
                    <Field>
                      <FieldLabel
                        htmlFor="staff-phone"
                        className="text-xs font-semibold"
                      >
                        Contact Phone / Mobile
                      </FieldLabel>
                      <div className="relative mt-1">
                        <Input
                          id="staff-phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 01712345678"
                          className="pl-9 text-xs font-mono"
                        />
                        <Phone className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Used for urgent field dispatches and escalation alerts.
                      </p>
                    </Field>

                    {/* Assigned Department (Read-Only) */}
                    <Field>
                      <FieldLabel className="text-xs font-semibold">
                        Assigned Municipal Jurisdiction
                      </FieldLabel>
                      <div className="relative mt-1">
                        <Input
                          value={`${departmentInfo.name} (${departmentInfo.code})`}
                          disabled
                          className="pl-9 text-xs bg-muted/50 cursor-not-allowed font-medium"
                        />
                        <Building2 className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
                      </div>
                    </Field>
                  </div>
                </FieldGroup>

                <div className="pt-3 border-t flex justify-end">
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="gap-2 text-xs h-9 font-medium"
                  >
                    {isUpdating ? (
                      <>
                        <Spinner className="size-3.5" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="size-3.5" />
                        <span>Save Profile Changes</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Field Casework Summary Card */}
          <Card className="border bg-card">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <Briefcase className="size-4 text-primary" />
                    Field Workload & Performance Overview
                  </CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Complaints assigned, inspected, and photo-verified under
                    your officer credentials.
                  </p>
                </div>
                <Link href="/staff/assigned">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-xs h-8"
                  >
                    <span>View All</span>
                    <ArrowRight className="size-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border bg-muted/20 p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Total Assigned</span>
                    <Clock className="size-3.5 text-primary" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-foreground">
                    {myCasework.total}
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Complaints in caseload
                  </p>
                </div>

                <div className="rounded-lg border bg-muted/20 p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Active Queued</span>
                    <Clock className="size-3.5 text-amber-500" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {myCasework.inProgress}
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Awaiting resolution
                  </p>
                </div>

                <div className="rounded-lg border bg-muted/20 p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Resolved & Verified</span>
                    <CheckCircle2 className="size-3.5 text-emerald-500" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {myCasework.resolved}
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Closed with photo proof
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t flex flex-wrap gap-3">
                <Link
                  href="/staff/assigned"
                  className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
                >
                  <span>Go to Assigned Complaints Queue</span>
                  <ExternalLink className="size-3" />
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link
                  href="/staff/department"
                  className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
                >
                  <span>Check Department Roster</span>
                  <ExternalLink className="size-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
        userEmail={user.email}
      />
    </div>
  );
}
