import React from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../sidebar/DashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex">
      <SidebarProvider>
        <DashboardSidebar />
        <main className="flex-1 p-6 overflow-auto bg-background">
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
