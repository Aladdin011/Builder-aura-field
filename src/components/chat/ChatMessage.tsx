import { motion } from "framer-motion";
import { User, Bot } from "lucide-react";

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  followUp?: string[];
}

interface ChatMessageProps {
  message: Message;
  onFollowUpClick?: (text: string) => void;
}

export default function ChatMessage({
  message,
  onFollowUpClick,
}: ChatMessageProps) {
  const formatMessage = (text: string) => {
    // Sanitize input to prevent XSS
    const sanitized = text
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');

    // Convert **bold** to <strong> tags (safe after sanitization)
    const boldFormatted = sanitized.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Convert newlines to <br> tags
    const withLineBreaks = boldFormatted.replace(/\n/g, '<br>');

    return withLineBreaks;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 p-3 ${message.isUser ? "justify-end" : "justify-start"}`}
    >
      {!message.isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-[#142E54] rounded-full flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
      )}

      <div className={`max-w-[80%] ${message.isUser ? "order-first" : ""}`}>
        <div
          className={`p-3 rounded-lg ${
            message.isUser
              ? "bg-[#F97316] text-white rounded-br-sm"
              : "bg-gray-100 text-gray-800 rounded-bl-sm"
          }`}
        >
          <div
            className="text-sm whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
          />
        </div>

        <div className="text-xs text-gray-500 mt-1 px-1">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        {/* Follow-up suggestions for bot messages */}
        {!message.isUser && message.followUp && message.followUp.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.followUp.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onFollowUpClick?.(suggestion)}
                className="block text-xs text-[#142E54] bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded border border-blue-200 transition-colors duration-200 w-full text-left"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {message.isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-[#F97316] rounded-full flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
      )}
    </motion.div>
  );
}
