import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileCheck2,
  FileText,
  RotateCcw,
  Scale,
  Shield,
  ShieldAlert,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Civic Engagement & Service Charter | CityCare Platform",
  description:
    "Review statutory citizen rights, complaint filing rules, mandatory photo proof standards, and 48-hour case reopening rights on CityCare.",
};

export default function TermsPage() {
  return (
    <div className="py-8 md:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/60 bg-sky-50/80 px-3.5 py-1 text-xs font-semibold text-sky-800 backdrop-blur-sm dark:border-sky-800/60 dark:bg-sky-950/40 dark:text-sky-300">
            <Scale className="size-3.5 text-sky-600 dark:text-sky-400" />
            <span>Statutory Civic Rights & Service Charter</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
            Terms of{" "}
            <span className="text-[#0284c7] dark:text-[#38bdf8]">
              Civic Engagement
            </span>
          </h1>

          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            These terms define the mutual covenant between citizens and municipal
            authorities. Our governance model grants citizens legal transparency,
            enforceable turnaround SLAs, and guaranteed rights to inspect completed work.
          </p>

          <p className="text-xs font-mono text-muted-foreground">
            Version 2.4 • Applicable Across All 54 Municipal Wards • Last Updated: October 2026
          </p>
        </div>

        {/* 3 Core Guarantees */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/90 bg-card p-5 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
            <div className="flex size-9 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7] dark:bg-sky-950/60 dark:text-[#38bdf8] mb-3">
              <Clock className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              Guaranteed SLA
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Every complaint is auto-triaged and assigned statutory turnaround
              deadlines (4h to 48h) depending on severity.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-card p-5 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
            <div className="flex size-9 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7] dark:bg-sky-950/60 dark:text-[#38bdf8] mb-3">
              <FileCheck2 className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              Photo Evidence Proof
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Municipal technicians cannot mark tickets resolved without
              attaching time-stamped on-site photo proof.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-card p-5 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
            <div className="flex size-9 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7] dark:bg-sky-950/60 dark:text-[#38bdf8] mb-3">
              <RotateCcw className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              48h Reopen Right
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              If repairs are incomplete or poorly constructed, citizens hold the
              guaranteed right to reopen the case in 1 click.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8 divide-y divide-border/60">
          {/* Section 1 */}
          <section className="space-y-3 pt-6 first:pt-0">
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              1. Acceptance & Statutory Scope
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
              By accessing the CityCare portal or submitting a public service complaint,
              you enter into a civic agreement governed by the Local Government (City
              Corporation) Act and the Citizen Redressal Regulations. This portal is
              available to all residents, commuters, and property owners across the
              metropolitan area.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 pt-6">
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              2. Citizen Obligations for Accurate Reporting
            </h2>
            <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
              <p>
                To maintain rapid emergency dispatch and protect public resources:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong className="text-foreground">Authentic Reporting:</strong>{" "}
                  Submissions must describe genuine public hazards on public roads,
                  drainage lines, power poles, or municipal property.
                </li>
                <li>
                  <strong className="text-foreground">Evidence Standard:</strong>{" "}
                  Complainants are requested to upload clear, unaltered photographs
                  demonstrating the defect and its surrounding landmarks.
                </li>
                <li>
                  <strong className="text-foreground">Accurate Geotagging:</strong>{" "}
                  Ensure the map marker accurately represents the location of the issue
                  to prevent misdirected field crews.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 pt-6">
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              3. Municipal Response & Enforceable SLAs
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
              Municipal departments are legally obligated to acknowledge complaints within
              stated timeframes:
            </p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs pt-1">
              <div className="rounded-xl border border-border/80 bg-muted/30 p-3 space-y-1">
                <span className="font-bold text-foreground block">
                  Urgent Class (Water Bursts, Power Faults):
                </span>
                <span className="text-muted-foreground block">
                  First response within 4–6 hours; on-site isolation within 12 hours.
                </span>
              </div>
              <div className="rounded-xl border border-border/80 bg-muted/30 p-3 space-y-1">
                <span className="font-bold text-foreground block">
                  Standard Class (Potholes, Dumpsters, Trees):
                </span>
                <span className="text-muted-foreground block">
                  Triage within 12–24 hours; repair completed within 24–48 hours.
                </span>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 pt-6">
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              4. Mandatory Photographic Sign-Off
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
              Under CityCare protocols, a field crew cannot close an open complaint
              unilaterally. The assigned lead technician must upload a verified
              high-resolution photograph displaying the repaired roadway, cleared
              drain, or functioning luminaire. All photos become part of the public
              audit trail.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 pt-6">
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              5. The 48-Hour Citizen Reopening Guarantee
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
              Upon receiving a resolution notice, the complainant holds 48 hours to
              inspect the physical repair. If asphalt cracks, a patched sewer re-clogs,
              or work was left incomplete, the citizen can click "Reopen Case" to trigger
              an automatic escalation to the Zonal Executive Engineer without having
              to draft a new petition.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 pt-6">
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              6. Prohibited Abuse & False Alarm Sanctions
            </h2>
            <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
              <p>
                To safeguard emergency dispatch bandwidth, the following are strictly
                prohibited:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li>Automated bot submissions or denial-of-service spam.</li>
                <li>False alarms regarding fabricated gas leaks or collapse hazards.</li>
                <li>Commercial advertisements disguised as service requests.</li>
                <li>Harassment, profanity, or defamatory accusations directed at civil servants.</li>
              </ul>
              <p className="text-[11px] text-muted-foreground pt-1">
                Violators are subject to IP blocking, telephone verification blacklisting,
                and administrative fines under Section 93 of the Municipal Code.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 pt-6">
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              7. Dispute Resolution & Citizen Ombudsman
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
              For contested decisions, recurring failures, or departmental disputes,
              citizens may submit an appeal directly to the Independent Municipal
              Ombudsman at Nagar Bhaban or via email at{" "}
              <strong className="text-foreground">ombudsman@citycare.gov.bd</strong>.
            </p>
          </section>
        </div>

        {/* Back Link */}
        <div className="pt-4 flex justify-between items-center text-xs">
          <Link
            href="/privacy-policy"
            className="font-semibold text-[#0284c7] hover:underline dark:text-[#38bdf8]"
          >
            ← View Privacy Policy
          </Link>
          <Link
            href="/feedback"
            className="font-semibold text-[#0284c7] hover:underline dark:text-[#38bdf8]"
          >
            Go to Feedback & Help Center →
          </Link>
        </div>
      </div>
    </div>
  );
}
