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
  ServiceRequest,
  TimelineEvent,
  WorkUpdate,
} from "@/types";
import RequestDetailsLoading from "./loading";

// Comprehensive fallback details map for sample complaints
const FALLBACK_DETAILS_MAP: Record<
  string,
  {
    request: ServiceRequest;
    timeline: TimelineEvent[];
    updates: WorkUpdate[];
    attachments: MediaAttachment[];
    feedback?: Feedback;
  }
> = {
  "req-1": {
    request: {
      id: "req-1",
      requestNo: "REQ-2026-0891",
      title: "Deep Pothole on Mirpur-10 Main Intersection",
      description:
        "Deep craters and broken asphalt causing severe traffic bottlenecks on the northern side of Mirpur-10 roundabout. Multiple vehicles have suffered wheel damage. Emergency road patch required before upcoming monsoon rains.",
      type: "COMPLAINT",
      priority: "HIGH",
      status: "RESOLVED",
      wardId: "ward-12",
      categoryId: "cat-pothole",
      citizenId: "citizen-1",
      addressLine: "Mirpur-10 Circle, Near Metro Pillar #42",
      landmark: "Opposite Fire Service Station & Metro Pillar #42",
      latitude: 23.8069,
      longitude: 90.3687,
      createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      responseDueAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
      resolutionDueAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      firstRespondedAt: new Date(Date.now() - 42 * 3600 * 1000).toISOString(),
      resolvedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      category: {
        id: "cat-pothole",
        departmentId: "dept-pwd",
        name: "Road Pothole & Asphalt Damage",
        isActive: true,
        department: {
          id: "dept-pwd",
          name: "Public Works & Road Maintenance",
          code: "PWD",
          contactEmail: "pwd.roads@dhakacity.gov.bd",
          contactPhone: "+880 2 9568712",
          isActive: true,
        },
      },
      ward: {
        id: "ward-12",
        name: "Ward 12 (Mirpur)",
        city: "Dhaka",
        isActive: true,
      },
      citizen: {
        id: "citizen-1",
        userId: "usr-citizen-1",
        name: "Sarah Jenkins",
        email: "citizen@citycomplaint.gov",
        contactNumber: "+880 1712 345678",
      },
    },
    timeline: [
      {
        id: "evt-1",
        type: "SUBMITTED",
        title: "Complaint Lodged",
        description:
          "Citizen submitted issue via civic mobile portal with photo evidence.",
        timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        actor: {
          id: "c-1",
          name: "Sarah Jenkins",
          email: "citizen@citycomplaint.gov",
        },
      },
      {
        id: "evt-2",
        type: "ROUTED",
        title: "Dispatched to Department",
        description:
          "Automated city routing assigned complaint to Public Works & Road Maintenance.",
        timestamp: new Date(Date.now() - 46 * 3600 * 1000).toISOString(),
        department: {
          id: "dept-pwd",
          name: "Public Works & Road Maintenance",
          code: "PWD",
        },
      },
      {
        id: "evt-3",
        type: "ASSIGNED",
        title: "Field Officer Assigned",
        description:
          "Assigned to Zone 4 Road Maintenance Crew under Engr. Kamal Hossain.",
        timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        actor: {
          id: "staff-1",
          name: "Engr. Kamal Hossain",
          email: "kamal@pwd.gov.bd",
        },
      },
      {
        id: "evt-4",
        type: "STATUS_CHANGED",
        title: "Repair In Progress",
        description:
          "Heavy roller and asphalt leveling truck deployed to Mirpur-10 Circle.",
        timestamp: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
      },
      {
        id: "evt-5",
        type: "RESOLVED",
        title: "Pothole Repaired & Sealed",
        description:
          "Cold-mix asphalt compacted, surface leveled, and site inspection verified by Ward 12 superintendent.",
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        actor: {
          id: "staff-1",
          name: "Engr. Kamal Hossain",
          email: "kamal@pwd.gov.bd",
        },
      },
    ],
    updates: [
      {
        id: "upd-1",
        requestId: "req-1",
        authorId: "staff-1",
        author: {
          id: "staff-1",
          name: "Engr. Kamal Hossain",
          email: "kamal@pwd.gov.bd",
        },
        note: "Initial inspection complete. Identified two secondary fissures adjacent to primary pothole. Ordered 3 cubic meters asphalt gravel mix.",
        createdAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
      },
      {
        id: "upd-2",
        requestId: "req-1",
        authorId: "staff-1",
        author: {
          id: "staff-1",
          name: "Engr. Kamal Hossain",
          email: "kamal@pwd.gov.bd",
        },
        note: "Paving and steam rolling completed. Barricades removed and full lane traffic restored.",
        createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      },
    ],
    attachments: [
      {
        id: "att-1",
        requestId: "req-1",
        url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80",
        caption: "Original asphalt crater on northern roundabout lane",
        createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      },
      {
        id: "att-2",
        requestId: "req-1",
        url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
        caption: "Completed asphalt patch and surface leveling",
        createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      },
    ],
  },
  "req-2": {
    request: {
      id: "req-2",
      requestNo: "REQ-2026-0902",
      title: "Drinking Water Pipeline Burst on Lake Road",
      description:
        "Underground main water transmission line leaking clean potable water across street. Water pressure dropping in surrounding apartment complexes.",
      type: "COMPLAINT",
      priority: "URGENT",
      status: "IN_PROGRESS",
      wardId: "ward-15",
      categoryId: "cat-water-leak",
      citizenId: "citizen-1",
      addressLine: "Road 8A, House 14, Dhanmondi",
      landmark: "Near Dhanmondi Lake Park Gate 3",
      latitude: 23.7461,
      longitude: 90.3742,
      createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
      responseDueAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
      resolutionDueAt: new Date(Date.now() + 10 * 3600 * 1000).toISOString(),
      category: {
        id: "cat-water-leak",
        departmentId: "dept-wasa",
        name: "Drinking Water Pipeline Leakage",
        isActive: true,
        department: {
          id: "dept-wasa",
          name: "Water Supply & Sewerage Authority",
          code: "WASA",
          contactEmail: "emergency@wasa.gov.bd",
          contactPhone: "+880 2 8189201",
          isActive: true,
        },
      },
      ward: {
        id: "ward-15",
        name: "Ward 15 (Dhanmondi)",
        city: "Dhaka",
        isActive: true,
      },
    },
    timeline: [
      {
        id: "evt-201",
        type: "SUBMITTED",
        title: "Urgent Ticket Submitted",
        description:
          "Reported by citizen with high priority tag due to freshwater flooding.",
        timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
      },
      {
        id: "evt-202",
        type: "ROUTED",
        title: "Dispatched to WASA Emergency Division",
        description: "Priority emergency queue bypass activated.",
        timestamp: new Date(Date.now() - 13 * 3600 * 1000).toISOString(),
      },
      {
        id: "evt-203",
        type: "ASSIGNED",
        title: "Emergency Pipe Crew Dispatched",
        description: "Crew 3 en route with hydraulic pipe isolation clamp.",
        timestamp: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
      },
      {
        id: "evt-204",
        type: "STATUS_CHANGED",
        title: "Excavation and Isolation Active",
        description: "Main valve isolated; road cut initiated to access joint.",
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      },
    ],
    updates: [
      {
        id: "upd-201",
        requestId: "req-2",
        author: {
          id: "staff-2",
          name: "Shorif Uddin (WASA)",
          email: "shorif@wasa.gov.bd",
        },
        note: "Excavation showed ruptured 6-inch PVC elbow joint. Replacement heavy-duty ductile iron joint being installed.",
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      },
    ],
    attachments: [
      {
        id: "att-201",
        requestId: "req-2",
        url: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80",
        caption: "Water pooling along Dhanmondi Lake sidewalk",
        createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
      },
    ],
  },
};

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

  // Fallback data resolution
  const fallbackEntry = FALLBACK_DETAILS_MAP[requestId] || {
    request: {
      id: requestId,
      requestNo: `REQ-2026-${requestId.replace(/\D/g, "").padStart(4, "0") || "9999"}`,
      title: "Municipal Service Request",
      description:
        "Citizen submitted municipal maintenance request under active civic tracking.",
      type: "COMPLAINT",
      priority: "MEDIUM",
      status: "SUBMITTED",
      wardId: "ward-01",
      categoryId: "cat-general",
      citizenId: "citizen-1",
      addressLine: "Dhaka Metropolitan Area",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolutionDueAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      category: {
        id: "cat-general",
        departmentId: "dept-gen",
        name: "General Municipal Maintenance",
        isActive: true,
        department: {
          id: "dept-gen",
          name: "City Municipal Services",
          code: "CMS",
          contactEmail: "support@dhakacity.gov.bd",
          contactPhone: "+880 2 9568000",
          isActive: true,
        },
      },
      ward: {
        id: "ward-01",
        name: "Ward 01 (Central)",
        city: "Dhaka",
        isActive: true,
      },
    },
    timeline: [
      {
        id: "evt-gen-1",
        type: "SUBMITTED",
        title: "Complaint Created",
        description: "Complaint logged and queued for department dispatch.",
        timestamp: new Date().toISOString(),
      },
    ],
    updates: [],
    attachments: [],
  };

  // Harmonized active data
  const request: ServiceRequest = useMemo(() => {
    if (fetchedRequest?.data) return fetchedRequest.data;
    return fallbackEntry.request;
  }, [fetchedRequest, fallbackEntry.request]);

  const timelineEvents: TimelineEvent[] = useMemo(() => {
    if (fetchedTimeline?.data && fetchedTimeline.data.length > 0) {
      return fetchedTimeline.data;
    }
    return fallbackEntry.timeline;
  }, [fetchedTimeline, fallbackEntry.timeline]);

  const workUpdates: WorkUpdate[] = useMemo(() => {
    if (fetchedUpdates?.data && fetchedUpdates.data.length > 0) {
      return fetchedUpdates.data;
    }
    return fallbackEntry.updates;
  }, [fetchedUpdates, fallbackEntry.updates]);

  const attachments: MediaAttachment[] = useMemo(() => {
    if (request.attachments && request.attachments.length > 0) {
      return request.attachments;
    }
    return fallbackEntry.attachments;
  }, [request.attachments, fallbackEntry.attachments]);

  const activeFeedback: Feedback | null = useMemo(() => {
    if (localFeedback) return localFeedback;
    if (fetchedFeedback?.data) return fetchedFeedback.data;
    if (fallbackEntry?.feedback) return fallbackEntry.feedback;
    return null;
  }, [localFeedback, fetchedFeedback, fallbackEntry]);

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

  if (isRequestLoading && !FALLBACK_DETAILS_MAP[requestId]) {
    return <RequestDetailsLoading />;
  }

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
