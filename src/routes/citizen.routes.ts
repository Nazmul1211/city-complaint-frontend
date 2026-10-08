import type { SidebarItems } from "@/types/sidebar.type";

const prefix = "/dashboard";

export const citizenRoutes: SidebarItems = [
  {
    title: "Civic Services",
    items: [
      {
        title: "Overview",
        url: `${prefix}`,
      },
      {
        title: "Submit Complaint",
        url: `${prefix}/submit-request`,
      },
      {
        title: "My Complaints",
        url: `${prefix}/requests`,
      },
    ],
  },
  {
    title: "Billing & Account",
    items: [
      {
        title: "Bills & Payments",
        url: `${prefix}/payments`,
      },
      {
        title: "Citizen Profile",
        url: `${prefix}/profile`,
      },
    ],
  },
];
