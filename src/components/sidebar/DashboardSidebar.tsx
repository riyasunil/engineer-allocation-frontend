import {
  LayoutDashboard,
  BarChart,
  FolderKanban,
  Users2,
  Bell,
  History,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import { Badge } from "../ui/badge";

export default function DashboardSidebar() {
  const location = useLocation();
  const newAlertsCount = 2;

  const items = [
    {
      title: "Dashboard",
      url: "/hr/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Analytics",
      url: "/hr/analytics",
      icon: BarChart,
    },
    {
      title: "Projects",
      url: "/hr/projects",
      icon: FolderKanban,
    },
    {
      title: "Engineers",
      url: "/hr/engineers",
      icon: Users2,
    },
    {
      title: "Alerts",
      url: "/hr/alerts",
      icon: Bell,
      label: "Alerts",
      roles: ["hr"],
      hasNotification: newAlertsCount > 0,
      notificationCount: newAlertsCount,
    },
    {
      title: "History",
      url: "/hr/history",
      icon: History,
    },
  ];

  return (
    <Sidebar className="h-screen w-64 border-r bg-white flex flex-col justify-between">
      <SidebarContent className="p-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-bold text-black mb-2 p-0">
            KeyValue
          </SidebarGroupLabel>
          <p className="text-sm text-muted-foreground mb-6">
            Engineer Allocation
          </p>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const isActive = location.pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full transition-colors ${
                          isActive
                            ? "bg-primary text-white"
                            : "hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="flex-1">{item.title}</span>
                        {item.hasNotification && (
                          <Badge
                            variant="destructive"
                            className="text-xs ml-auto min-w-5 h-5 flex items-center justify-center p-1"
                          >
                            {item.notificationCount}
                          </Badge>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <NavLink to="/hr/profile">
        <div className="p-4 border-t flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold">
            HR
          </div>
          <div>
            <p className="text-sm font-medium text-black">Hr</p>
            <p className="text-xs text-muted-foreground">User Role</p>
          </div>
        </div>
      </NavLink>
    </Sidebar>
  );
}
