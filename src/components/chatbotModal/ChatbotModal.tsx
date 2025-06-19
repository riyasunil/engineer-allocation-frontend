import React, { useState, useEffect, useRef } from "react";
import { BotMessageSquare, X, Send } from "lucide-react";
import { useSendChatbotQueryMutation } from "@/api-service/chatbot/chatbot.api";

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hi! I'm your AI assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);

  const [sendQuery, { isLoading }] = useSendChatbotQueryMutation();

  const bottomRef = useRef<HTMLDivElement>(null); // ✅ 1. Ref to scroll target

useEffect(() => {
  if (isOpen) {
    // Slight delay to ensure the modal renders before scrolling
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }, 50);
  }
}, [isOpen, messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    try {
      const response = await sendQuery({ query: message }).unwrap();

      const reply = response.message || "🤖 I wasn't sure how to respond.";

      const botMessage = {
        id: Date.now() + 1,
        text: reply,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errMsg = {
        id: Date.now() + 1,
        text: "⚠️ Something went wrong. Please try again.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-120 h-150 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <BotMessageSquare className="h-5 w-5" />
          <span className="font-medium">AI Assistant</span>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/10 rounded-full p-1 transition-colors"
          aria-label="Close Chatbot"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      {/* Messages */}
<div className="flex-1 p-4 overflow-auto space-y-3">
  {messages.map((msg) => (
    <div
      key={msg.id}
      className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[70%] whitespace-pre-wrap p-3 rounded-lg text-sm ${
          msg.isBot
            ? "bg-gray-100 text-gray-800"
            : "bg-primary text-white"
        }`}
      >
        {msg.text}
      </div>
    </div>
  ))}

  {/* ✅ Loading animation inside render */}
  {isLoading && (
    <div className="flex justify-start">
      <div className="bg-gray-100 text-gray-800 text-sm px-3 py-2 rounded-lg max-w-[70%]">
        <div className="flex space-x-1">
          <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  )}

  <div ref={bottomRef} /> {/* ✅ Invisible scroll target */}
</div>



      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            className="px-3 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotModal;