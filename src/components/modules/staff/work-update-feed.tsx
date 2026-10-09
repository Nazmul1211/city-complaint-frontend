"use client";

import {
  Eye,
  EyeOff,
  MessageSquarePlus,
  Plus,
  UserCheck,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { WorkUpdateForm } from "@/components/form/work-update-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetWorkUpdates } from "@/hooks";
import type { WorkUpdate } from "@/types";

interface StaffWorkUpdateFeedProps {
  requestId: string;
  requestNo?: string;
  initialUpdates?: WorkUpdate[];
  allowPost?: boolean;
}

const SKELETON_UPDATE_KEYS = ["update-s1", "update-s2", "update-s3"];

export function StaffWorkUpdateFeed({
  requestId,
  requestNo,
  initialUpdates = [],
  allowPost = true,
}: StaffWorkUpdateFeedProps) {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const {
    data: updatesResponse,
    isLoading,
    refetch,
  } = useGetWorkUpdates(requestId);

  const updates = updatesResponse?.data ?? initialUpdates;
  const isEmpty = updates.length === 0;

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/50">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold">
              Field Casework & Progress Feed
            </CardTitle>
            <Badge variant="secondary" className="font-mono text-xs">
              {updates.length} Log{updates.length === 1 ? "" : "s"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {requestNo ? `Case ${requestNo} • ` : ""}
            Onsite technician inspection notes and milestone proof.
          </p>
        </div>

        {allowPost && !showAddForm && (
          <Button
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="h-8 text-xs gap-1.5"
          >
            <Plus className="size-3.5" />
            <span>Add Work Update</span>
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Toggleable Work Update Submission Form */}
        {showAddForm && (
          <div className="pb-2">
            <WorkUpdateForm
              requestId={requestId}
              onSuccess={() => {
                setShowAddForm(false);
                refetch();
              }}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && !updatesResponse && (
          <div className="space-y-3">
            {SKELETON_UPDATE_KEYS.map((key) => (
              <div
                key={key}
                className="p-4 rounded-lg border bg-muted/20 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && isEmpty && !showAddForm && (
          <div className="flex flex-col items-center justify-center gap-2.5 rounded-lg border border-dashed py-10 text-center">
            <div className="p-3 rounded-full bg-muted text-muted-foreground">
              <Wrench className="size-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                No field reports logged yet
              </p>
              <p className="max-w-xs text-xs text-muted-foreground">
                Technician inspection updates, parts logs, and onsite photos
                will appear here.
              </p>
            </div>
            {allowPost && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(true)}
                className="mt-1 h-8 text-xs gap-1.5"
              >
                <MessageSquarePlus className="size-3.5" />
                Post First Update
              </Button>
            )}
          </div>
        )}

        {/* Updates List */}
        {!isEmpty && (
          <div className="space-y-3">
            {updates.map((item) => {
              const text =
                item.note ||
                item.description ||
                "Field inspection milestone logged.";
              const authorName =
                item.author?.name ||
                item.staff?.name ||
                "Assigned Field Technician";
              const dateStr = item.createdAt
                ? new Date(item.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Recent";

              const isPublic = item.visibleToCitizen ?? true;

              return (
                <div
                  key={item.id}
                  className="rounded-lg border bg-card p-4 space-y-2.5 text-xs text-foreground transition-all hover:border-primary/40 shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UserCheck className="size-3.5" />
                      </div>
                      <span className="font-semibold text-foreground">
                        {authorName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={isPublic ? "info" : "outline"}
                        className="gap-1 font-mono text-[10px] py-0 px-1.5"
                      >
                        {isPublic ? (
                          <>
                            <Eye className="size-2.5" /> Citizen Visible
                          </>
                        ) : (
                          <>
                            <EyeOff className="size-2.5" /> Staff Only
                          </>
                        )}
                      </Badge>

                      <span className="font-mono text-[10px] text-muted-foreground">
                        {dateStr}
                      </span>
                    </div>
                  </div>

                  <p className="leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {text}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
