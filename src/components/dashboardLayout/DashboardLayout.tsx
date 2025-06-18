import React from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../sidebar/DashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store/store";

const DashboardLayout = () => {

  const isLoggedIn= () =>{
    const token= localStorage.getItem("token")
    if(token)
      return true
    else
    return false
    
  };

  const currentUser = useAppSelector((state) => state.user.currentUser);
  

  if(!isLoggedIn()){
     return <Navigate to='/login'/>
  }

  if (!currentUser) {
    return <Navigate to="/login" />; // or just return null/loading
  }

  const role = (currentUser.role.role_name).toLowerCase();

  return (
    <div className="flex">
      <SidebarProvider>
        <DashboardSidebar userRole={role} />
        <main className="flex-1 p-6 overflow-auto bg-background">
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
