import {
  LayoutDashboard,
  FolderKanban,
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
import { NavLink, useLocation } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
  },
];

export default function EngineerDashboardSidebar() {
  const location = useLocation();

  const navigate=useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate('/')
  };

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

      <div className="p-4 border-t flex items-center justify-between gap-3">
        <NavLink to="/engineer/profile" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold">
            E
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-black">Engineer</p>
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
