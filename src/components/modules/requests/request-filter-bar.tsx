"use client";

import { LayoutGrid, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RequestFilterBarProps {
  statusTab: string;
  onStatusChange: (status: string) => void;
  priorityFilter: string;
  onPriorityChange: (priority: string) => void;
  searchTerm: string;
  onSearchChange: (search: string) => void;
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
}

const STATUS_TABS: [string, string][] = [
  ["ALL", "All"],
  ["SUBMITTED", "Submitted"],
  ["IN_PROGRESS", "In Progress"],
  ["RESOLVED", "Resolved"],
  ["REJECTED", "Rejected"],
];

const PRIORITY_OPTIONS: [string, string][] = [
  ["ALL", "All Priorities"],
  ["URGENT", "Urgent Priority"],
  ["HIGH", "High Priority"],
  ["MEDIUM", "Medium Priority"],
  ["LOW", "Low Priority"],
];

export function RequestFilterBar({
  statusTab,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
}: RequestFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search & Priority Select */}
      <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center sm:max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by case #, keyword or ward..."
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
          />
        </div>

        <select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-2.5 text-xs text-foreground outline-none transition-colors focus:border-ring focus:ring-1 focus:ring-ring"
        >
          {PRIORITY_OPTIONS.map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Status Tabs & View Toggle */}
      <div className="flex flex-wrap items-center gap-2">
        <Tabs value={statusTab} onValueChange={onStatusChange}>
          <TabsList>
            {STATUS_TABS.map(([val, label]) => (
              <TabsTrigger key={val} value={val}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* View Toggle */}
        <div className="flex items-center rounded-md border bg-muted/30 p-0.5">
          <Button
            type="button"
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon-xs"
            onClick={() => onViewModeChange("grid")}
            title="Card Grid View"
          >
            <LayoutGrid className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant={viewMode === "table" ? "default" : "ghost"}
            size="icon-xs"
            onClick={() => onViewModeChange("table")}
            title="Data Table View"
          >
            <List className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
