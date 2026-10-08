"use client";

import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileText,
  KeyRound,
  Shield,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { ProfileForm } from "@/components/form";
import {
  AvatarUpload,
  DeleteAccountDialog,
} from "@/components/modules/profile";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { useGetMe } from "@/hooks";
import type { User } from "@/types";

export default function CitizenProfilePage() {
  const { data, isLoading } = useGetMe();
  const user = data?.data;

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.add({
      title: "Copied Account ID",
      description: "Citizen ID copied to clipboard.",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
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

  // Fallback demo citizen if not populated
  const fallbackUser: User = {
    id: "citizen-demo-1",
    name: "Tanvir Ahmed",
    email: "citizen@citycomplaint.gov",
    role: "CITIZEN",
    status: "ACTIVE",
    emailVerified: true,
    avatarUrl: null,
    avatarPublicId: null,
    phone: "01712345678",
    authProvider: "CREDENTIAL",
    isDeleted: false,
    deletedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    citizen: {
      id: "cit-1",
      userId: "citizen-demo-1",
      name: "Tanvir Ahmed",
      email: "citizen@citycomplaint.gov",
      contactNumber: "01712345678",
      address: "House 42, Road 7, Block C, Mirpur-10, Dhaka",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  const activeUser: User = user || fallbackUser;

  const contactNumber =
    activeUser.citizen?.contactNumber || activeUser.phone || "";
  const address = activeUser.citizen?.address || "";

  const memberSince = activeUser.createdAt
    ? new Date(activeUser.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "January 2026";

  const lastUpdated = activeUser.updatedAt
    ? new Date(activeUser.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link
              href="/dashboard"
              className="hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <span>/</span>
            <span className="font-medium text-foreground">
              Profile & Account
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Citizen Profile & Settings
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your verified civic identity, contact information for field
            inspectors, and account credentials.
          </p>
        </div>

        {/* Verification Status Badge */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            <span>Verified Citizen Account</span>
          </div>
        </div>
      </div>

      {/* Main Responsive Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (1 Col): Avatar Upload & Identity Overview */}
        <div className="space-y-6">
          {/* Avatar Upload Card */}
          <div className="rounded-xl border bg-card p-6 shadow-xs">
            <h2 className="text-sm font-bold text-foreground mb-4 text-center">
              Profile Photo
            </h2>
            <AvatarUpload
              currentAvatarUrl={activeUser.avatarUrl}
              name={activeUser.name}
              role={activeUser.role}
            />
          </div>

          {/* Account Metadata & Civic Credentials */}
          <div className="rounded-xl border bg-card p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Shield className="size-4 text-primary" />
              Civic Account Details
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground">
                  Citizen Account ID:
                </span>
                <div className="flex items-center justify-between mt-1 rounded-md bg-muted/50 p-2 font-mono text-[11px] text-foreground">
                  <span className="truncate max-w-[180px]">
                    {activeUser.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyId(activeUser.id)}
                    className="text-muted-foreground hover:text-foreground ml-1"
                    title="Copy Citizen ID"
                  >
                    <Copy className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-2.5">
                <span className="text-muted-foreground">Account Status:</span>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 font-semibold text-emerald-700 dark:text-emerald-400 uppercase text-[10px]">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  {activeUser.status || "ACTIVE"}
                </span>
              </div>

              <div className="flex items-center justify-between border-t pt-2.5">
                <span className="text-muted-foreground">Registered Date:</span>
                <span className="font-medium text-foreground flex items-center gap-1">
                  <Calendar className="size-3 text-muted-foreground" />
                  {memberSince}
                </span>
              </div>

              <div className="flex items-center justify-between border-t pt-2.5">
                <span className="text-muted-foreground">
                  Last Profile Update:
                </span>
                <span className="font-medium text-foreground">
                  {lastUpdated}
                </span>
              </div>
            </div>
          </div>

          {/* Security & Access Management Card */}
          <div className="rounded-xl border bg-card p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-primary" />
              Security & Credentials
            </h2>
            <p className="text-xs text-muted-foreground">
              Sign-in credentials are encrypted and managed via secure JSON Web
              Tokens.
            </p>

            <div className="pt-2">
              <Link href="/forgot-password">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-1.5 text-xs h-8"
                >
                  <KeyRound className="size-3.5" />
                  Change Password / Reset
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (2 Cols): Profile Form, Civic Activity, Danger Zone */}
        <div className="space-y-6 lg:col-span-2">
          {/* Personal Details Form Card */}
          <div className="rounded-xl border bg-card p-6 shadow-xs space-y-5">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <UserIcon className="size-4 text-primary" />
                Personal & Contact Information
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Update your contact phone and address so city engineers and
                dispatchers can reach you regarding reported civic complaints.
              </p>
            </div>

            <ProfileForm
              initialData={{
                name: activeUser.name,
                email: activeUser.email,
                role: activeUser.role,
                contactNumber,
                address,
                emailVerified: activeUser.emailVerified,
              }}
            />
          </div>

          {/* Civic Services & Quick Links Card */}
          <div className="rounded-xl border bg-card p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Building2 className="size-4 text-primary" />
              Municipal Civic Activity
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              As an authenticated citizen, you have full access to municipal
              reporting, real-time ticket progress updates, and SLA tracking
              across Dhaka city wards.
            </p>

            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
              <Link
                href="/dashboard/requests"
                className="flex items-center justify-between rounded-lg border bg-muted/30 p-3 text-xs transition-colors hover:bg-muted"
              >
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">
                      My Complaints
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      View submitted tickets
                    </p>
                  </div>
                </div>
                <ExternalLink className="size-3.5 text-muted-foreground" />
              </Link>

              <Link
                href="/dashboard/submit-request"
                className="flex items-center justify-between rounded-lg border bg-muted/30 p-3 text-xs transition-colors hover:bg-muted"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">
                      File New Complaint
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Report civic road or sanitation issue
                    </p>
                  </div>
                </div>
                <ExternalLink className="size-3.5 text-muted-foreground" />
              </Link>
            </div>
          </div>

          {/* Danger Zone: Account Deletion */}
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-destructive flex items-center gap-1.5">
                  <AlertCircle className="size-4" />
                  Danger Zone
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Once deleted, your citizen account and active session
                  credentials will be permanently closed.
                </p>
              </div>

              <div className="shrink-0">
                <DeleteAccountDialog />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
