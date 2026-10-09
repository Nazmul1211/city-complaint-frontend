import { Shield } from "lucide-react";
import { UsersTable } from "@/components/modules/admin";
import { Badge } from "@/components/ui/badge";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              User & Role Administration
            </h1>
            <Badge
              variant="outline"
              className="gap-1 border-primary/30 text-primary"
            >
              <Shield className="size-3 text-primary" />
              Access Governance
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Oversee civic participants, departmental technicians, and municipal
            administration privileges.
          </p>
        </div>
      </div>

      <UsersTable />
    </div>
  );
}
