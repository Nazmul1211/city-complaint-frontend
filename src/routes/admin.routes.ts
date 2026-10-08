import type { SidebarItems } from "@/types/sidebar.type";

const prefix = "/admin";

export const adminRoutes: SidebarItems = [
  {
    title: "City Operations",
    items: [
      {
        title: "Overview",
        url: `${prefix}`,
      },
      {
        title: "Complaints & Triage",
        url: `${prefix}/requests`,
      },
      {
        title: "Departments",
        url: `${prefix}/departments`,
      },
      {
        title: "Categories & SLAs",
        url: `${prefix}/categories`,
      },
      {
        title: "City Wards",
        url: `${prefix}/wards`,
      },
    ],
  },
  {
    title: "Governance & Security",
    items: [
      {
        title: "User Management",
        url: `${prefix}/users`,
      },
      {
        title: "Audit Trail",
        url: `${prefix}/audit-logs`,
      },
    ],
  },
];
