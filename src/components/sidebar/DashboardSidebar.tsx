import {
  LayoutDashboard,
  BarChart,
  FolderKanban,
  Users2,
  Bell,
  History,
  MoreVertical
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import { Badge } from "../ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export default function DashboardSidebar() {
  const location = useLocation();
  const newAlertsCount = 2;

  const handleLogout = () => {
    alert("Logged out (dummy)");
    // Replace with real logout logic
  };

  const items = [
    {
      title: "Dashboard",
      url: "/hr/dashboard",
      icon: LayoutDashboard
    },
    {
      title: "Analytics",
      url: "/hr/analytics",
      icon: BarChart
    },
    {
      title: "Projects",
      url: "/hr/projects",
      icon: FolderKanban
    },
    {
      title: "Engineers",
      url: "/hr/engineers",
      icon: Users2
    },
    {
      title: "Alerts",
      url: "/hr/alerts",
      icon: Bell,
      hasNotification: newAlertsCount > 0,
      notificationCount: newAlertsCount
    },
    {
      title: "History",
      url: "/hr/history",
      icon: History
    }
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

      <div className="p-4 border-t flex items-center justify-between gap-3">
        <NavLink to="/hr/profile" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold">
            HR
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-black">Hr</p>
            <p className="text-xs text-muted-foreground">User Role</p>
          </div>
        </NavLink>

        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="ghost" className="ml-auto">
              <MoreVertical className="h-5 w-5 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-32 p-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </Sidebar>
  );
}
