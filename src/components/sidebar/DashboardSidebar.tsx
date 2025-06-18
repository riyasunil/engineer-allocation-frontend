import {
  LayoutDashboard,
  BarChart,
  FolderKanban,
  Users2,
  Bell,
  History,
  User,
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
import { Button } from "../ui/button";
import { MoreVertical } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";

type UserRole = "hr" | "pm" | "lead" | "engineer";

interface DashboardSidebarProps {
  userRole: UserRole;
}

export default function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const location = useLocation();
  const newAlertsCount = 2;
  const navigate=useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate('/')
  };

  const items = [
    {
      title: "Dashboard",
      url: `/${userRole}/dashboard`,
      icon: LayoutDashboard,
      roles: ["hr", "pm", "lead"],
    },
    {
      title: "Analytics",
      url: `/${userRole}/analytics`,
      icon: BarChart,
      roles: ["hr", "pm"],
    },
    {
      title: "Projects",
      url: `/${userRole}/projects`,
      icon: FolderKanban,
      roles: ["hr", "pm", "lead", "engineer"],
    },
    {
      title: "Engineers",
      url: `/${userRole}/engineers`,
      icon: Users2,
      roles: ["hr", "pm", "lead"],
    },
    {
      title: "Alerts",
      url: `/${userRole}/alerts`,
      icon: Bell,
      roles: ["hr", "pm", "lead"],
      hasNotification: newAlertsCount > 0,
      notificationCount: newAlertsCount
    },
    {
      title: "History",
      url: `/${userRole}/history`,
      icon: History,
      roles: ["hr", "pm", "lead"],
    },
    {
      title: "Profile",
      url: `/${userRole}/profile`,
      icon: User,
      roles: ["engineer"],
    },
  ];

  const filteredItems = items.filter((item) => item.roles.includes(userRole));

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
              {filteredItems.map((item) => {
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

      <NavLink to={`/${userRole}/profile`}>
        <div className="p-4 border-t flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold">
            {userRole.toUpperCase().slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-medium text-black">
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </p>
            <p className="text-xs text-muted-foreground">User Role</p>
          </div>
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
      
    </Sidebar>
  );
}
