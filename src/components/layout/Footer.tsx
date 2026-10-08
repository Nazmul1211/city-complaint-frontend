import {
  Building2,
  FileText,
  LifeBuoy,
  MapPin,
  Phone,
  Shield,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand & Mission */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Building2 className="size-4" />
              </div>
              <span className="text-base font-bold tracking-tight text-foreground">
                CityCare
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Official municipal service portal for public complaint filing,
              transparent department routing, and SLA-backed civic resolution.
            </p>
            <div className="mt-2 flex items-center gap-2 rounded-md border border-border bg-background p-2.5 text-xs text-muted-foreground">
              <Phone className="size-4 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Civic Hotline</p>
                <p className="text-[11px]">Dial 333 or 999 for emergencies</p>
              </div>
            </div>
          </div>

          {/* Citizen Services */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Citizen Services
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/dashboard/submit-request"
                  className="hover:text-primary transition-colors"
                >
                  Report Civic Issue
                </Link>
              </li>
              <li>
                <Link
                  href="/track"
                  className="hover:text-primary transition-colors"
                >
                  Track Complaint Status
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-primary transition-colors"
                >
                  Municipal Departments
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary transition-colors"
                >
                  SLA Transparency Charter
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Ward Emergency Helplines
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals & Roles */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Portal Access
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/login"
                  className="hover:text-primary transition-colors"
                >
                  Citizen Portal Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-primary transition-colors"
                >
                  Create Citizen Account
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-primary transition-colors"
                >
                  Field Staff & Technicians
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-primary transition-colors"
                >
                  Admin Dispatch Console
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-primary transition-colors"
                >
                  One-Click Demo Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Compliance */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Municipal Standards
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <Shield className="size-3.5 text-primary shrink-0" />
                <span>SSL Encrypted Data Transit</span>
              </li>
              <li className="flex items-center gap-1.5">
                <FileText className="size-3.5 text-primary shrink-0" />
                <span>Audit-Logged Status Changes</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-primary shrink-0" />
                <span>GPS Ward Boundary Routing</span>
              </li>
              <li className="flex items-center gap-1.5">
                <LifeBuoy className="size-3.5 text-primary shrink-0" />
                <span>24/7 Serverless Dispatch</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>
            &copy; {currentYear} CityCare Municipal Corporation. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/about"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/about"
              className="hover:text-primary transition-colors"
            >
              Terms of Civic Engagement
            </Link>
            <Link
              href="/contact"
              className="hover:text-primary transition-colors"
            >
              Feedback & Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
