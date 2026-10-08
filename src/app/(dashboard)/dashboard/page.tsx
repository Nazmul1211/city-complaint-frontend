import { UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CitizenOverviewPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Citizen Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome to your civic portal. Submit complaints, track repair
          progress, and view receipts.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Account Status
            </CardTitle>
            <UserCheck className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active Citizen</div>
            <p className="text-xs text-muted-foreground">
              Verified Civic Profile
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
