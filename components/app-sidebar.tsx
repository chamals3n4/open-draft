"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Edit02Icon,
  FolderOpenIcon,
  TagsIcon,
  Settings01Icon,
  UserGroupIcon,
  DashboardBrowsingIcon,
} from "@hugeicons/core-free-icons";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import type { AuthUser } from "@/lib/auth";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: AuthUser;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const isAdmin = user.profile?.role === "admin";
  const isEditorOrAbove =
    user.profile?.role === "admin" || user.profile?.role === "editor";

  const mainNav = [
    { title: "Dashboard", url: "/", icon: DashboardBrowsingIcon },
    { title: "Content", url: "/content", icon: Edit02Icon },
    ...(isEditorOrAbove
      ? [
          { title: "Categories", url: "/categories", icon: FolderOpenIcon },
          { title: "Tags", url: "/tags", icon: TagsIcon },
        ]
      : []),
  ];

  const adminNav = isAdmin
    ? [
        { title: "User Management", url: "/users", icon: UserGroupIcon },
        { title: "Settings", url: "/settings", icon: Settings01Icon },
      ]
    : [];

  const userData = {
    name: user.profile?.display_name || "User",
    email: user.email,
    avatar: user.profile?.avatar_url || "",
    role: user.profile?.role || "contributor",
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/">
              <SidebarMenuButton
                size="lg"
                className="hover:bg-transparent active:bg-transparent"
              >
                <span className="text-[1.35rem] font-semibold">
                  OpenDraft 🧩
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {mainNav.map((item) => (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url}>
                  <SidebarMenuButton tooltip={item.title}>
                    <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        {adminNav.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarMenu>
              {adminNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.url}>
                    <SidebarMenuButton tooltip={item.title}>
                      <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
