import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./contexts/AuthContext";
import { CallProvider } from "./contexts/CallContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import PrivateRoute from "./components/auth/PrivateRoute";
import PageTransition from "./components/ui/PageTransition";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";
import { initGA } from "./hooks/useAnalytics";
import VideoCallInterface from "./components/calls/VideoCallInterface";
import IncomingCallNotification from "./components/calls/IncomingCallNotification";
import JoinCallBanner from "./components/calls/JoinCallBanner";
import DevelopmentModeIndicator from "./components/ui/DevelopmentModeIndicator";

// Advanced Systems
import { useAdvancedAnalytics } from "./lib/advancedAnalytics";
import { initializeSecurity } from "./lib/security";
import { accessibilityEngine } from "./lib/accessibility";
import { businessIntelligence } from "./lib/businessIntelligence";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition>
              <About />
            </PageTransition>
          }
        />
        <Route
          path="/services"
          element={
            <PageTransition>
              <Services />
            </PageTransition>
          }
        />
        <Route
          path="/projects"
          element={
            <PageTransition>
              <Projects />
            </PageTransition>
          }
        />
        <Route
          path="/blog"
          element={
            <PageTransition>
              <Blog />
            </PageTransition>
          }
        />
        <Route
          path="/contact"
          element={
            <PageTransition>
              <Contact />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/register"
          element={
            <PageTransition>
              <Register />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <PageTransition>
                <Dashboard />
              </PageTransition>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute requireAdmin={true}>
              <PageTransition>
                <Admin />
              </PageTransition>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute requireAdmin={true}>
              <PageTransition>
                <UserManagement />
              </PageTransition>
            </PrivateRoute>
          }
        />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => {
  const analytics = useAdvancedAnalytics();

  useEffect(() => {
    // Initialize all advanced systems
    initGA();
    initializeSecurity();

    // Track app initialization
    analytics.trackEvent('app', 'initialized', {
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });

    // Initialize accessibility features
    setTimeout(() => {
      // Delay to ensure DOM is ready
      accessibilityEngine.updateConfig({
        reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        highContrast: window.matchMedia('(prefers-contrast: high)').matches,
      });
    }, 1000);

    // Performance monitoring
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          analytics.trackEvent('performance', 'page_load', {
            loadTime: entry.loadEventEnd - entry.loadEventStart,
            domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            firstPaint: entry.responseEnd - entry.requestStart,
          });
        }
      }
    });

    observer.observe({ entryTypes: ['navigation'] });

    return () => {
      observer.disconnect();
    };
  }, [analytics]);

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Track errors in analytics
        analytics.trackEvent('error', 'app_error_boundary', {
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date(),
        });
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AuthProvider>
              <CallProvider>
                <BrowserRouter>
                  <DevelopmentModeIndicator />
                  <AnimatedRoutes />
                  {/* Global Call Components */}
                  <VideoCallInterface />
                  <IncomingCallNotification />
                  <JoinCallBanner />
                </BrowserRouter>
              </CallProvider>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
