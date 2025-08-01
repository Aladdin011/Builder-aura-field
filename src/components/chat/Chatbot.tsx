import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useTransform,
  useScroll,
} from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import ChatMessage, { Message } from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import ErrorBoundary from "../ui/ErrorBoundary";
import { findBestResponse, welcomeMessage } from "@/data/chatbotKnowledge";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Track scroll position and viewport for dynamic positioning
  const { scrollYProgress } = useScroll();

  // Notification messages that appear with the button
  const notifications = [
    "💬 Have questions about our services?",
    "🏗️ Need a project quote?",
    "📍 Looking for our office locations?",
    "👋 Hi! I'm here to help with JD Marc info",
    "⚡ Quick questions? Ask me anything!",
  ];

  // Track scroll position and viewport size
  useEffect(() => {
    const updateScrollPosition = () => {
      setScrollY(window.scrollY);
      setViewportHeight(window.innerHeight);
    };

    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    // Initial setup
    updateScrollPosition();

    // Add scroll and resize listeners
    window.addEventListener("scroll", updateScrollPosition, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollPosition);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Show chatbot button after 5 seconds with cycling notifications
  useEffect(() => {
    const showButtonTimer = setTimeout(() => {
      setShowButton(true);
      setShowNotification(true);
      setNotificationMessage(notifications[0]);
    }, 5000);

    return () => clearTimeout(showButtonTimer);
  }, []);

  // Cycle through notification messages
  useEffect(() => {
    if (!showNotification || isOpen) return;

    let currentIndex = 0;
    const cycleNotifications = () => {
      setNotificationMessage(notifications[currentIndex]);
      currentIndex = (currentIndex + 1) % notifications.length;
    };

    // Change message every 4 seconds
    const notificationTimer = setInterval(cycleNotifications, 4000);

    // Hide notification after 20 seconds
    const hideTimer = setTimeout(() => {
      setShowNotification(false);
    }, 20000);

    return () => {
      clearInterval(notificationTimer);
      clearTimeout(hideTimer);
    };
  }, [showNotification, isOpen, notifications]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Initialize with welcome message when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        const welcomeMsg: Message = {
          id: `msg-${Date.now()}`,
          text: welcomeMessage,
          isUser: false,
          timestamp: new Date(),
          followUp: [
            "What services do you offer?",
            "Where are your offices?",
            "Can I get a project quote?",
          ],
        };
        setMessages([welcomeMsg]);
      }, 500);
    }
  }, [isOpen, messages.length]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend) return;

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      text: textToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Show typing indicator
    setIsTyping(true);

    // Simulate AI response delay (500ms as requested)
    setTimeout(() => {
      const response = findBestResponse(textToSend);
      const botMessage: Message = {
        id: `msg-${Date.now()}-bot`,
        text: response.response,
        isUser: false,
        timestamp: new Date(),
        followUp: response.followUp,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800); // Slightly longer delay for more realistic feel
  };

  const handleFollowUpClick = (text: string) => {
    handleSend(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowNotification(false); // Hide notification when chat opens
    }
  };

  return (
    <>
      {/* Floating Chat Button with Notification - Follows User */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            className="fixed z-[9999]"
            style={{
              right: "1rem",
              // Dynamic positioning based on scroll and viewport
              top: `${Math.min(
                Math.max(scrollY + viewportHeight * 0.7, scrollY + 100),
                scrollY + viewportHeight - 120,
              )}px`,
            }}
            animate={{
              y: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              mass: 0.8,
            }}
          >
            {/* Notification Bubble */}
            <AnimatePresence>
              {showNotification && !isOpen && (
                <motion.div
                  className="absolute -top-16 sm:-top-20 right-0 mb-2 mr-0 sm:mr-2"
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  transition={{ type: "spring", duration: 0.4 }}
                >
                  <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 max-w-[280px] sm:max-w-xs relative backdrop-blur-sm">
                    <div className="text-sm text-gray-700 font-medium leading-relaxed">
                      {notificationMessage}
                    </div>
                    {/* Enhanced arrow pointing down to button */}
                    <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-200 shadow-sm"></div>
                    {/* Close button for notification */}
                    <button
                      onClick={() => setShowNotification(false)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs transition-all duration-200 shadow-sm border border-gray-200"
                      aria-label="Close notification"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced Floating Chat Button */}
            <motion.button
              className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-[#F97316] to-[#ea6a0a] hover:from-[#ea6a0a] hover:to-[#dc5a00] text-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 border-2 border-white/20"
              onClick={toggleChat}
              initial={{ opacity: 0, scale: 0, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", duration: 0.6 }}
              aria-label="Open chat"
              style={{
                filter: "drop-shadow(0 10px 15px rgba(249, 115, 22, 0.3))",
              }}
            >
              {/* Enhanced pulse animation when notification is showing */}
              {showNotification && !isOpen && (
                <>
                  <motion.div
                    className="absolute inset-0 bg-[#F97316] rounded-full opacity-75"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.75, 0.2, 0.75] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-[#F97316] rounded-full opacity-50"
                    animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0.1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                </>
              )}

              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                    <X size={24} className="sm:w-6 sm:h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                    <MessageCircle size={24} className="sm:w-6 sm:h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Floating indicator dot when notification is active */}
            {showNotification && !isOpen && (
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", duration: 0.3 }}
              >
                <motion.div
                  className="w-full h-full bg-red-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window - Enhanced Floating */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Enhanced backdrop for all devices */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998] md:bg-transparent md:backdrop-blur-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleChat}
            />

            {/* Enhanced Chat Container */}
            <motion.div
              className="fixed right-4 sm:right-6 w-[calc(100vw-2rem)] max-w-[320px] sm:max-w-[380px] md:max-w-[400px] h-[65vh] sm:h-[60vh] max-h-[550px] bg-white rounded-xl shadow-2xl z-[9999] flex flex-col overflow-hidden border border-gray-200"
              initial={{ opacity: 0, y: 100, scale: 0.8, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: 100, scale: 0.8, rotateX: -15 }}
              transition={{ type: "spring", duration: 0.4, damping: 25 }}
              style={{
                // Position chat window dynamically relative to scroll position
                top: `${Math.min(
                  Math.max(scrollY + viewportHeight * 0.15, scrollY + 50),
                  scrollY + viewportHeight - 600,
                )}px`,
                filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15))",
              }}
              transformOrigin="top right"
            >
              <div className="bg-[#142E54] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F97316] rounded-full flex items-center justify-center">
                    <MessageCircle size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold">JD Marc Chat</h3>
                    <p className="text-xs text-blue-200">We're here to help!</p>
                  </div>
                </div>
                <button
                  onClick={toggleChat}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto bg-gray-50">
                <div className="h-full">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      onFollowUpClick={handleFollowUpClick}
                    />
                  ))}
                  {isTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t bg-white p-3">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-sm"
                    disabled={isTyping}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!inputValue.trim() || isTyping}
                    className="px-4 py-2 bg-[#F97316] hover:bg-[#ea6a0a] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
                    aria-label="Send message"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  For immediate assistance, call +234 (0)8037 065497
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
