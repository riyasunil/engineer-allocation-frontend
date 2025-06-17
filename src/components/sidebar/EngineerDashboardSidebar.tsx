import {
  LayoutDashboard,
  FolderKanban,
  User
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

const items = [
  {
    title: "Dashboard",
    url: "/engineer/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    url: "/engineer/projects",
    icon: FolderKanban,
  },
  {
    title: "My Profile",
    url: "/engineer/profile",
    icon: User,
  }
];

export default function EngineerDashboardSidebar() {
  const location = useLocation();
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
                            ? "bg-primary text-white "
                            : "hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
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
            E
          </div>
          <div>
            <p className="text-sm font-medium text-black">Employee</p>
            <p className="text-xs text-muted-foreground">User Role</p>
          </div>
        </div>
      </NavLink>
    </Sidebar>
  );
}
