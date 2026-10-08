"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  ChevronRight,
  LogOut,
  Menu,
  ShieldCheck,
  User as UserIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks";
import type { UserRole } from "@/types";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const routes = [
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: "Track Request", url: "/track" },
    { name: "About Us", url: "/about" },
    { name: "Contact", url: "/contact" },
  ];

  const dashboardRoute: Record<UserRole, string> = {
    SUPER_ADMIN: "/admin",
    ADMIN: "/admin",
    STAFF: "/staff",
    CITIZEN: "/dashboard",
  };

  const { data, isLoading } = useGetMe();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const queryClient = useQueryClient();

  const user = data?.data;
  const role: UserRole | undefined = user?.role;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.add({
          title: "Logged Out",
          description: "You have been logged out successfully.",
          type: "success",
        });
        queryClient.removeQueries({ queryKey: ["user"] });
      },
      onError: () => {
        toast.add({
          title: "Logout Error",
          description: "Something went wrong while logging out.",
          type: "error",
        });
      },
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
            <Building2 className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-foreground">
              CityCare
            </span>
            <span className="text-[10px] -mt-1 font-medium text-muted-foreground">
              Municipal Portal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {routes.map((route) => {
            const isActive =
              route.url === "/"
                ? pathname === "/"
                : pathname.startsWith(route.url);
            return (
              <Link
                key={route.url}
                href={route.url}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive
                    ? "font-semibold text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {route.name}
              </Link>
            );
          })}

          {role && (
            <Link
              href={dashboardRoute[role]}
              className={`flex items-center gap-1 text-sm font-semibold transition-colors hover:text-primary ${
                pathname.startsWith(dashboardRoute[role])
                  ? "text-primary"
                  : "text-foreground"
              }`}
            >
              <ShieldCheck className="size-4 text-primary" />
              <span>Dashboard</span>
            </Link>
          )}
        </nav>

        {/* Right CTA / Auth Status */}
        <div className="hidden items-center gap-3 md:flex">
          {!isLoading && !user && (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard/submit-request">
                <Button size="sm" className="gap-1.5 shadow-sm">
                  Report Issue
                  <ChevronRight className="size-3.5" />
                </Button>
              </Link>
            </>
          )}

          {!isLoading && user && (
            <div className="flex items-center gap-3">
              <Link
                href={role ? dashboardRoute[role] : "/dashboard"}
                className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                <UserIcon className="size-3.5 text-muted-foreground" />
                <span className="max-w-[120px] truncate">{user.name}</span>
                <span className="rounded bg-primary/10 px-1 py-0.2 text-[10px] font-semibold uppercase text-primary">
                  {role}
                </span>
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                disabled={isLoggingOut}
                className="gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="size-3.5" />
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="flex size-9 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted"
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {routes.map((route) => {
              const isActive =
                route.url === "/"
                  ? pathname === "/"
                  : pathname.startsWith(route.url);
              return (
                <Link
                  key={route.url}
                  href={route.url}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium py-1.5 transition-colors ${
                    isActive
                      ? "font-bold text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {route.name}
                </Link>
              );
            })}

            {role && (
              <Link
                href={dashboardRoute[role]}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-1.5 text-sm font-semibold text-primary"
              >
                <ShieldCheck className="size-4" />
                My Dashboard ({role})
              </Link>
            )}

            <div className="mt-3 flex flex-col gap-2 border-t pt-3">
              {!isLoading && !user && (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    href="/dashboard/submit-request"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full">Report an Issue</Button>
                  </Link>
                </>
              )}

              {!isLoading && user && (
                <>
                  <div className="text-xs text-muted-foreground">
                    Signed in as{" "}
                    <span className="font-semibold text-foreground">
                      {user.name}
                    </span>
                  </div>
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    variant="destructive"
                    className="w-full gap-1.5"
                    disabled={isLoggingOut}
                  >
                    <LogOut className="size-4" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
