"use client";

import { useForm } from "@tanstack/react-form";
import {
  CheckCircle2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  Undo2,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateProfile } from "@/hooks";
import { updateProfileSchema } from "@/validation";

interface ProfileFormProps {
  initialData: {
    name: string;
    email: string;
    role: string;
    contactNumber?: string | null;
    address?: string | null;
    emailVerified?: boolean;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const form = useForm({
    defaultValues: {
      name: initialData.name || "",
      contactNumber: initialData.contactNumber || "",
      address: initialData.address || "",
    },
    validators: {
      onSubmit: updateProfileSchema,
    },
    onSubmit: ({ value }) => {
      updateProfile({
        name: value.name.trim(),
        citizen: {
          contactNumber: value.contactNumber?.trim() || undefined,
          address: value.address?.trim() || undefined,
        },
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <FieldGroup className="gap-5">
        {/* Full Name Field */}
        <form.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !!field.state.meta.errors.length;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className="flex items-center gap-1.5 text-xs font-semibold"
                >
                  <UserIcon className="size-3.5 text-muted-foreground" />
                  Full Legal Name
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  disabled={isPending}
                  className="h-10 text-sm"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        {/* Read-Only Email Field */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <Mail className="size-3.5 text-muted-foreground" />
                Email Address
              </span>
              {initialData.emailVerified && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-3" />
                  Verified
                </span>
              )}
            </FieldLabel>
            <div className="relative">
              <Input
                value={initialData.email}
                disabled
                className="h-10 bg-muted/50 text-muted-foreground pr-8 cursor-not-allowed text-sm"
              />
              <Lock className="absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Official email address linked to your verified citizen account.
            </p>
          </Field>

          {/* Account Role / Identity Type */}
          <Field>
            <FieldLabel className="text-xs font-semibold">
              Civic Role & Access Level
            </FieldLabel>
            <div className="relative">
              <Input
                value={initialData.role}
                disabled
                className="h-10 bg-muted/50 text-muted-foreground pr-8 cursor-not-allowed font-mono text-sm uppercase"
              />
              <Lock className="absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Determines your access permissions across the municipal portal.
            </p>
          </Field>
        </div>

        {/* Contact Phone Number */}
        <form.Field name="contactNumber">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !!field.state.meta.errors.length;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className="flex items-center gap-1.5 text-xs font-semibold"
                >
                  <Phone className="size-3.5 text-muted-foreground" />
                  Contact Mobile Number
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="tel"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="017XXXXXXXX or +88017XXXXXXXX"
                  disabled={isPending}
                  className="h-10 text-sm font-mono"
                />
                <p className="text-[11px] text-muted-foreground">
                  Used by field engineers to coordinate on-site municipal
                  inspections.
                </p>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        {/* Street & Postal Address */}
        <form.Field name="address">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !!field.state.meta.errors.length;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className="flex items-center gap-1.5 text-xs font-semibold"
                >
                  <MapPin className="size-3.5 text-muted-foreground" />
                  Residential / Ward Address
                </FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="House #, Road #, Area, Ward number, Dhaka"
                  disabled={isPending}
                  rows={3}
                  className="text-sm resize-none"
                />
                <p className="text-[11px] text-muted-foreground">
                  Helps municipal departments pre-route complaints to your local
                  zone office.
                </p>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => {
            form.reset();
          }}
          className="gap-1.5 text-xs h-9"
        >
          <Undo2 className="size-3.5" />
          Discard Changes
        </Button>

        <Button
          type="submit"
          size="sm"
          disabled={isPending}
          className="gap-1.5 text-xs h-9 min-w-[120px]"
        >
          {isPending ? (
            <>
              <Spinner className="size-3.5" />
              Saving...
            </>
          ) : (
            <>
              <Save className="size-3.5" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
