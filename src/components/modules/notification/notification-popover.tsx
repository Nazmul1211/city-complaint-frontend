"use client";

import {
  Banknote,
  Bell,
  Check,
  CheckCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  MessageSquare,
  Sparkles,
  Star,
  UserCheck,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import {
  useGetMe,
  useMarkAllAsRead,
  useMarkAsRead,
  useNotifications,
} from "@/hooks";
import type { Notification } from "@/types";

const SKELETON_KEYS = ["sk-notif-1", "sk-notif-2", "sk-notif-3"];

function formatTimeAgo(dateString: string): string {
  try {
    const diffSeconds = Math.floor(
      (Date.now() - new Date(dateString).getTime()) / 1000,
    );
    if (diffSeconds < 60) return "Just now";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Recently";
  }
}

function getNotificationMeta(item: Notification, userRole?: string) {
  const type = item.type;
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";
  const defaultRequestRoute = isAdmin
    ? item.requestId
      ? `/admin/requests/${item.requestId}`
      : "/admin/requests"
    : item.requestId
      ? `/dashboard/requests/${item.requestId}`
      : "/dashboard/requests";

  switch (type) {
    case "PAYMENT_REQUIRED":
      return {
        icon: Banknote,
        color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        title: "Municipal Fee Required",
        description:
          item.payload?.message ||
          `Payment of ৳${item.payload?.amount || "--"} BDT is pending.`,
        href: isAdmin ? "/admin/requests" : "/dashboard/payments",
      };
    case "PAYMENT_SUCCESSFUL":
      return {
        icon: CheckCircle2,
        color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        title: "Payment Confirmed",
        description:
          item.payload?.message ||
          "Your municipal payment has cleared via bKash.",
        href: isAdmin
          ? "/admin/audit-logs"
          : "/dashboard/payments?status=success",
      };
    case "STATUS_CHANGED":
      return {
        icon: Clock,
        color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        title: `Status: ${item.payload?.newStatus || "Updated"}`,
        description:
          item.payload?.title ||
          `Case ${item.payload?.requestNo || ""} transitioned to ${item.payload?.newStatus || "new state"}.`,
        href: defaultRequestRoute,
      };
    case "REQUEST_ASSIGNED":
      return {
        icon: UserCheck,
        color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
        title: "Staff Assigned",
        description: item.payload?.departmentName
          ? `Dispatched to ${item.payload.departmentName}.`
          : "A technician was assigned to your case.",
        href: defaultRequestRoute,
      };
    case "WORK_UPDATE_ADDED":
      return {
        icon: Wrench,
        color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
        title: "Field Progress Logged",
        description:
          item.payload?.note ||
          "On-site progress was updated by the technician.",
        href: defaultRequestRoute,
      };
    case "FEEDBACK_REQUESTED":
      return {
        icon: Star,
        color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
        title: "Rate City Resolution",
        description:
          "Your complaint was resolved. Please rate municipal service.",
        href: defaultRequestRoute,
      };
    case "REQUEST_CREATED":
      return {
        icon: FileText,
        color: "text-primary bg-primary/10 border-primary/20",
        title: "Complaint Registered",
        description:
          item.payload?.title ||
          `Complaint [${item.payload?.requestNo || ""}] recorded into registry.`,
        href: defaultRequestRoute,
      };
    default:
      return {
        icon: MessageSquare,
        color: "text-muted-foreground bg-muted border-border/60",
        title: "Municipal Notice",
        description: item.payload?.message || "You have a new civic update.",
        href: isAdmin ? "/admin/requests" : "/dashboard/requests",
      };
  }
}

export function NotificationPopover() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [filterUnread, setFilterUnread] = useState(false);

  const { data: meData } = useGetMe();
  const userRole = meData?.data?.role;

  const { data: notifData, isLoading } = useNotifications();
  const notifications: Notification[] = notifData?.data || [];

  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  // Unread items count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.readAt).length;
  }, [notifications]);

  // Display items based on filter
  const displayedNotifications = useMemo(() => {
    if (filterUnread) {
      return notifications.filter((n) => !n.readAt);
    }
    return notifications;
  }, [notifications, filterUnread]);

  const handleMarkAllRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
      toast.add({
        title: "All Caught Up",
        description: "All notifications marked as read.",
        type: "success",
      });
    } catch {
      toast.add({
        title: "Error",
        description: "Failed to mark notifications as read.",
        type: "error",
      });
    }
  };

  const handleItemClick = async (item: Notification) => {
    if (!item.readAt) {
      markAsReadMutation.mutate(item.id);
    }
    const meta = getNotificationMeta(item, userRole);
    setOpen(false);
    router.push(meta.href);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="relative inline-flex size-9 items-center justify-center rounded-lg border border-border/60 bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors cursor-pointer"
        aria-label="View notifications"
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-extrabold font-mono text-white shadow-sm ring-2 ring-background pointer-events-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 sm:w-96 p-0 border border-border/80 shadow-2xl rounded-2xl bg-card overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border/60">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              Notifications
              <Sparkles className="size-3.5 text-primary" />
            </h3>
            {unreadCount > 0 ? (
              <Badge
                variant="outline"
                className="text-[10px] h-4 px-1.5 bg-primary/15 text-primary border-primary/25"
              >
                {unreadCount} new
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-[10px] h-4 px-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              >
                Caught up
              </Badge>
            )}
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={markAllAsReadMutation.isPending}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
              title="Mark all as read"
            >
              <CheckCheck className="size-3.5" />
              <span>Mark all read</span>
            </Button>
          )}
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border/40 bg-muted/20 text-xs">
          <button
            type="button"
            onClick={() => setFilterUnread(false)}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              !filterUnread
                ? "bg-background text-foreground shadow-xs border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterUnread(true)}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              filterUnread
                ? "bg-background text-foreground shadow-xs border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications Scroll Area */}
        <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
          {isLoading ? (
            <div className="p-3 space-y-3">
              {SKELETON_KEYS.map((k) => (
                <div key={k} className="flex gap-2.5 items-start">
                  <Skeleton className="size-8 rounded-lg shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-2.5 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayedNotifications.length === 0 ? (
            <div className="py-10 px-4 text-center">
              <div className="size-10 rounded-xl bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground mb-2">
                <Check className="size-5" />
              </div>
              <p className="text-xs font-semibold text-foreground">
                No notifications to display
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xs mx-auto">
                {filterUnread
                  ? "You have reviewed all current notifications."
                  : "All official city alerts and updates will appear here."}
              </p>
            </div>
          ) : (
            displayedNotifications.map((item) => {
              const meta = getNotificationMeta(item, userRole);
              const Icon = meta.icon;
              const isUnread = !item.readAt;

              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`w-full text-left flex items-start gap-3 p-3 transition-colors cursor-pointer hover:bg-muted/40 ${
                    isUnread ? "bg-primary/5" : ""
                  }`}
                >
                  <div
                    className={`size-8 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 ${meta.color}`}
                  >
                    <Icon className="size-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-xs truncate ${
                          isUnread
                            ? "font-bold text-foreground"
                            : "font-medium text-foreground/80"
                        }`}
                      >
                        {meta.title}
                      </h4>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {formatTimeAgo(item.createdAt)}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                      {meta.description}
                    </p>

                    {item.request && (
                      <span className="inline-block mt-1 text-[10px] font-mono text-primary font-semibold">
                        {item.request.requestNo}
                      </span>
                    )}
                  </div>

                  {isUnread && (
                    <span
                      className="size-1.5 rounded-full bg-primary shrink-0 self-center"
                      title="Unread"
                    />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-border/60 bg-muted/20 text-center">
          <Link
            href="/dashboard/requests"
            onClick={() => setOpen(false)}
            className="text-[11px] font-medium text-primary hover:underline inline-flex items-center gap-1"
          >
            Manage All Complaints
            <ExternalLink className="size-3" />
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
