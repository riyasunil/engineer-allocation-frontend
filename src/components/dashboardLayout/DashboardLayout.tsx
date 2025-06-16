import React from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../sidebar/DashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex">
      <SidebarProvider>
        <DashboardSidebar />
        <main className="p-5 w-full">
          <Outlet/>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
