import { ArrowRight, Building2, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PriorityBadge, StatusBadge } from "@/components/ui/status-badge";
import type { ServiceRequest } from "@/types";

interface RequestCardProps {
  request: ServiceRequest;
}

export function RequestCard({ request }: RequestCardProps) {
  const formattedDate = new Date(request.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <Card className="flex h-full flex-col justify-between border bg-card transition-colors hover:border-foreground/20">
      <CardHeader className="pb-3 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-bold text-primary">
            {request.requestNo}
          </span>
          <div className="flex items-center gap-1.5">
            <PriorityBadge priority={request.priority} />
            <StatusBadge status={request.status} />
          </div>
        </div>

        <CardTitle className="text-base font-semibold text-foreground line-clamp-1">
          {request.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2.5 pb-3 text-xs text-muted-foreground">
        <p className="line-clamp-2 leading-relaxed">{request.description}</p>

        <div className="space-y-1.5 border-t pt-2.5">
          <div className="flex items-center gap-2">
            <Building2 className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">
              {request.category?.name ?? "Municipal Service"} (
              {request.category?.department?.name ?? "City Department"})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">
              {request.ward?.name ?? "Ward"} - {request.addressLine}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="size-3.5 shrink-0 text-muted-foreground" />
            <span>Filed on {formattedDate}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-3">
        <Link href={`/dashboard/requests/${request.id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full gap-1.5">
            View Details & Timeline
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
