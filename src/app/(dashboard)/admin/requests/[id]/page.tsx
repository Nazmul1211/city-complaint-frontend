"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Banknote,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  MapPin,
  Navigation,
  Phone,
  Printer,
  RefreshCw,
  Share2,
  ShieldCheck,
  Star,
  User,
  UserCheck,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  AssignStaffModal,
  RouteDepartmentModal,
} from "@/components/modules/admin";
import { IssuePaymentModal } from "@/components/modules/payment";
import {
  AttachmentGallery,
  SlaCountdownBadge,
  TimelineStepper,
} from "@/components/modules/requests";
import {
  StaffWorkUpdateFeed,
  StatusUpdateDialog,
} from "@/components/modules/staff";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriorityBadge, StatusBadge } from "@/components/ui/status-badge";
import { toast } from "@/components/ui/toast";
import {
  useGetServiceRequestById,
  useRequestFeedback,
  useRequestTimeline,
  useRequestUpdates,
} from "@/hooks";
import type {
  Feedback,
  MediaAttachment,
  TimelineEvent,
  WorkUpdate,
} from "@/types";
import AdminRequestDetailsLoading from "./loading";

export default function AdminRequestDetailPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal dialog states
  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const rawId = params?.id;
  const requestId = Array.isArray(rawId) ? rawId[0] : (rawId as string) || "";

  // Queries
  const {
    data: fetchedRequest,
    isLoading: isRequestLoading,
    refetch: refetchRequest,
  } = useGetServiceRequestById(requestId);

  const { data: fetchedTimeline, refetch: refetchTimeline } =
    useRequestTimeline(requestId);

  const { data: fetchedUpdates, refetch: refetchUpdates } =
    useRequestUpdates(requestId);

  const { data: fetchedFeedback, refetch: refetchFeedback } =
    useRequestFeedback(requestId);

  const request = fetchedRequest?.data;
  const timelineEvents: TimelineEvent[] = fetchedTimeline?.data || [];
  const workUpdates: WorkUpdate[] = fetchedUpdates?.data || [];
  const attachments: MediaAttachment[] = request?.attachments || [];
  const activeFeedback: Feedback | null = fetchedFeedback?.data || null;

  if (isRequestLoading) {
    return <AdminRequestDetailsLoading />;
  }

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-card space-y-4">
        <div className="size-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
          <Clock className="size-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold">Complaint Case File Not Found</h2>
          <p className="text-xs text-muted-foreground max-w-sm">
            The requested municipal ticket ({requestId}) could not be located in
            the central database or has been archived.
          </p>
        </div>
        <Link href="/admin/requests">
          <Button variant="outline" size="sm">
            <ArrowLeft className="size-4 mr-2" />
            Back to All Complaints
          </Button>
        </Link>
      </div>
    );
  }

  // Safe location resolving
  const addressDisplay =
    request.addressLine ||
    request.reportedLocation?.addressLine ||
    request.landmark ||
    request.reportedLocation?.landmark ||
    "Incident location recorded";

  const landmarkDisplay =
    request.landmark || request.reportedLocation?.landmark || "None reported";

  const wardDisplay =
    request.ward?.name ||
    request.reportedLocation?.ward?.name ||
    (request.ward?.wardNumber
      ? `Ward ${request.ward.wardNumber}`
      : "Assigned by jurisdiction");

  const latitude = request.latitude ?? request.reportedLocation?.latitude;
  const longitude = request.longitude ?? request.reportedLocation?.longitude;

  // Actions
  const handleCopyTicketNo = () => {
    if (!request.requestNo) return;
    navigator.clipboard.writeText(request.requestNo);
    toast.add({
      title: "Copied Reference",
      description: `Reference number ${request.requestNo} copied to clipboard.`,
    });
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: request.title,
        text: `Admin case file for ${request.requestNo}: ${request.title}`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.add({
        title: "Link Copied",
        description: "Case management link copied to clipboard.",
      });
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await Promise.allSettled([
      refetchRequest(),
      refetchTimeline(),
      refetchUpdates(),
      refetchFeedback(),
      queryClient.invalidateQueries({ queryKey: ["request", requestId] }),
      queryClient.invalidateQueries({ queryKey: ["requests"] }),
    ]);
    setIsRefreshing(false);
    toast.add({
      title: "Case File Refreshed",
      description: "Fetched the latest state transitions and work updates.",
    });
  };

  const formattedCreated = request.createdAt
    ? new Date(request.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const formattedUpdated = request.updatedAt
    ? new Date(request.updatedAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const isResolved =
    request.status === "RESOLVED" || request.status === "CLOSED";

  if (isRequestLoading) {
    return <AdminRequestDetailsLoading />;
  }

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-card space-y-4">
        <div className="size-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
          <Clock className="size-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold">Complaint Not Found</h2>
          <p className="text-xs text-muted-foreground max-w-sm">
            The requested municipal service petition could not be found or has
            been removed.
          </p>
        </div>
        <Link href="/admin/requests">
          <Button size="sm">Back to Triage Queue</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-border/60">
        <div>
          <Link
            href="/admin/requests"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground mb-2"
          >
            <ArrowLeft className="size-3.5" />
            Back to Complaints & Triage Queue
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {request.requestNo || "Case File"}
            </h1>
            <StatusBadge status={request.status} />
            <PriorityBadge priority={request.priority} />
            <Badge
              variant="outline"
              className="gap-1 border-primary/30 text-primary text-[11px]"
            >
              <ShieldCheck className="size-3 text-primary" />
              Administrative Governance
            </Badge>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            Lodged on {formattedCreated} • Last updated {formattedUpdated}
          </p>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyTicketNo}
            className="gap-1.5 text-xs h-8"
            title="Copy reference number"
          >
            <Copy className="size-3.5" />
            <span className="hidden sm:inline">Copy Ref</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-1.5 text-xs h-8"
            title="Share case file link"
          >
            <Share2 className="size-3.5" />
            <span className="hidden sm:inline">Share</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="gap-1.5 text-xs h-8"
            title="Print case docket"
          >
            <Printer className="size-3.5" />
            <span className="hidden sm:inline">Print</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="gap-1.5 text-xs h-8"
            title="Refresh case file"
          >
            <RefreshCw
              className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          {/* Administrative Dispatch Actions */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRouteModalOpen(true)}
            className="gap-1.5 text-xs h-8 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10"
            title="Route complaint to a department"
          >
            <Navigation className="size-3.5" />
            <span>Route Dept</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setAssignModalOpen(true)}
            className="gap-1.5 text-xs h-8 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
            title="Assign technician"
          >
            <UserCheck className="size-3.5" />
            <span>Assign Staff</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPaymentModalOpen(true)}
            className="gap-1.5 text-xs h-8"
            title="Issue permit or service fee"
          >
            <Banknote className="size-3.5 text-primary" />
            <span className="hidden sm:inline">Issue Fee</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setStatusModalOpen(true)}
            className="gap-1.5 text-xs h-8 bg-primary text-primary-foreground hover:bg-primary/90"
            title="Change status state machine"
          >
            <Wrench className="size-3.5" />
            <span>Update Status</span>
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2 Cols): Overview, Location, Media, Field Updates */}
        <div className="space-y-6 lg:col-span-2">
          {/* Complaint Details Card */}
          <div className="rounded-lg border bg-card p-6 shadow-xs space-y-5">
            <div>
              <span className="font-mono text-xs font-semibold text-primary">
                {request.category?.name || "Municipal Category"}
              </span>
              <h2 className="mt-1 text-lg font-bold text-foreground">
                {request.title}
              </h2>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Citizen Statement & Problem Description
              </h3>
              <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {request.description}
              </p>
            </div>

            {/* Incident Location & Ward Information */}
            <div className="rounded-lg bg-muted/40 p-4 border space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <MapPin className="size-3.5 text-primary" />
                Reported Incident Location
              </h3>
              <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                <div>
                  <span className="text-muted-foreground">Street Address:</span>
                  <p className="font-medium text-foreground">
                    {addressDisplay}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Landmark / Proximity:
                  </span>
                  <p className="font-medium text-foreground">
                    {landmarkDisplay}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Ward Division:</span>
                  <p className="font-medium text-foreground">{wardDisplay}</p>
                </div>
                {latitude && longitude && (
                  <div>
                    <span className="text-muted-foreground">
                      GPS Coordinates:
                    </span>
                    <p className="font-mono text-foreground">
                      {Number(latitude).toFixed(4)},{" "}
                      {Number(longitude).toFixed(4)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Citizen Reporter Profile */}
            {request.citizen && (
              <div className="flex flex-wrap items-center justify-between border-t pt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="size-4 text-primary" />
                  <span>
                    Reported by{" "}
                    <strong className="text-foreground">
                      {request.citizen.name}
                    </strong>{" "}
                    ({request.citizen.email})
                  </span>
                </div>
                {request.citizen.contactNumber && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="size-3.5" />
                    <span className="font-mono">
                      {request.citizen.contactNumber}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Photo & Media Evidence Gallery */}
          <div className="rounded-lg border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Photographic Evidence & Media
                </h2>
                <p className="text-xs text-muted-foreground">
                  Inspection captures and on-site evidence uploaded with this
                  ticket.
                </p>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {attachments.length} files
              </span>
            </div>

            <AttachmentGallery attachments={attachments} />
          </div>

          {/* Field Technician Work Updates Feed */}
          <StaffWorkUpdateFeed
            requestId={request.id}
            requestNo={request.requestNo}
            initialUpdates={workUpdates}
            allowPost={true}
          />

          {/* Citizen Feedback Rating (when resolved or closed) */}
          {isResolved && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-3">
              <div className="flex items-center gap-2 font-semibold text-sm text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="size-4" />
                <span>Issue Marked as Resolved</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The responsible city authority has certified work completion on
                this incident.
              </p>

              {activeFeedback ? (
                <div className="rounded-md border bg-card/60 p-4 space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-foreground">
                        Citizen Rating:
                      </span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`size-3.5 ${
                              star <= activeFeedback.rating
                                ? "text-amber-500 fill-amber-500"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 ml-1">
                        {activeFeedback.rating} / 5
                      </span>
                    </div>
                    {activeFeedback.createdAt && (
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(
                          activeFeedback.createdAt,
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {activeFeedback.comment && (
                    <p className="text-xs text-foreground/90 italic bg-muted/40 p-2.5 rounded border">
                      &quot;{activeFeedback.comment}&quot;
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Citizen satisfaction evaluation not yet submitted.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Column (1 Col): SLA Tracker, Department Authority, Audit Timeline */}
        <div className="space-y-6">
          {/* SLA Performance Tracker Card */}
          <div className="rounded-lg border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Clock className="size-4 text-primary" />
                Service Level Agreement (SLA)
              </h2>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">
                Current SLA Status:
              </span>
              <SlaCountdownBadge
                status={request.status}
                resolutionDueAt={request.resolutionDueAt}
                resolvedAt={request.resolvedAt}
                responseDueAt={request.responseDueAt}
              />
            </div>

            <div className="space-y-2 border-t pt-3 text-xs text-muted-foreground">
              {request.responseDueAt && (
                <div className="flex justify-between">
                  <span>First Response Deadline:</span>
                  <span className="font-medium text-foreground">
                    {new Date(request.responseDueAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              {request.resolutionDueAt && (
                <div className="flex justify-between">
                  <span>Target Resolution Deadline:</span>
                  <span className="font-medium text-foreground">
                    {new Date(request.resolutionDueAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              {request.resolvedAt && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Actual Resolution Date:</span>
                  <span>
                    {new Date(request.resolvedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Assigned Authority & Agency Card */}
          <div className="rounded-lg border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Building2 className="size-4 text-primary" />
                Assigned Authority
              </h2>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setRouteModalOpen(true)}
                className="text-[11px] text-primary hover:underline h-6 px-1.5"
              >
                Re-route
              </Button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-muted-foreground">Department:</span>
                <p className="font-semibold text-foreground text-sm">
                  {request.currentDepartment?.name ||
                    request.category?.department?.name ||
                    "City Public Services"}
                </p>
              </div>

              {(request.currentDepartment?.code ||
                request.category?.department?.code) && (
                <div>
                  <span className="text-muted-foreground">Bureau Code:</span>
                  <p className="font-mono font-medium text-primary">
                    {request.currentDepartment?.code ||
                      request.category?.department?.code}
                  </p>
                </div>
              )}

              {request.category?.department?.contactEmail && (
                <div>
                  <span className="text-muted-foreground">Direct Desk:</span>
                  <p className="font-medium text-foreground">
                    {request.category.department.contactEmail}
                  </p>
                </div>
              )}

              {request.category?.department?.contactPhone && (
                <div>
                  <span className="text-muted-foreground">Hotline:</span>
                  <p className="font-medium text-foreground">
                    {request.category.department.contactPhone}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Unified Event Audit Timeline */}
          <div className="rounded-lg border bg-card p-5 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Calendar className="size-4 text-primary" />
                Audit Trail & Event Timeline
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Tamper-evident progression log of status transitions.
              </p>
            </div>

            <TimelineStepper events={timelineEvents} />
          </div>
        </div>
      </div>

      {/* Route Department Modal */}
      <RouteDepartmentModal
        isOpen={routeModalOpen}
        onClose={() => setRouteModalOpen(false)}
        request={request}
        onSuccess={() => handleManualRefresh()}
      />

      {/* Assign Staff Modal */}
      <AssignStaffModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        request={request}
        onSuccess={() => handleManualRefresh()}
      />

      {/* Status Update Dialog */}
      <StatusUpdateDialog
        request={request}
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
        onSuccess={() => handleManualRefresh()}
      />

      {/* Issue Payment Fee Modal */}
      <IssuePaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        defaultRequestId={requestId}
        defaultRequestNo={request.requestNo}
        onSuccess={() => handleManualRefresh()}
      />
    </div>
  );
}
