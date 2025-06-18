import {
  LayoutDashboard,
  BarChart,
  FolderKanban,
  Users2,
  Bell,
  History,
  User,
  MoreVertical,
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
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { clearCurrentUser } from "@/store/slices/userSlice";
import { useAppDispatch } from "@/store/store";

type UserRole = "hr" | "pm" | "lead" | "engineer";

interface DashboardSidebarProps {
  userRole: UserRole;
  userName : string;
}

export default function DashboardSidebar({ userRole, userName }: DashboardSidebarProps) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const newAlertsCount = 2;



  const items = [
    {
      title: "Dashboard",
      url: `/dashboard`,
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
      notificationCount: newAlertsCount,
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

  const handleLogout = () => {
    dispatch(clearCurrentUser());
    localStorage.setItem("token" , "");
    localStorage.setItem("user_id", "");
    navigate("/login");
  }
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

      <div className="flex flex-row justify-between items-center  border-t">
        <NavLink to={`/${userRole}/profile`}>
          <div className="p-4  flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold">
              {userName? userName.toUpperCase().slice(0, 2) : "KV" }
            </div>
            <div>
              <p className="text-sm font-medium text-black">
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </p>
              <p className="text-xs text-muted-foreground">User Role</p>
            </div>
          </div>
        </NavLink>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-auto p-2 rounded-md hover:bg-muted">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem
              onClick={() => 
                handleLogout()
              }
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Sidebar>
  );
}
