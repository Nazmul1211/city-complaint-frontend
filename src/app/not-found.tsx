"use client";

import {
  ArrowRight,
  Compass,
  FileQuestion,
  Home,
  MapPin,
  PhoneCall,
  PlusCircle,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // If query looks like a ticket/request number, go to /track
    if (
      searchQuery.toUpperCase().includes("REQ") ||
      searchQuery.toUpperCase().includes("CR")
    ) {
      router.push(`/track?ticket=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-background via-muted/15 to-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl w-full mx-auto my-auto space-y-8 text-center py-12">
        {/* Visual Badge & Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
          <div className="relative size-24 rounded-3xl bg-gradient-to-br from-primary/15 via-background to-muted border border-border shadow-xl flex items-center justify-center text-primary">
            <Compass className="size-12 animate-spin [animation-duration:12s]" />
          </div>
        </div>

        {/* Headings */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <MapPin className="size-3.5" />
            404 Error • Municipal Registry Relocation
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Ward or Page Not Found
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            The civic service, ticket, or departmental terminal you are trying
            to access has been relocated, archived, or does not exist in the
            municipal directory.
          </p>
        </div>

        {/* Fast Ticket & Service Search */}
        <form
          onSubmit={handleSearchSubmit}
          className="max-w-md mx-auto flex items-center gap-2 bg-card p-1.5 rounded-xl border border-border/80 shadow-md focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all"
        >
          <Search className="size-4 text-muted-foreground ml-3 shrink-0" />
          <Input
            type="text"
            placeholder="Search service, ward, or Complaint #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 text-xs sm:text-sm h-9 bg-transparent"
          />
          <Button
            type="submit"
            size="sm"
            className="h-9 px-4 text-xs font-semibold shrink-0"
          >
            Search
          </Button>
        </form>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-2xl mx-auto text-left pt-2">
          <Link href="/">
            <Card className="h-full border-border/70 hover:border-primary/50 hover:bg-muted/30 transition-all group cursor-pointer shadow-xs">
              <CardContent className="p-4 space-y-2">
                <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Home className="size-4" />
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-foreground flex items-center justify-between">
                  Return Home
                  <ArrowRight className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Head back to the CityCare civic portal homepage.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/track">
            <Card className="h-full border-border/70 hover:border-primary/50 hover:bg-muted/30 transition-all group cursor-pointer shadow-xs">
              <CardContent className="p-4 space-y-2">
                <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileQuestion className="size-4" />
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-foreground flex items-center justify-between">
                  Track Ticket
                  <ArrowRight className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Look up real-time complaint status via tracking number.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/submit-request">
            <Card className="h-full border-border/70 hover:border-primary/50 hover:bg-muted/30 transition-all group cursor-pointer shadow-xs">
              <CardContent className="p-4 space-y-2">
                <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <PlusCircle className="size-4" />
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-foreground flex items-center justify-between">
                  File Complaint
                  <ArrowRight className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Report a new public infrastructure or civic concern.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Emergency Hotlines Strip */}
        <div className="pt-6 border-t border-border/60 max-w-xl mx-auto flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 font-medium">
            <PhoneCall className="size-3.5 text-primary" />
            <span>Emergency Services:</span>
          </div>
          <span className="font-mono">
            Central Hotline: <strong className="text-foreground">16106</strong>
          </span>
          <span className="font-mono">
            WASA Desk: <strong className="text-foreground">16162</strong>
          </span>
          <span className="font-mono">
            National SOS: <strong className="text-foreground">999</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
