"use client";

import { useForm } from "@tanstack/react-form";
import {
  Eye,
  EyeClosed,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GoogleLoginComponent from "@/components/modules/google-login/GoogleLogin";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useRegistration } from "@/hooks";
import {
  type CitizenRegistrationFormData,
  citizenRegistrationSchema,
} from "@/validation";
import VerifyOtpComponent from "./verify-otp-modal";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const { mutate: register, isPending: isRegistering } = useRegistration();

  const defaultValues: CitizenRegistrationFormData = {
    name: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: citizenRegistrationSchema,
    },
    onSubmit: ({ value }) => {
      const payload = {
        name: value.name.trim(),
        email: value.email.trim().toLowerCase(),
        password: value.password,
        citizen: value.contactNumber?.trim()
          ? { contactNumber: value.contactNumber.trim() }
          : undefined,
      };

      register(payload, {
        onSuccess: () => {
          toast.add({
            title: "Registration Initiated",
            description: `Verification OTP has been sent to ${payload.email}`,
            type: "success",
          });
          setRegisteredEmail(payload.email);
          setIsOtpModalOpen(true);
        },
        onError: (err: Error) => {
          toast.add({
            title: "Registration Failed",
            description:
              err?.message ||
              "Could not complete registration. Email may already be in use.",
            type: "error",
          });
        },
      });
    },
  });

  return (
    <>
      <div className="flex flex-col gap-6 w-full">
        {/* Header */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
            <ShieldCheck className="size-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Citizen Registration
          </h1>
          <p className="text-sm text-muted-foreground text-balance">
            Create an account to submit complaints, pay service bills, and track
            city repairs
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <FieldGroup className="gap-3.5">
            {/* Full Name */}
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="Nazmul Hasan"
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        value={field.state.value}
                        autoComplete="name"
                        aria-invalid={isInvalid}
                        className="pl-9"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Email Address */}
            <form.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        placeholder="citizen@example.com"
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        value={field.state.value}
                        autoComplete="email"
                        aria-invalid={isInvalid}
                        className="pl-9"
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Phone Number */}
            <form.Field name="contactNumber">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor={field.name}>
                        Contact Number
                      </FieldLabel>
                      <span className="text-[11px] text-muted-foreground">
                        Optional
                      </span>
                    </div>
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        type="tel"
                        placeholder="01712345678"
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        value={field.state.value}
                        autoComplete="tel"
                        aria-invalid={isInvalid}
                        className="pl-9"
                      />
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Password */}
            <form.Field name="password">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        type={showPassword ? "text" : "password"}
                        placeholder="Min 8 chars (A-Z, a-z, 0-9, special)"
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        value={field.state.value}
                        autoComplete="new-password"
                        aria-invalid={isInvalid}
                        className="pl-9 pr-9"
                      />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                      <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        type="button"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeClosed className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Confirm Password */}
            <form.Field name="confirmPassword">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Confirm Password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-type password"
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        value={field.state.value}
                        autoComplete="new-password"
                        aria-invalid={isInvalid}
                        className="pl-9 pr-9"
                      />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                      <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        type="button"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? (
                          <EyeClosed className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <Button
              disabled={isRegistering}
              type="submit"
              className="w-full mt-2 font-medium"
            >
              {isRegistering ? (
                <span className="flex items-center gap-2">
                  <Spinner className="size-4" /> Creating Account...
                </span>
              ) : (
                "Create Account & Send OTP"
              )}
            </Button>
          </FieldGroup>
        </form>

        <FieldSeparator>Or sign up with</FieldSeparator>

        <GoogleLoginComponent />

        {/* Existing account link */}
        <div className="text-center text-xs text-muted-foreground">
          Already registered?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Sign In here
          </Link>
        </div>
      </div>

      {/* OTP Modal */}
      {registeredEmail && (
        <VerifyOtpComponent
          email={registeredEmail}
          isOpen={isOtpModalOpen}
          isModal={true}
          onClose={() => {
            setIsOtpModalOpen(false);
            router.push(
              `/verify-email?email=${encodeURIComponent(registeredEmail)}`,
            );
          }}
        />
      )}
    </>
  );
}
