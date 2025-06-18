import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../sidebar/DashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useLazyGetUserByIdQuery } from "@/api-service/user/user.api";
import { setCurrentUser } from "@/store/slices/userSlice";

const DashboardLayout = () => {
  const [triggerGetUserById, {isLoading}] = useLazyGetUserByIdQuery();
  const dispatch = useAppDispatch();

  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    if (token) return true;
    else return false;
  };

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    if (user_id) {
      triggerGetUserById(user_id)
        .unwrap()
        .then((user) => dispatch(setCurrentUser(user)));
    }
  }, []);

  const currentUser = useAppSelector((state) => state.user.currentUser);
  
  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }

  if (isLoading || !currentUser || !currentUser.role?.role_name) {
    return <div className="p-6">Loading...</div>;
  }


  return (
    <div className="flex">
      <SidebarProvider>
        <DashboardSidebar userRole={(currentUser?.role.role_name).toLowerCase()} userName={currentUser?.name} />
        <main className="flex-1 p-6 overflow-auto bg-background">
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
