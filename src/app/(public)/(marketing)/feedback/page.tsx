"use client";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  LifeBuoy,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const FAQS = [
  {
    q: "How do I track my complaint without logging in?",
    a: "You can track any public complaint immediately by visiting the Track page (/track) and entering your unique tracking number (e.g. REQ-2026-0891). You'll instantly see department routing, technician work logs, and before/after photos.",
  },
  {
    q: "What if a repair was done poorly or the problem reoccurs?",
    a: "Under our 48-Hour Citizen Reopening Guarantee, you have 48 hours following resolution notice to inspect the work. If the repair is inadequate, you can reopen the ticket directly with 1 click to trigger escalation to the Zonal Executive Engineer.",
  },
  {
    q: "Are municipal complaint filings free of charge?",
    a: "Yes. All standard public grievance reports—including road potholes, streetlights, drainage overflows, water leaks, and neighborhood waste dumping—are 100% free of charge.",
  },
  {
    q: "How long does each department have to respond?",
    a: "Statutory response SLAs vary by severity. Urgent water leaks and electrical hazards require initial response within 4–6 hours. Standard roadway potholes and waste collection require action within 24–48 hours.",
  },
  {
    q: "Who verifies that a complaint is actually resolved?",
    a: "Field technicians cannot close a ticket unilaterally. They must upload time-stamped on-site photo proof. Both the supervisory case officer and the complainant review this evidence.",
  },
  {
    q: "Can I report issues in any municipal ward?",
    a: "Yes. CityCare covers all 54 wards of the metropolitan area. Our automated GIS engine uses your GPS pin or address selection to route the ticket to the exact ward councilor and zonal maintenance team.",
  },
];

export default function FeedbackHelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [rating, setRating] = useState<number>(5);
  const [department, setDepartment] = useState("Public Works (Roads)");
  const [ticketNo, setTicketNo] = useState("");
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comments.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="py-8 md:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Hero */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/60 bg-sky-50/80 px-3.5 py-1 text-xs font-semibold text-sky-800 backdrop-blur-sm dark:border-sky-800/60 dark:bg-sky-950/40 dark:text-sky-300">
            <LifeBuoy className="size-3.5 text-sky-600 dark:text-sky-400" />
            <span>Citizen Feedback & Support Portal</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
            Feedback &{" "}
            <span className="text-[#0284c7] dark:text-[#38bdf8]">
              Help Center
            </span>
          </h1>

          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Find answers to frequently asked questions regarding municipal
            operations, or share your civic experience to help us improve service
            delivery across all 54 city wards.
          </p>
        </div>

        {/* 3 Quick Help Channels */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/90 bg-card p-5 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
            <div className="flex size-9 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7] dark:bg-sky-950/60 dark:text-[#38bdf8] mb-3">
              <Phone className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              Call Hotline 333
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Toll-free municipal call center available 24/7 for phone-assisted
              complaint filing and emergency dispatch.
            </p>
            <a
              href="tel:333"
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0284c7] hover:underline dark:text-[#38bdf8]"
            >
              Dial 333 <ArrowRight className="size-3" />
            </a>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-card p-5 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
            <div className="flex size-9 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7] dark:bg-sky-950/60 dark:text-[#38bdf8] mb-3">
              <MessageSquare className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              Track Any Case Online
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              No account required. Check real-time technician movements, SLA
              benchmarks, and before/after photo proof.
            </p>
            <Link
              href="/track"
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0284c7] hover:underline dark:text-[#38bdf8]"
            >
              Open Tracker <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-card p-5 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
            <div className="flex size-9 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7] dark:bg-sky-950/60 dark:text-[#38bdf8] mb-3">
              <ShieldCheck className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              In-Person Walk-in Desk
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Visit Nagar Bhaban Ground Floor Desk 4 every working day between
              10:00 AM and 1:00 PM for ombudsman assistance.
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0284c7] hover:underline dark:text-[#38bdf8]"
            >
              View City Hall Directions <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* Two-Column: FAQ Accordion on Left, Feedback Form on Right */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: FAQ Accordion (7 cols) */}
          <div className="space-y-6 lg:col-span-7">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Common questions regarding complaint tracking, SLA guarantees, and
                municipal procedures.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={faq.q}
                    className="overflow-hidden rounded-2xl border border-slate-200/90 bg-card shadow-sm transition-all dark:border-slate-800/80 dark:bg-[#0c1427]"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-foreground transition-colors hover:text-[#0284c7] dark:hover:text-[#38bdf8]"
                    >
                      <span className="pr-4">{faq.q}</span>
                      <ChevronDown
                        className={`size-4 shrink-0 transition-transform text-muted-foreground ${
                          isOpen ? "rotate-180 text-[#0284c7]" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-border/50 px-4 pb-4 pt-3 text-xs leading-relaxed text-muted-foreground">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Citizen Feedback Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200/90 bg-card p-6 shadow-sm dark:border-slate-800/80 dark:bg-[#0c1427]">
              <div className="flex items-center gap-2 pb-4 border-b border-border/60">
                <div className="flex size-8 items-center justify-center rounded-xl bg-sky-50 text-[#0284c7] dark:bg-sky-950/60 dark:text-[#38bdf8]">
                  <ThumbsUp className="size-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Citizen Service Feedback
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Your feedback directly shapes city governance
                  </p>
                </div>
              </div>

              {submitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-6" />
                  </div>
                  <h4 className="text-base font-bold text-foreground">
                    Thank You for Your Feedback!
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    Your input has been recorded and forwarded to the Municipal
                    Quality Assurance Secretariat.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSubmitted(false);
                      setComments("");
                    }}
                    className="mt-2 text-xs"
                  >
                    Submit Another Response
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmitFeedback} className="mt-5 space-y-4 text-xs">
                  {/* Rating Selector */}
                  <div>
                    <label className="block font-semibold text-foreground mb-1.5">
                      How would you rate municipal responsiveness?
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setRating(val)}
                          className={`flex size-8 items-center justify-center rounded-lg border transition-all ${
                            val <= rating
                              ? "border-amber-400 bg-amber-500/15 text-amber-500"
                              : "border-border text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          <Star className="size-4 fill-current" />
                        </button>
                      ))}
                      <span className="ml-2 font-mono font-bold text-muted-foreground">
                        {rating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      Department or Service Area
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="h-9 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground outline-none focus:border-[#0284c7]"
                    >
                      <option>Public Works & Road Maintenance</option>
                      <option>Water Supply & WASA</option>
                      <option>Solid Waste & Dumpster Management</option>
                      <option>Electrical & Street Lighting</option>
                      <option>Public Health & Mosquito Fogging</option>
                      <option>Citizen Web Portal & Mobile App</option>
                    </select>
                  </div>

                  {/* Ticket Number (Optional) */}
                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      Complaint Reference Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={ticketNo}
                      onChange={(e) => setTicketNo(e.target.value)}
                      placeholder="e.g. REQ-2026-0891"
                      className="h-9 w-full rounded-xl border border-input bg-background px-3 font-mono text-xs text-foreground outline-none focus:border-[#0284c7]"
                    />
                  </div>

                  {/* Comments */}
                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      Your Experience & Suggestions
                    </label>
                    <textarea
                      rows={3}
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      required
                      placeholder="Tell us what went well or what municipal crews can improve..."
                      className="w-full rounded-xl border border-input bg-background p-3 text-xs text-foreground outline-none focus:border-[#0284c7]"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="sm"
                    className="w-full gap-1.5 rounded-xl bg-[#0284c7] font-semibold text-white shadow-sm hover:bg-[#0369a1] dark:bg-[#0284c7] dark:hover:bg-[#0369a1]"
                  >
                    <Send className="size-3.5" />
                    <span>Submit Citizen Feedback</span>
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
