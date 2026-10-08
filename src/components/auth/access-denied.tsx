import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AccessDenied() {
  return (
    <div className="w-full h-screen flex justify-center items-center p-4">
      <div className="flex flex-col sm:flex-row items-center gap-4 max-w-md text-center sm:text-left">
        <div className="bg-destructive/10 rounded-full p-4 shrink-0">
          <ShieldAlert className="size-8 text-destructive" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-lg font-semibold tracking-tight">
            You do not have access to this page
          </h1>
          <p className="text-sm text-muted-foreground">
            Your user role is not authorized to view this resource.
          </p>
          <div className="pt-2">
            <Button size="sm" render={<Link href="/" />}>
              Return Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
