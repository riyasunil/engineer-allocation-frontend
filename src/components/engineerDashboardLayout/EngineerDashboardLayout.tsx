import React from "react";
import { Outlet } from "react-router-dom";
import EngineerDashboardSidebar from "../sidebar/EngineerDashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Navigate } from "react-router-dom";

const EngineerDashboardLayout = () => {

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
        <EngineerDashboardSidebar />
        <main className="p-5 w-full">
          <Outlet/>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default EngineerDashboardLayout;
