import { FileText, LifeBuoy, MapPin, Phone, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/60 bg-card py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Column 1: Brand & Description */}
          <div className="space-y-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative flex size-8 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-white p-0.5 shadow-xs shrink-0">
                <Image
                  src="/citycare_logo.jpeg"
                  alt="CityCare Logo"
                  width={32}
                  height={32}
                  className="size-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-foreground">
                  CityCare
                </span>
                <span className="-mt-1 text-[10px] text-muted-foreground font-medium">
                  Municipal Portal
                </span>
              </div>
            </Link>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Official municipal service portal for public complaint filing,
              transparent department routing, and SLA-backed civic resolution.
            </p>
          </div>

          {/* Column 2: Citizen Services */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-foreground">
              Citizen Services
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/dashboard/submit-request"
                  className="transition-colors hover:text-[#0284c7] dark:hover:text-[#38bdf8]"
                >
                  Report Civic Issue
                </Link>
              </li>
              <li>
                <Link
                  href="/track"
                  className="transition-colors hover:text-[#0284c7] dark:hover:text-[#38bdf8]"
                >
                  Track Complaint Status
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="transition-colors hover:text-[#0284c7] dark:hover:text-[#38bdf8]"
                >
                  Municipal Services Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/departments"
                  className="transition-colors hover:text-[#0284c7] dark:hover:text-[#38bdf8]"
                >
                  City Departments Directory
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-[#0284c7] dark:hover:text-[#38bdf8]"
                >
                  SLA Transparency Charter
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Portal Access */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-foreground">Portal Access</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/login"
                  className="transition-colors hover:text-[#0284c7] dark:hover:text-[#38bdf8]"
                >
                  Citizen Portal Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="transition-colors hover:text-[#0284c7] dark:hover:text-[#38bdf8]"
                >
                  Create Citizen Account
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-[#0284c7] dark:hover:text-[#38bdf8]"
                >
                  Ward Emergency Helplines
                </Link>
              </li>
              <li>
                <Link
                  href="/feedback"
                  className="transition-colors hover:text-[#0284c7] dark:hover:text-[#38bdf8]"
                >
                  Feedback & Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Municipal Standards */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-foreground">
              Municipal Standards
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <Shield className="size-3.5 text-[#0284c7] dark:text-[#38bdf8] shrink-0" />
                <span>SSL Encrypted Data Transit</span>
              </li>
              <li className="flex items-center gap-1.5">
                <FileText className="size-3.5 text-[#0284c7] dark:text-[#38bdf8] shrink-0" />
                <span>Audit-Logged Status Changes</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-[#0284c7] dark:text-[#38bdf8] shrink-0" />
                <span>GPS Ward Boundary Routing</span>
              </li>
              <li className="flex items-center gap-1.5">
                <LifeBuoy className="size-3.5 text-[#0284c7] dark:text-[#38bdf8] shrink-0" />
                <span>24/7 Automated Dispatch</span>
              </li>
            </ul>
          </div>

          {/* Column 5: Civic Hotline Card */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 rounded-2xl border border-sky-200/80 bg-sky-50/60 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#0284c7]/10 text-[#0284c7] dark:bg-[#38bdf8]/15 dark:text-[#38bdf8]">
                <Phone className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">
                  Civic Hotline
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Dial 333 or 999 for emergencies
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links with safe mobile padding */}
        <div className="mt-12 flex flex-col gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between pb-12 sm:pb-0">
          <p className="text-muted-foreground">
            © {currentYear} CityCare Municipal Corporation. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-[#0284c7] dark:hover:text-[#38bdf8]"
            >
              Privacy Policy
            </Link>
            <span className="text-border hidden sm:inline">•</span>
            <Link
              href="/terms"
              className="transition-colors hover:text-[#0284c7] dark:hover:text-[#38bdf8]"
            >
              Terms of Civic Engagement
            </Link>
            <span className="text-border hidden sm:inline">•</span>
            <Link
              href="/feedback"
              className="transition-colors hover:text-[#0284c7] dark:hover:text-[#38bdf8]"
            >
              Feedback & Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
