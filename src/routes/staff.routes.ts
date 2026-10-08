import type { SidebarItems } from "@/types/sidebar.type";

const prefix = "/staff";

export const staffRoutes: SidebarItems = [
  {
    title: "Casework",
    items: [
      {
        title: "Overview",
        url: `${prefix}`,
      },
      {
        title: "Assigned Complaints",
        url: `${prefix}/assigned`,
      },
    ],
  },
  {
    title: "My Department",
    items: [
      {
        title: "Department Info",
        url: `${prefix}/department`,
      },
      {
        title: "Staff Profile",
        url: `${prefix}/profile`,
      },
    ],
  },
];
