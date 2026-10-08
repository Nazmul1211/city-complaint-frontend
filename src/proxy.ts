import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function getJwtRole(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(base64, "base64").toString("utf-8");
    const payload = JSON.parse(json);
    return payload?.role || null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/staff");

  // If visiting protected route without an accessToken cookie, redirect to login
  if (isProtected) {
    if (!accessToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = getJwtRole(accessToken);

    // Role-based route enforcement
    if (pathname.startsWith("/admin")) {
      if (role && role !== "ADMIN" && role !== "SUPER_ADMIN") {
        const dest = role === "STAFF" ? "/staff" : "/dashboard";
        return NextResponse.redirect(new URL(dest, request.url));
      }
    }

    if (pathname.startsWith("/staff")) {
      if (role && role !== "STAFF" && role !== "SUPER_ADMIN") {
        const dest = role === "ADMIN" ? "/admin" : "/dashboard";
        return NextResponse.redirect(new URL(dest, request.url));
      }
    }

    if (pathname.startsWith("/dashboard")) {
      if (role && role !== "CITIZEN" && role !== "SUPER_ADMIN") {
        const dest = role === "ADMIN" ? "/admin" : "/staff";
        return NextResponse.redirect(new URL(dest, request.url));
      }
    }
  }

  // If already logged in and visiting auth pages, send to designated dashboard
  if ((pathname === "/login" || pathname === "/register") && accessToken) {
    const role = getJwtRole(accessToken);
    let target = "/dashboard";
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      target = "/admin";
    } else if (role === "STAFF") {
      target = "/staff";
    }
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const middleware = proxy;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/staff/:path*",
    "/login",
    "/register",
  ],
};
