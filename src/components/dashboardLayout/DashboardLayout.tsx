import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import DashboardSidebar from "../sidebar/DashboardSidebar";
import { SidebarProvider } from "../ui/sidebar";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useLazyGetUserByIdQuery } from "@/api-service/user/user.api";
import { setCurrentUser } from "@/store/slices/userSlice";
import { BotMessageSquare } from "lucide-react";
import ChatbotModal from "../chatbotModal/ChatbotModal";

const DashboardLayout = () => {
  const [triggerGetUserById, { isLoading }] = useLazyGetUserByIdQuery();
  const dispatch = useAppDispatch();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    return !!token;
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
    <div className="flex relative">
      <SidebarProvider>
        <DashboardSidebar userRole={currentUser?.role.role_name.toLowerCase()} />
        <main className="flex-1 p-6 overflow-auto bg-background">
          <Outlet />
        </main>

        {/* Chatbot Modal */}
        <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />

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
