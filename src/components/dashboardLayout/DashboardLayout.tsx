import React, { lazy, Suspense, useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import DashboardSidebar from "../sidebar/DashboardSidebar";
import { SidebarProvider } from "../ui/sidebar";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useGetUserByIdQuery, useLazyGetUserByIdQuery } from "@/api-service/user/user.api";
import { setCurrentUser } from "@/store/slices/userSlice";
import { BotMessageSquare } from "lucide-react";
const ChatbotModal = lazy(() => import("../chatbotModal/ChatbotModal"));


const DashboardLayout = () => {
  const dispatch = useAppDispatch();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  // const currentUser = useAppSelector((state) => state.user.currentUser);
  const currentUser = useAppSelector((state) => state.user.currentUser);
  console.log("Current User in DashboardLayout:", currentUser);

  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  const user_id = localStorage.getItem("user_id");
  const {
    data: user,
    isLoading,
    error,
  } = useGetUserByIdQuery(user_id, {
    skip: !user_id,
  });

useEffect(() => {
  if (user) {
    dispatch(setCurrentUser(user));
  }
}, [user, dispatch]);


  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }

  if (isLoading || !currentUser) {
    return (
      <div className="flex relative">
        <SidebarProvider>
          <DashboardSidebar userRole="hr" userName="Loading..." />
          <main className="flex-1 p-6 overflow-auto bg-background">
            <div className="animate-pulse">Loading User...</div>
          </main>
        </SidebarProvider>
      </div>
    );
  }

  return (
    <div className="flex relative">
      <SidebarProvider>
        <DashboardSidebar
          userRole={(currentUser?.role.role_name).toLowerCase()}
          userName={currentUser?.name}
        />
        <main className="flex-1 p-6 overflow-auto bg-background">
          <Outlet />
        </main>

        {/* Chatbot Modal */}
        <Suspense fallback={null}>
          <ChatbotModal
            isOpen={isChatbotOpen}
            onClose={() => setIsChatbotOpen(false)}
          />
        </Suspense>

        {/* Floating Button (only when modal is closed) */}
        {!isChatbotOpen && (
          <button
            onClick={() => setIsChatbotOpen(true)}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all"
          >
            <BotMessageSquare className="w-6 h-6" />
          </button>
        )}
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
