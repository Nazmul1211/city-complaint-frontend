"use client";

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeClosed, Lock, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { getMe } from "@/api";
import DemoLoginCards, {
  DEMO_ACCOUNTS,
} from "@/components/auth/demo-login-cards";
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
import { useLogin } from "@/hooks";
import { loginSchema } from "@/validation";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeDemoRole, setActiveDemoRole] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const { mutate: login, isPending: loginPending } = useLogin();

  const handleSuccessfulAuth = async (userRole?: string) => {
    try {
      await queryClient.invalidateQueries({ queryKey: ["user"] });

      let role = userRole;
      if (!role) {
        const profile = await getMe();
        role = profile?.data?.role;
      }

      toast.add({
        title: "Login Successful",
        description: `Welcome back to CityCare${role ? ` (${role})` : ""}`,
        type: "success",
      });

      const redirectUrl = searchParams.get("redirect");
      if (redirectUrl) {
        router.push(redirectUrl);
        return;
      }

      if (role === "ADMIN" || role === "SUPER_ADMIN") {
        router.push("/admin");
      } else if (role === "STAFF") {
        router.push("/staff");
      } else {
        router.push("/dashboard");
      }
    } catch {
      router.push("/dashboard");
    } finally {
      setActiveDemoRole(null);
    }
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: ({ value }) => {
      login(
        { email: value.email, password: value.password },
        {
          onSuccess: (res) => {
            handleSuccessfulAuth(res?.data?.user?.role);
          },
          onError: (err: Error) => {
            toast.add({
              title: "Login Failed",
              description:
                err?.message ||
                "Invalid credentials. Please verify your email and password.",
              type: "error",
            });
            setActiveDemoRole(null);
          },
        },
      );
    },
  });

  const handleDemoSelect = (
    email: string,
    password: string,
    autoSubmit = false,
  ) => {
    form.setFieldValue("email", email);
    form.setFieldValue("password", password);

    if (autoSubmit) {
      const match = DEMO_ACCOUNTS.find((a) => a.email === email);
      setActiveDemoRole(match?.role || null);

      login(
        { email, password },
        {
          onSuccess: (res) => {
            handleSuccessfulAuth(res?.data?.user?.role || match?.role);
          },
          onError: (err: Error) => {
            toast.add({
              title: "Demo Login Failed",
              description:
                err?.message ||
                "Unable to login with demo account. Ensure backend is running.",
              type: "error",
            });
            setActiveDemoRole(null);
          },
        },
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
          <ShieldCheck className="size-5" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome to CityCare
        </h1>
        <p className="text-sm text-muted-foreground text-balance">
          Access civic complaint triage, field casework, or citizen reporting
        </p>
      </div>

      {/* One-Click Role Logins */}
      <DemoLoginCards
        onSelect={handleDemoSelect}
        isLoading={loginPending}
        activeRole={activeDemoRole}
      />

      <FieldSeparator>Or sign in with email</FieldSeparator>

      {/* Email / Password Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <FieldGroup>
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
                      placeholder="name@example.com"
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      value={field.state.value}
                      autoComplete="email"
                      aria-invalid={isInvalid}
                      className="pl-9"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="password">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      value={field.state.value}
                      autoComplete="current-password"
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <Button
            disabled={loginPending}
            type="submit"
            className="w-full mt-2 font-medium"
          >
            {loginPending ? (
              <span className="flex items-center gap-2">
                <Spinner className="size-4" /> Authenticating...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </FieldGroup>
      </form>

      <GoogleLoginComponent />

      {/* Registration Link */}
      <div className="text-center text-xs text-muted-foreground pt-1">
        Are you a citizen without an account?{" "}
        <Link
          href="/register"
          className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
        >
          Create Citizen Account
        </Link>
      </div>
    </div>
  );
}
