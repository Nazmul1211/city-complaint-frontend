"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { adminRoutes, citizenRoutes, staffRoutes } from "@/routes";
import type { SidebarItems } from "@/types/sidebar.type";
import type { UserRole } from "@/types/user.type";

const sidebarRoutes: Partial<Record<UserRole, SidebarItems>> = {
  SUPER_ADMIN: adminRoutes,
  ADMIN: adminRoutes,
  STAFF: staffRoutes,
  CITIZEN: citizenRoutes,
};

export function DashboardSidebar({ userRole }: { userRole: UserRole }) {
  const pathname = usePathname();
  const routes: SidebarItems = sidebarRoutes[userRole] || [];

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold tracking-tight text-foreground hover:opacity-90"
        >
          <div className="relative flex size-8 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-white p-0.5 shadow-xs shrink-0">
            <Image
              src="/citycare_logo.jpeg"
              alt="CityCare Logo"
              width={32}
              height={32}
              className="size-full object-contain"
            />
          </div>
          <span className="text-base font-semibold">CityCare</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {routes.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/80">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isItemActive =
                    item.url === "/admin" ||
                    item.url === "/staff" ||
                    item.url === "/dashboard"
                      ? pathname === item.url
                      : pathname === item.url ||
                        pathname.startsWith(`${item.url}/`);
                  const ItemIcon = item.icon;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        render={<Link href={item.url} />}
                        isActive={isItemActive}
                      >
                        {ItemIcon && <ItemIcon className="size-4 shrink-0" />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
