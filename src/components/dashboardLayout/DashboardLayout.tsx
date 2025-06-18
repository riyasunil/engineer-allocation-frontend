import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../sidebar/DashboardSidebar";
import { SidebarProvider } from "../ui/sidebar";
import { Navigate } from "react-router-dom";
import { BotMessageSquare } from "lucide-react";
import ChatbotModal from "../chatbotModal/ChatbotModal";

const DashboardLayout = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    if (token) return true;
    else return false;
  };

  // Get user role from localStorage or token (adjust based on your auth implementation)
  const getUserRole = (): "hr" | "pm" | "lead" | "engineer" => {
    // This is a placeholder - replace with your actual role detection logic
    return "hr"; // or extract from token/localStorage
  };

  const userRole = getUserRole();
  const showChatbot = userRole === "hr" || userRole === "pm" || userRole === "lead";

  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex relative">
      <SidebarProvider>
        <DashboardSidebar userRole={userRole} />
        <main className="flex-1 p-6 overflow-auto bg-background">
          <Outlet />
        </main>
      </SidebarProvider>

      {/* Floating Chatbot Button */}
      {showChatbot && (
        <>
          {!isChatbotOpen && (
            <button
              onClick={() => setIsChatbotOpen(true)}
              className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 group"
              aria-label="Open Chatbot"
            >
              <BotMessageSquare className="h-6 w-6 group-hover:scale-110 transition-transform" />
            </button>
          )}

          <ChatbotModal 
            isOpen={isChatbotOpen} 
            onClose={() => setIsChatbotOpen(false)} 
          />
        </>
      )}
    </div>
  );
};

export default DashboardLayout;