import { ArrowRight, Building2, Mail, Phone, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Department } from "@/types";

interface DepartmentCardProps {
  department: Department;
}

export function DepartmentCard({ department }: DepartmentCardProps) {
  const memberCount = department._count?.members ?? 0;

  return (
    <Card className="flex h-full flex-col justify-between border bg-card transition-colors hover:border-foreground/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Building2 className="size-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="font-mono text-[10px]">
              {department.code}
            </Badge>
            {department.isActive ? (
              <Badge variant="success">ACTIVE</Badge>
            ) : (
              <Badge variant="secondary">INACTIVE</Badge>
            )}
          </div>
        </div>
        <CardTitle className="mt-3 text-lg font-semibold tracking-tight text-foreground">
          {department.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 pb-3 text-xs text-muted-foreground">
        {department.description ? (
          <p className="line-clamp-2 leading-relaxed text-muted-foreground">
            {department.description}
          </p>
        ) : (
          <p className="italic text-muted-foreground/60">
            Municipal service and complaint management department.
          </p>
        )}

        <div className="space-y-1.5 border-t pt-2.5">
          {department.contactEmail && (
            <div className="flex items-center gap-2">
              <Mail className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate">{department.contactEmail}</span>
            </div>
          )}
          {department.contactPhone && (
            <div className="flex items-center gap-2">
              <Phone className="size-3.5 shrink-0 text-muted-foreground" />
              <span>{department.contactPhone}</span>
            </div>
          )}
          {memberCount > 0 && (
            <div className="flex items-center gap-2">
              <Users className="size-3.5 shrink-0 text-muted-foreground" />
              <span>
                {memberCount} active case officers & field technicians
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="gap-2 border-t pt-3">
        <Link
          href={`/dashboard/submit-request?departmentId=${department.id}`}
          className="flex-1"
        >
          <Button size="sm" className="w-full gap-1.5">
            Report Issue
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
        <Link href={`/services?departmentId=${department.id}`}>
          <Button variant="outline" size="sm">
            Services
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
