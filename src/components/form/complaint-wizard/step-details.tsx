"use client";

import { AlertTriangle, HelpCircle, Wrench } from "lucide-react";
import type { RequestPriority, RequestType } from "@/types";

interface StepDetailsProps {
  type: RequestType;
  priority: RequestPriority;
  title: string;
  description: string;
  onChange: (fields: {
    type?: RequestType;
    priority?: RequestPriority;
    title?: string;
    description?: string;
  }) => void;
}

const TYPE_OPTIONS: {
  value: RequestType;
  label: string;
  desc: string;
  icon: typeof AlertTriangle;
}[] = [
  {
    value: "COMPLAINT",
    label: "Civic Complaint",
    desc: "Damage, hazard, disruption, or failure of municipal service.",
    icon: AlertTriangle,
  },
  {
    value: "SERVICE",
    label: "Service Request",
    desc: "Routine scheduled service, bin delivery, or municipal permit.",
    icon: Wrench,
  },
  {
    value: "INFORMATION",
    label: "Public Inquiry",
    desc: "Clarification or statutory inquiry regarding ward operations.",
    icon: HelpCircle,
  },
];

const PRIORITY_OPTIONS: {
  value: RequestPriority;
  label: string;
  desc: string;
  badgeClass: string;
}[] = [
  {
    value: "LOW",
    label: "Low",
    desc: "Minor cosmetic issue; no safety risk.",
    badgeClass: "bg-muted text-foreground border-border",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    desc: "Standard inconvenience; normal SLA.",
    badgeClass:
      "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
  },
  {
    value: "HIGH",
    label: "High",
    desc: "Affects multiple residents; expedited triage.",
    badgeClass:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
  {
    value: "URGENT",
    label: "Urgent",
    desc: "Imminent danger or blocked transit artery.",
    badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
  },
];

export function StepDetails({
  type,
  priority,
  title,
  description,
  onChange,
}: StepDetailsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-foreground">
          Step 3: Issue Details & Urgency
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Provide specific details about the issue so the case officer can
          assess equipment requirements and field urgency accurately.
        </p>
      </div>

      {/* Request Type Selection */}
      <div className="space-y-2">
        <span className="block text-xs font-medium text-foreground">
          Request Classification <span className="text-destructive">*</span>
        </span>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {TYPE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = type === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ type: opt.value })}
                className={`flex flex-col items-start rounded-lg border p-3 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-card hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    className={`size-4 ${
                      isSelected ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span className="text-xs font-semibold text-foreground">
                    {opt.label}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {opt.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Priority Level */}
      <div className="space-y-2">
        <span className="block text-xs font-medium text-foreground">
          Estimated Priority Level <span className="text-destructive">*</span>
        </span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PRIORITY_OPTIONS.map((opt) => {
            const isSelected = priority === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ priority: opt.value })}
                className={`flex flex-col items-start rounded-lg border p-2.5 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-card hover:bg-muted/30"
                }`}
              >
                <span
                  className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold ${opt.badgeClass}`}
                >
                  {opt.label.toUpperCase()}
                </span>
                <p className="mt-1.5 text-[11px] text-muted-foreground line-clamp-2">
                  {opt.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <label
          htmlFor="title-input"
          className="text-xs font-medium text-foreground"
        >
          Complaint Subject / Title <span className="text-destructive">*</span>
        </label>
        <input
          id="title-input"
          type="text"
          required
          value={title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. Deep asphalt crater causing traffic congestion near school gate"
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
        />
        <p className="text-[11px] text-muted-foreground">
          At least 5 characters. Be clear and descriptive.
        </p>
      </div>

      {/* Detailed Description */}
      <div className="space-y-1.5">
        <label
          htmlFor="description-input"
          className="text-xs font-medium text-foreground"
        >
          Detailed Description <span className="text-destructive">*</span>
        </label>
        <textarea
          id="description-input"
          required
          rows={5}
          value={description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Provide specific observations: How long has this existed? Is there immediate danger to vehicles or pedestrians? Has any temporary warning been put in place?"
          className="w-full rounded-md border border-input bg-background p-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
        />
        <p className="text-[11px] text-muted-foreground">
          At least 10 characters. Detailed reports reduce back-and-forth
          inspection delays.
        </p>
      </div>
    </div>
  );
}
