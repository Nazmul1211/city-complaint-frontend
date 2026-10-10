"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Banknote,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  MapPin,
  Phone,
  Printer,
  RefreshCw,
  Share2,
  ShieldCheck,
  Star,
  User,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { FeedbackModal } from "@/components/form";
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
import { Button } from "@/components/ui/button";
import { PriorityBadge, StatusBadge } from "@/components/ui/status-badge";
import { toast } from "@/components/ui/toast";
import {
  useGetMe,
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
import RequestDetailsLoading from "./loading";

export default function RequestDetailsPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [localFeedback, setLocalFeedback] = useState<Feedback | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const { data: meData } = useGetMe();
  const userRole = meData?.data?.role;
  const isStaffOrAdmin =
    userRole === "STAFF" || userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  const rawId = params?.id;
  const requestId = Array.isArray(rawId) ? rawId[0] : (rawId as string) || "";

  // React Query hooks for fetching real backend data
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

  const activeFeedback: Feedback | null = useMemo(() => {
    if (localFeedback) return localFeedback;
    if (fetchedFeedback?.data) return fetchedFeedback.data;
    return null;
  }, [localFeedback, fetchedFeedback]);

  if (isRequestLoading) {
    return <RequestDetailsLoading />;
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
            The requested municipal service petition could not be found or you
            do not have permission to view it.
          </p>
        </div>
        <Link href="/dashboard/requests">
          <Button size="sm">Back to My Complaints</Button>
        </Link>
      </div>
    );
  }

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
        text: `Track complaint ${request.requestNo}: ${request.title}`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.add({
        title: "Link Copied",
        description: "Complaint tracking link copied to clipboard.",
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
      queryClient.invalidateQueries({ queryKey: ["feedback", requestId] }),
    ]);
    setIsRefreshing(false);
    toast.add({
      title: "Timeline Updated",
      description: "Fetched the latest audit log and field inspection reports.",
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

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dashboard/requests"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground mb-2"
          >
            <ArrowLeft className="size-3.5" />
            Back to Complaints Dashboard
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {request.requestNo || "Complaint Details"}
            </h1>
            <StatusBadge status={request.status} />
            <PriorityBadge priority={request.priority} />
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            Created on {formattedCreated} • Last updated {formattedUpdated}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyTicketNo}
            className="gap-1.5 text-xs"
            title="Copy reference number"
          >
            <Copy className="size-3.5" />
            <span className="hidden sm:inline">Copy Ref</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-1.5 text-xs"
            title="Share complaint link"
          >
            <Share2 className="size-3.5" />
            <span className="hidden sm:inline">Share</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="gap-1.5 text-xs"
            title="Print summary"
          >
            <Printer className="size-3.5" />
            <span className="hidden sm:inline">Print</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="gap-1.5 text-xs"
            title="Refresh status"
          >
            <RefreshCw
              className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          {isStaffOrAdmin && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaymentModalOpen(true)}
                className="gap-1.5 text-xs"
                title="Issue municipal fee for this complaint"
              >
                <Banknote className="size-3.5 text-primary" />
                <span className="hidden sm:inline">Issue Fee</span>
              </Button>

              <Button
                size="sm"
                onClick={() => setStatusModalOpen(true)}
                className="gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                title="Update casework status"
              >
                <Wrench className="size-3.5" />
                <span>Update Status</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2 Cols): Overview, Media Gallery, Work Updates */}
        <div className="space-y-6 lg:col-span-2">
          {/* Complaint Details Card */}
          <div className="rounded-lg border bg-card p-6 shadow-sm space-y-5">
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
                    {request.addressLine || "Not specified"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Landmark / Proximity:
                  </span>
                  <p className="font-medium text-foreground">
                    {request.landmark || "None reported"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Ward Division:</span>
                  <p className="font-medium text-foreground">
                    {request.ward?.name ||
                      `Ward ID: ${request.wardId || "Unassigned"}`}
                  </p>
                </div>
                {request.latitude && request.longitude && (
                  <div>
                    <span className="text-muted-foreground">
                      GPS Coordinates:
                    </span>
                    <p className="font-mono text-foreground">
                      {request.latitude.toFixed(4)},{" "}
                      {request.longitude.toFixed(4)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Citizen Reporter Info (if visible) */}
            {request.citizen && (
              <div className="flex flex-wrap items-center justify-between border-t pt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="size-4 text-primary" />
                  <span>
                    Reported by{" "}
                    <strong className="text-foreground">
                      {request.citizen.name}
                    </strong>
                  </span>
                </div>
                {request.citizen.contactNumber && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="size-3.5" />
                    <span>{request.citizen.contactNumber}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Photo & Media Evidence Gallery */}
          <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
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
            allowPost={isStaffOrAdmin}
          />

          {/* Citizen Feedback Rating Section (when resolved or closed) */}
          {isResolved && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-sm text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="size-4" />
                    <span>Issue Marked as Resolved</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The responsible city agency has certified completion of this
                    ticket.
                  </p>
                </div>
                {!activeFeedback && (
                  <Button
                    size="sm"
                    onClick={() => setFeedbackModalOpen(true)}
                    className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                  >
                    <Star className="size-3.5 fill-current" />
                    Rate Resolution Quality
                  </Button>
                )}
              </div>

              {activeFeedback ? (
                <div className="rounded-md border bg-card/60 p-4 space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-foreground">
                        Your Rating:
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
                <p className="text-xs text-muted-foreground">
                  Your rating helps Dhaka City Corporation evaluate contractor
                  performance and municipal staff responsiveness.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Column (1 Col): SLA Tracker, Department Info, Timeline Stepper */}
        <div className="space-y-6">
          {/* SLA Performance Tracker Card */}
          <div className="rounded-lg border bg-card p-5 shadow-sm space-y-4">
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

          {/* Assigned Department Card */}
          <div className="rounded-lg border bg-card p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-primary" />
              Assigned Authority
            </h2>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-muted-foreground">Department:</span>
                <p className="font-semibold text-foreground text-sm">
                  {request.category?.department?.name || "City Public Services"}
                </p>
              </div>

              {request.category?.department?.code && (
                <div>
                  <span className="text-muted-foreground">Agency Code:</span>
                  <p className="font-mono font-medium text-primary">
                    {request.category.department.code}
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
          <div className="rounded-lg border bg-card p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Calendar className="size-4 text-primary" />
                Audit Trail & Event Timeline
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Tamper-evident progression log of all status transitions.
              </p>
            </div>

            <TimelineStepper events={timelineEvents} />
          </div>
        </div>
      </div>

      {/* Citizen Feedback Rating Modal */}
      <FeedbackModal
        open={feedbackModalOpen}
        onOpenChange={setFeedbackModalOpen}
        requestId={requestId}
        requestTitle={request.title}
        onSuccess={(created) => {
          setLocalFeedback(created);
          refetchFeedback();
        }}
      />

      {/* Staff Status Transition Dialog */}
      <StatusUpdateDialog
        request={request}
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
        onSuccess={() => handleManualRefresh()}
      />

      {/* Staff/Admin Issue Payment Modal */}
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
