import { HardHat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StaffOverviewPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Staff Casework Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Department complaints assigned to your field queue and onsite work
          updates.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Field Queue</CardTitle>
            <HardHat className="size-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ready</div>
            <p className="text-xs text-muted-foreground">
              Role: Department Staff / Field Technician
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
