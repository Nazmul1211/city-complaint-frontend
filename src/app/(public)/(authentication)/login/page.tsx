import { Building2, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "@/components/form/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left Form Column */}
      <div className="flex flex-col gap-6 p-6 md:p-10 justify-between">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold tracking-tight text-foreground hover:opacity-90"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25">
              <Building2 className="size-5" />
            </div>
            <span className="text-lg">CityCare</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full border">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>Secure Civic Auth</span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center py-6">
          <div className="w-full max-w-md">
            <Suspense
              fallback={
                <div className="h-96 flex items-center justify-center">
                  Loading login portal...
                </div>
              }
            >
              <LoginForm />
            </Suspense>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground flex justify-between items-center border-t pt-4">
          <span>CityCare Civic Platform © {new Date().getFullYear()}</span>
          <Link href="/terms" className="hover:underline">
            Civic Terms
          </Link>
        </div>
      </div>

      {/* Right Hero Column */}
      <div className="relative hidden bg-muted lg:block overflow-hidden">
        <Image
          src="/ui-image/citycareSignup.jpg"
          alt="CityCare Civic Infrastructure"
          fill
          priority
          className="object-cover dark:brightness-[0.25]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 flex flex-col justify-end p-12 text-white">
          <div className="max-w-md space-y-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
              Official City Council
            </span>
            <h2 className="text-3xl font-bold tracking-tight">
              Empowering Citizens, Connecting Departments.
            </h2>
            <p className="text-sm text-white/80 leading-relaxed">
              Report public infrastructure issues, monitor municipal service
              level agreements, and track repair casework in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
