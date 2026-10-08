import { Building2, Scale, Shield, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TeamMember {
  name: string;
  role: string;
  department: string;
  bio: string;
  icon: typeof Building2;
}

const LEADERS: TeamMember[] = [
  {
    name: "Dr. Tariqul Islam",
    role: "Chief Municipal Administrator",
    department: "City Executive Secretariat",
    bio: "Over 20 years leading metropolitan infrastructure initiatives and data-driven civic governance modernization.",
    icon: Building2,
  },
  {
    name: "Engr. Nasreen Akter",
    role: "Director of Infrastructure & Utilities",
    department: "Public Works & WASA Liaison",
    bio: "Civil engineer overseeing road resurfacing standards, stormwater flood drainage, and field crew logistics.",
    icon: Wrench,
  },
  {
    name: "Rafiqul Hasan",
    role: "Head of Civic Technology & Dispatch",
    department: "Digital Municipal Services",
    bio: "Architecting automated SLA routing algorithms, GPS ward boundary dispatch, and real-time citizen notification channels.",
    icon: Shield,
  },
  {
    name: "Farzana Chowdhury",
    role: "Grievance Redressal Ombudsman",
    department: "Independent Public Oversight",
    bio: "Dedicated municipal advocate auditing unresolved citizen petitions, preventing departmental delays, and reviewing complaints.",
    icon: Scale,
  },
];

export function TeamGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {LEADERS.map((leader) => {
        const Icon = leader.icon;
        return (
          <Card
            key={leader.name}
            className="flex flex-col justify-between border bg-card"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <Badge variant="outline" className="text-[10px]">
                  Leadership
                </Badge>
              </div>
              <CardTitle className="mt-4 text-base font-semibold text-foreground">
                {leader.name}
              </CardTitle>
              <p className="text-xs font-medium text-primary">{leader.role}</p>
            </CardHeader>
            <CardContent className="space-y-2 pb-4 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">{leader.department}</p>
              <p className="leading-relaxed">{leader.bio}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
