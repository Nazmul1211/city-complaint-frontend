import {
  Clock,
  Eye,
  FileCheck2,
  Lock,
  Mail,
  MapPin,
  Shield,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Citizen Privacy Policy & Data Protection | CityCare Platform",
  description:
    "Learn how CityCare protects citizen identity, geo-location data, and photographic proof while ensuring transparent municipal grievance tracking.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-8 md:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/60 bg-sky-50/80 px-3.5 py-1 text-xs font-semibold text-sky-800 backdrop-blur-sm dark:border-sky-800/60 dark:bg-sky-950/40 dark:text-sky-300">
            <ShieldCheck className="size-3.5 text-sky-600 dark:text-sky-400" />
            <span>Citizen Data Protection & Transparency</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
            CityCare Citizen{" "}
            <span className="text-[#0284c7] dark:text-[#38bdf8]">
              Privacy Policy
            </span>
          </h1>

          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            This Privacy Charter outlines how the CityCare Municipal Corporation
            collects, safeguards, and processes citizen data. We are dedicated to
            maintaining open public governance while fiercely guarding individual
            citizen privacy.
          </p>

          <p className="text-xs font-mono text-muted-foreground">
            Effective Date: January 1, 2026 • Statutory Oversight: Municipal Corporation Digital Governance Charter
          </p>
        </div>

        {/* Core Privacy Highlights */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/90 bg-card p-5 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
            <div className="flex size-9 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7] dark:bg-sky-950/60 dark:text-[#38bdf8] mb-3">
              <Lock className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              Redacted Identity
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Your phone number, email, and personal identification are never
              displayed on public maps or public tracking feeds.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-card p-5 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
            <div className="flex size-9 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7] dark:bg-sky-950/60 dark:text-[#38bdf8] mb-3">
              <MapPin className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              Purpose-Bound GPS
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Geo-coordinates are used strictly to route municipal technicians
              and equipment to the precise road, drain, or utility fault.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-card p-5 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
            <div className="flex size-9 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7] dark:bg-sky-950/60 dark:text-[#38bdf8] mb-3">
              <Eye className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              Immutable Audit Logs
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Status changes and technician photo uploads are preserved in an
              auditable log to eliminate backroom delays or falsified work.
            </p>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8 divide-y divide-border/60">
          {/* Section 1 */}
          <section className="space-y-3 pt-6 first:pt-0">
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              1. Information We Collect
            </h2>
            <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
              <p>
                When you interact with the CityCare portal, we collect minimal
                information necessary to facilitate municipal grievance redressal:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong className="text-foreground">Service Request Data:</strong>{" "}
                  Description of the issue, category (e.g. road pothole, sewer blockage),
                  time of incident, and ward location.
                </li>
                <li>
                  <strong className="text-foreground">Photographic Evidence:</strong>{" "}
                  Images uploaded by complainants or field technicians illustrating the
                  civic hazard or completed repair.
                </li>
                <li>
                  <strong className="text-foreground">Contact Details:</strong>{" "}
                  Mobile number or email address provided during submission solely for
                  delivering automated SMS status notifications and SLA updates.
                </li>
                <li>
                  <strong className="text-foreground">Technical Telemetry:</strong>{" "}
                  Browser user agent, IP address for bot/rate-limit defense, and session
                  identifiers.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 pt-6">
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              2. Public vs. Confidential Data Segregation
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
              To balance civic transparency with personal privacy, CityCare enforces
              a strict separation of data:
            </p>
            <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-2 text-xs">
              <p className="font-semibold text-foreground">
                Publicly Visible Information:
              </p>
              <p className="text-muted-foreground">
                Complaint tracking ID (e.g. REQ-2026-0891), issue category, ward sector,
                anonymized street location, status milestones, and before/after verification
                photographs.
              </p>
              <p className="font-semibold text-foreground pt-2 border-t border-border/50">
                Strictly Confidential Information:
              </p>
              <p className="text-muted-foreground">
                Complainant real name, phone number, residential apartment number, and
                email are accessible only to authorized municipal case officers and
                assigned emergency dispatch teams.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 pt-6">
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              3. Photographic Evidence & Redaction Policy
            </h2>
            <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
              <p>
                Photographic evidence is essential to eliminate phantom repairs and verify
                taxpayer-funded maintenance work. If an uploaded photo inadvertently captures
                a private residence interior, vehicle license plate, or pedestrian face:
              </p>
              <p>
                Citizens may contact the grievance desk within 48 hours to request digital
                blurring or redaction while preserving the underlying civic damage evidence.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 pt-6">
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              4. Payment & Financial Data Security
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
              For commercial municipal services (e.g. bulk construction debris hauling)
              that require statutory inspection fees, payments are processed directly
              via PCI-DSS certified national gateways including bKash and Nagad.
              CityCare does not store or process payment card numbers or mobile banking PINs.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 pt-6">
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              5. Citizen Rights & 48-Hour Reopening Window
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
              Under the Municipal Transparency Charter, every complainant holds the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
              <li>Inspect complete chronological audit logs of their complaints.</li>
              <li>Exercise guaranteed 48-hour case reopening if repair work fails or proves substandard.</li>
              <li>Request anonymization or deletion of contact data upon case finalization.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 pt-6">
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              6. Contact Data Protection Officer
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
              If you have inquiries regarding how your data is handled or wish to exercise
              privacy rights, contact our Data Protection Secretariat:
            </p>
            <div className="rounded-xl border border-slate-200/90 bg-card p-4 dark:border-slate-800/80 dark:bg-[#0c1427] text-xs space-y-1">
              <p className="font-bold text-foreground">
                Municipal Data Protection & Grievance Ombudsman
              </p>
              <p className="text-muted-foreground">
                Nagar Bhaban, Phoenix Road, Dhaka-1000, Bangladesh
              </p>
              <p className="font-mono text-[#0284c7] dark:text-[#38bdf8]">
                Email: privacy@citycare.gov.bd • Phone: +880 2-9568123 (Ext 402)
              </p>
            </div>
          </section>
        </div>

        {/* Back Link */}
        <div className="pt-4 flex justify-between items-center text-xs">
          <Link
            href="/"
            className="font-semibold text-[#0284c7] hover:underline dark:text-[#38bdf8]"
          >
            ← Return to Homepage
          </Link>
          <Link
            href="/terms"
            className="font-semibold text-[#0284c7] hover:underline dark:text-[#38bdf8]"
          >
            View Terms of Civic Engagement →
          </Link>
        </div>
      </div>
    </div>
  );
}
