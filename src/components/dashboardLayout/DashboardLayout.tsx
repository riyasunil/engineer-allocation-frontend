import React from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../sidebar/DashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex">
      <SidebarProvider>
        <DashboardSidebar />
        <main>
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
