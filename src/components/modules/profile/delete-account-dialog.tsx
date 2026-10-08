"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteMyAccount } from "@/hooks";

export function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);
  const { mutate: deleteAccount, isPending } = useDeleteMyAccount();

  const handleDelete = () => {
    deleteAccount(undefined, {
      onSettled: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="gap-1.5 text-xs h-9"
          />
        }
      >
        <Trash2 className="size-3.5" />
        Delete Citizen Account
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader className="gap-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-1">
            <AlertTriangle className="size-5" />
          </div>
          <DialogTitle className="text-base font-bold text-foreground">
            Permanently Close Citizen Account?
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            This action is irreversible. Closing your account will revoke access
            to all submitted complaints, remove personal contact identifiers
            from public audit logs, and clear active sessions.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-3 text-xs text-destructive">
          <strong>Important note:</strong> Historical service request public
          records previously submitted to municipal departments will remain in
          the city ledger for civic transparency, but will be anonymized.
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => setOpen(false)}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={isPending}
            onClick={handleDelete}
            className="gap-1.5 text-xs"
          >
            {isPending ? (
              <>
                <Spinner className="size-3.5" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                Yes, Delete Account
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
