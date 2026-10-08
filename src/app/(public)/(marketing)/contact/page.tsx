import {
  Building2,
  Clock,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
} from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/form/contact-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact & Ward Emergency Helplines | CityCare Platform",
  description:
    "Contact municipal helpdesks, access 24/7 emergency utility hotlines, and submit citizen inquiries directly to local council authorities.",
};

export default function ContactPage() {
  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Contact Municipal Helpdesk & Emergency Lines
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Have questions regarding municipal service delivery or experiencing
            an urgent neighborhood emergency? Reach our dispatch center or send
            a message below.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Emergency & Municipal Contact Information (5 columns) */}
          <div className="space-y-6 lg:col-span-5">
            {/* Urgent Hotline Card */}
            <Card className="border border-destructive/20 bg-destructive/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-destructive">
                  <ShieldAlert className="size-5 shrink-0" />
                  Urgent Civic Helplines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-semibold text-foreground">
                    National Emergency Service:
                  </span>
                  <span className="font-mono text-sm font-bold text-destructive">
                    999
                  </span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-semibold text-foreground">
                    Govt Citizen Services Call Center:
                  </span>
                  <span className="font-mono text-sm font-bold text-primary">
                    333
                  </span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-semibold text-foreground">
                    WASA Water Leak Emergency:
                  </span>
                  <span className="font-mono text-xs font-semibold text-foreground">
                    16162
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">
                    Electricity Grid Fault Desk:
                  </span>
                  <span className="font-mono text-xs font-semibold text-foreground">
                    16999
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* General Administrative Office Details */}
            <Card className="border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-foreground">
                  <Building2 className="size-5 text-primary" />
                  Municipal Executive Headquarters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs text-muted-foreground">
                <div className="flex items-start gap-2.5">
                  <MapPin className="size-4 shrink-0 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">
                      Central City Hall
                    </p>
                    <p>Nagar Bhaban, Phoenix Road, Dhaka-1000, Bangladesh</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="size-4 shrink-0 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">
                      Administrative Switchboard
                    </p>
                    <p>+880 2-9568123 (Sun – Thu, 9:00 AM – 5:00 PM)</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="size-4 shrink-0 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">
                      Official Communications
                    </p>
                    <p>info@citycare.gov.bd</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="size-4 shrink-0 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">
                      Public Grievance Hours
                    </p>
                    <p>
                      In-person walk-ins: 10:00 AM – 1:00 PM every working day
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Card (7 columns) */}
          <div className="lg:col-span-7">
            <Card className="border bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-foreground">
                  Send a Message to the City Council
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Use this form for non-emergency inquiries, policy suggestions,
                  or general feedback. For complaints requiring physical repair,
                  please file a service request.
                </p>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
