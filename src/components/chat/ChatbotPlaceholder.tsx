import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

export default function ChatbotPlaceholder() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Show chatbot after 5 seconds with bounce-in animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setShowNotification(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Hide notification after 15 seconds
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowNotification(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 0.6,
        }}
      >
        {/* Notification Bubble */}
        <AnimatePresence>
          {showNotification && !isOpen && (
            <motion.div
              className="absolute bottom-16 right-0 mb-2 mr-2"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ type: "spring", duration: 0.4 }}
            >
              <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 max-w-[250px] relative backdrop-blur-sm">
                <div className="text-sm text-gray-700 font-medium">
                  👋 Hi! Need help with your project? I'm here to assist!
                </div>
                {/* Arrow pointing to button */}
                <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-200 shadow-sm"></div>
                {/* Close button */}
                <button
                  onClick={() => setShowNotification(false)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs transition-colors"
                  aria-label="Close notification"
                >
                  <X size={12} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Button with bounce animation */}
        <motion.button
          className="relative w-14 h-14 bg-gradient-to-r from-[#F97316] to-[#ea6a0a] hover:from-[#ea6a0a] hover:to-[#dc5a00] text-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 border-2 border-white/20"
          onClick={toggleChat}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            y: showNotification ? [0, -2, 0] : 0,
          }}
          transition={{
            y: {
              duration: 2,
              repeat: showNotification ? Infinity : 0,
              ease: "easeInOut",
            },
          }}
          style={{
            filter: "drop-shadow(0 10px 15px rgba(249, 115, 22, 0.3))",
          }}
          aria-label="Open chat"
        >
          {/* Pulse animation when notification is showing */}
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

          <MessageCircle size={24} className="relative z-10" />

          {/* Notification indicator dot */}
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
        </motion.button>
      </motion.div>

      {/* Chat Window Placeholder */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:bg-transparent md:backdrop-blur-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleChat}
            />

            {/* Chat Container */}
            <motion.div
              className="fixed bottom-24 right-6 w-80 md:w-96 h-[60vh] max-h-[500px] bg-white rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200"
              initial={{ opacity: 0, y: 100, scale: 0.8, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: 100, scale: 0.8, rotateX: -15 }}
              transition={{ type: "spring", duration: 0.4, damping: 25 }}
              style={{
                filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15))",
              }}
              transformOrigin="bottom right"
            >
              {/* Header */}
              <div className="bg-[#142E54] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F97316] rounded-full flex items-center justify-center">
                    <MessageCircle size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold">JD Marc Assistant</h3>
                    <p className="text-xs text-blue-200">AI-powered support</p>
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

              {/* Content */}
              <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#F97316] rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle size={32} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    AI Chat Coming Soon
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We're integrating advanced AI to better assist you with
                    project inquiries and support.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      For now, contact us:
                    </p>
                    <div className="space-y-1 text-sm">
                      <p className="text-[#F97316] font-medium">
                        📞 +234 (0)8037 065497
                      </p>
                      <p className="text-[#F97316] font-medium">
                        ✉️ info@jdmarcng.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t bg-white p-4">
                <p className="text-xs text-gray-500 text-center">
                  Powered by JD Marc • Available 24/7 soon
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
