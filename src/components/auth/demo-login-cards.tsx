"use client";

import {
  ArrowRight,
  HardHat,
  ShieldAlert,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export interface DemoAccount {
  role: "ADMIN" | "STAFF" | "CITIZEN";
  name: string;
  email: string;
  password: string;
  targetRoute: string;
  badgeVariant: "destructive" | "warning" | "default";
  icon: typeof UserCheck;
  tagline: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "CITIZEN",
    name: "Citizen Demo",
    email: "testercitizen@gmail.com",
    password: "Tester@Citizen123456",
    targetRoute: "/dashboard",
    badgeVariant: "default",
    icon: UserCheck,
    tagline: "Submit civic requests & track resolution",
  },
  {
    role: "STAFF",
    name: "Staff / Technician Demo",
    email: "rakib.staff@citycare.com",
    password: "Staff@1234",
    targetRoute: "/staff",
    badgeVariant: "warning",
    icon: HardHat,
    tagline: "Field casework, status updates & proof uploads",
  },
  {
    role: "ADMIN",
    name: "City Admin Demo",
    email: "superadmin@gmail.com",
    password: "Super@Admin123456",
    targetRoute: "/admin",
    badgeVariant: "destructive",
    icon: ShieldAlert,
    tagline: "City governance, triage, routing & analytics",
  },
];

interface DemoLoginCardsProps {
  onSelect: (email: string, password: string, autoSubmit?: boolean) => void;
  isLoading?: boolean;
  activeRole?: string | null;
}

export default function DemoLoginCards({
  onSelect,
  isLoading = false,
  activeRole = null,
}: DemoLoginCardsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Sparkles className="size-3.5 text-amber-500 animate-pulse" />
          <span>One-Click Demo Role Logins</span>
        </div>
        <span className="text-[11px] text-muted-foreground/80">
          Evaluation Ready
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {DEMO_ACCOUNTS.map((account) => {
          const Icon = account.icon;
          const isCurrentLoading = isLoading && activeRole === account.role;

          return (
            <Card
              key={account.role}
              size="sm"
              className="relative transition-all duration-200 hover:border-primary/50 hover:shadow-sm flex flex-col justify-between border-dashed bg-muted/20"
            >
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="p-1 rounded-md bg-background border text-foreground shrink-0">
                      <Icon className="size-3.5" />
                    </div>
                    <span className="font-semibold text-xs truncate">
                      {account.role}
                    </span>
                  </div>
                  <Badge
                    variant={account.badgeVariant}
                    className="text-[10px] px-1.5 py-0"
                  >
                    {account.role}
                  </Badge>
                </div>

                <div className="space-y-0.5 text-[11px] text-muted-foreground bg-background/60 p-1.5 rounded border border-border/40 font-mono">
                  <p className="truncate" title={account.email}>
                    {account.email}
                  </p>
                  <p className="text-foreground/70">••••••••</p>
                </div>

                <div className="pt-1 flex flex-col gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant={account.role === "CITIZEN" ? "default" : "outline"}
                    className="w-full h-7 text-xs font-medium justify-between px-2"
                    disabled={isLoading}
                    onClick={() =>
                      onSelect(account.email, account.password, true)
                    }
                  >
                    {isCurrentLoading ? (
                      <span className="flex items-center gap-1.5 mx-auto">
                        <Spinner className="size-3" /> Logging in...
                      </span>
                    ) : (
                      <>
                        <span>1-Click Sign In</span>
                        <ArrowRight className="size-3" />
                      </>
                    )}
                  </Button>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() =>
                      onSelect(account.email, account.password, false)
                    }
                    className="text-[10px] text-center text-muted-foreground hover:text-foreground transition-colors hover:underline pt-0.5"
                  >
                    Fill credentials only
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
