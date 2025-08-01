import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Google Analytics configuration
const GA_TRACKING_ID = "G-XXXXXXXXXX"; // Replace with your actual GA4 tracking ID

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== "undefined") {
    // Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];

    // If gtag isn't available yet, wait for it
    if (!window.gtag) {
      // Set up a minimal gtag function if script hasn't loaded yet
      window.gtag = function(...args: any[]) {
        window.dataLayer.push(args);
      };
    }

    // Configure with initial page view
    window.gtag("config", GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track page views
export const trackPageView = (path: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: path,
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track business-specific events
export const trackBusinessEvent = {
  // Contact form submissions
  contactForm: (method: "email" | "phone" | "form") => {
    trackEvent("contact_submission", "engagement", method);
  },

  // Project quote requests
  quoteRequest: (service: string) => {
    trackEvent("quote_request", "conversion", service);
  },

  // Service page views
  serviceView: (serviceName: string) => {
    trackEvent("service_view", "engagement", serviceName);
  },

  // Project portfolio views
  projectView: (projectName: string) => {
    trackEvent("project_view", "engagement", projectName);
  },

  // Chatbot interactions
  chatbotEngagement: (action: "open" | "message_sent" | "close") => {
    trackEvent("chatbot_interaction", "engagement", action);
  },

  // Authentication events
  userAuth: (action: "login" | "register" | "logout") => {
    trackEvent("user_auth", "user_engagement", action);
  },

  // Blog engagement
  blogEngagement: (
    action: "article_view" | "article_share",
    articleTitle?: string,
  ) => {
    trackEvent("blog_engagement", "content", action, undefined);
    if (articleTitle) {
      trackEvent("blog_article_view", "content", articleTitle);
    }
  },

  // Download events (for brochures, case studies, etc.)
  downloadContent: (contentType: string, fileName: string) => {
    trackEvent("download", "content", `${contentType}_${fileName}`);
  },
};

// Custom hook for automatic page tracking
export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname + location.search);
  }, [location]);

  return {
    trackEvent,
    trackBusinessEvent,
  };
};

// Declare global types for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default useAnalytics;
