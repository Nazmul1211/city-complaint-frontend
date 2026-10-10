import {
  Building2,
  Clock,
  ExternalLink,
  Flame,
  LifeBuoy,
  Mail,
  MapPin,
  Phone,
  PhoneCall,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/form/contact-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact & Ward Emergency Helplines | CityCare Platform",
  description:
    "Contact municipal helpdesks, access 24/7 emergency utility hotlines, and submit citizen inquiries directly to local council authorities.",
};

const EMERGENCY_LINES = [
  {
    number: "999",
    name: "National Emergency",
    desc: "Police, Fire & Ambulance response",
    badge: "24/7 Priority",
    color: "red",
    icon: ShieldAlert,
  },
  {
    number: "333",
    name: "Citizen Grievances",
    desc: "Govt municipal services & complaints",
    badge: "Toll-Free",
    color: "sky",
    icon: PhoneCall,
  },
  {
    number: "16162",
    name: "WASA Water Line",
    desc: "Main pipeline burst & contamination",
    badge: "Water Emergency",
    color: "blue",
    icon: LifeBuoy,
  },
  {
    number: "16999",
    name: "Electricity Grid",
    desc: "Transformer blast & live wire hazard",
    badge: "Power Emergency",
    color: "amber",
    icon: Zap,
  },
];

const REGIONAL_COMMAND_CENTERS = [
  {
    zone: "Zone 1 & 2 (North)",
    coverage: "Mirpur, Uttara, Pallabi, Cantonment",
    phone: "+880 2-9851122",
  },
  {
    zone: "Zone 3 & 4 (Central)",
    coverage: "Gulshan, Banani, Tejgaon, Badda",
    phone: "+880 2-9883344",
  },
  {
    zone: "Zone 5 & 6 (South)",
    coverage: "Dhanmondi, Motijheel, Lalbagh, Old Dhaka",
    phone: "+880 2-9568123",
  },
  {
    zone: "24/7 Flood & Drainage Cell",
    coverage: "Monsoon Waterlogging & Sluice Gates",
    phone: "+880 2-9334455",
  },
];

export default function ContactPage() {
  return (
    <div className="py-8 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Hero */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/60 bg-sky-50/80 px-3.5 py-1 text-xs font-semibold text-sky-800 backdrop-blur-sm dark:border-sky-800/60 dark:bg-sky-950/40 dark:text-sky-300">
            <Phone className="size-3.5 text-sky-600 dark:text-sky-400" />
            <span>24/7 Municipal Helpdesk & Emergency Lines</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
            Contact City Hall &{" "}
            <span className="text-[#0284c7] dark:text-[#38bdf8]">
              Emergency Dispatch
            </span>
          </h1>

          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Have questions regarding municipal service delivery or experiencing an
            urgent neighborhood utility hazard? Reach our emergency dispatch centers
            or submit an official inquiry below.
          </p>
        </div>

        {/* 1-Tap Emergency Hotlines Strip */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EMERGENCY_LINES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.number}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-card p-5 shadow-sm transition-all hover:border-[#0284c7]/50 hover:shadow-md dark:border-slate-800/80 dark:bg-[#0c1427]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        item.color === "red"
                          ? "bg-rose-500/15 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-500/30"
                          : item.color === "amber"
                          ? "bg-amber-500/15 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-500/30"
                          : "bg-sky-500/15 text-[#0284c7] dark:bg-sky-950/60 dark:text-sky-300 border border-sky-500/30"
                      }`}
                    >
                      {item.badge}
                    </span>
                    <Icon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>

                  <div className="mt-3">
                    <span className="font-mono text-2xl font-extrabold text-foreground group-hover:text-[#0284c7] dark:group-hover:text-[#38bdf8] transition-colors">
                      {item.number}
                    </span>
                    <h3 className="mt-0.5 text-xs font-bold text-foreground">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50">
                  <a
                    href={`tel:${item.number}`}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#0284c7] px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0369a1] transition-colors dark:bg-[#0284c7] dark:hover:bg-[#0369a1]"
                  >
                    <PhoneCall className="size-3.5" />
                    <span>Call {item.number} Now</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Two-Column Grid: Headquarters & Regional Directory vs Message Form */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Office Details & Regional Command Centers (5 cols) */}
          <div className="space-y-6 lg:col-span-5">
            {/* Municipal Executive Headquarters */}
            <div className="rounded-2xl border border-slate-200/90 bg-card p-6 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
              <div className="flex items-center gap-2.5 pb-4 border-b border-border/60">
                <div className="flex size-9 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7] dark:bg-sky-950/60 dark:text-[#38bdf8]">
                  <Building2 className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    City Executive Secretariat
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Central Municipal Administrative Office
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-4 text-xs text-muted-foreground">
                <div className="flex items-start gap-3">
                  <MapPin className="size-4 shrink-0 text-[#0284c7] dark:text-[#38bdf8] mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">
                      Central City Hall
                    </p>
                    <p className="mt-0.5 leading-relaxed">
                      Nagar Bhaban, Phoenix Road, Dhaka-1000, Bangladesh
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="size-4 shrink-0 text-[#0284c7] dark:text-[#38bdf8] mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">
                      Administrative Switchboard
                    </p>
                    <p className="mt-0.5 leading-relaxed font-mono">
                      +880 2-9568123 (Sun – Thu, 9:00 AM – 5:00 PM)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="size-4 shrink-0 text-[#0284c7] dark:text-[#38bdf8] mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">
                      Official Communications
                    </p>
                    <p className="mt-0.5 leading-relaxed font-mono">
                      info@citycare.gov.bd
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="size-4 shrink-0 text-[#0284c7] dark:text-[#38bdf8] mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">
                      Public Grievance In-Person Walk-ins
                    </p>
                    <p className="mt-0.5 leading-relaxed">
                      10:00 AM – 1:00 PM every working day (Ground Floor Desk 4)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Ward Command Centers */}
            <div className="rounded-2xl border border-slate-200/90 bg-card p-6 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
              <div className="flex items-center gap-2.5 pb-4 border-b border-border/60">
                <div className="flex size-9 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7] dark:bg-sky-950/60 dark:text-[#38bdf8]">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Regional Dispatch Desks
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Zonal operations & emergency contact lines
                  </p>
                </div>
              </div>

              <div className="mt-4 divide-y divide-border/50 text-xs">
                {REGIONAL_COMMAND_CENTERS.map((center) => (
                  <div key={center.zone} className="py-2.5 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">
                        {center.zone}
                      </span>
                      <a
                        href={`tel:${center.phone}`}
                        className="font-mono font-semibold text-[#0284c7] hover:underline dark:text-[#38bdf8]"
                      >
                        {center.phone}
                      </a>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {center.coverage}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Expectation Callout */}
            <div className="rounded-2xl border border-sky-300/40 bg-sky-50/50 p-4 text-xs text-sky-900 dark:border-sky-800/40 dark:bg-sky-950/30 dark:text-sky-200">
              <p className="font-bold">⚡ Notice on Grievance Dispatch</p>
              <p className="mt-1 leading-relaxed text-[11px] text-sky-800 dark:text-sky-300">
                General inquiries submitted below receive an answer within 24
                hours. If you are reporting an active road cave-in, contaminated
                water, or overflowing garbage, please file a ticket on the portal
                for automated GPS dispatch and SLA tracking.
              </p>
            </div>
          </div>

          {/* Right Column: Send Message Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200/90 bg-card p-6 sm:p-8 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
              <div className="pb-5 border-b border-border/60">
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  Send a Message to the City Council
                </h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Use this form for non-emergency inquiries, policy suggestions,
                  or citizen feedback. For complaints requiring physical on-site
                  repairs, please file a service request.
                </p>
              </div>

              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
