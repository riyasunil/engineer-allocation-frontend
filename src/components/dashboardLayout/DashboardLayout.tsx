import React from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../sidebar/DashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Navigate } from "react-router-dom";

const DashboardLayout = () => {

  

  const isLoggedIn= () =>{
    const token= localStorage.getItem("token")
    if(token)
      return true
    else
    return false
    
  };

  if(!isLoggedIn()){
     return <Navigate to='/login'/>
  }
  return (
    <div className="flex">
      <SidebarProvider>
        <DashboardSidebar userRole="engineer" />
        <main className="flex-1 p-6 overflow-auto bg-background">
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
