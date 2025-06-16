import React from "react";
import { Outlet } from "react-router-dom";
import EngineerDashboardSidebar from "../sidebar/EngineerDashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";

const EngineerDashboardLayout = () => {
  return (
    <div className="flex">
      <SidebarProvider>
        <EngineerDashboardSidebar />
        <main className="p-5 w-full">
          <Outlet/>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default EngineerDashboardLayout;
