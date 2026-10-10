import {
  Building2,
  FolderKanban,
  Layers,
  LayoutDashboard,
  MapPin,
  ShieldAlert,
  Users,
} from "lucide-react";
import type { SidebarItems } from "@/types/sidebar.type";

const prefix = "/admin";

export const adminRoutes: SidebarItems = [
  {
    title: "City Operations",
    items: [
      {
        title: "Overview",
        url: `${prefix}`,
        icon: LayoutDashboard,
      },
      {
        title: "Complaints & Triage",
        url: `${prefix}/requests`,
        icon: Layers,
      },
      {
        title: "Departments",
        url: `${prefix}/departments`,
        icon: Building2,
      },
      {
        title: "Categories & SLAs",
        url: `${prefix}/categories`,
        icon: FolderKanban,
      },
      {
        title: "City Wards",
        url: `${prefix}/wards`,
        icon: MapPin,
      },
    ],
  },
  {
    title: "Governance & Security",
    items: [
      {
        title: "User Management",
        url: `${prefix}/users`,
        icon: Users,
      },
      {
        title: "Audit Trail",
        url: `${prefix}/audit-logs`,
        icon: ShieldAlert,
      },
    ],
  },
];
