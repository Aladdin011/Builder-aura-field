import { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CallProvider } from "@/contexts/CallContext";
import { Toaster } from "@/components/ui/toaster";
import { SEOHead, pageSEO } from "@/components/SEO/SEOHead";
import {
  initializePerformanceOptimizations,
  createImageObserver,
} from "@/utils/performance";
import { motion, AnimatePresence } from "framer-motion";
import PrivateRoute from "@/components/auth/PrivateRoute";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load components for better performance
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const Projects = lazy(() => import("@/pages/Projects"));
const Contact = lazy(() => import("@/pages/Contact"));
const Blog = lazy(() => import("@/pages/Blog"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));

// Enhanced loading component
const LoadingSpinner = () => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center"
    style={{
      background:
        "linear-gradient(135deg, #051822 0%, #2D383E 50%, #7C5841 100%)",
    }}
  >
    <div className="text-center">
      {/* Animated logo */}
      <motion.div
        className="w-20 h-20 mx-auto mb-6 relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-2xl border border-white/20"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <img
            src="/images/brand/logo.jpg"
            alt="JD Marc Limited Logo"
            className="w-20 h-20 object-contain rounded-lg"
            onError={(e) => {
              e.currentTarget.src = "https://cdn.builder.io/api/v1/image/assets%2F751ea84be0da437c8dd3f1bf04173189%2F8c27ff3f82824383bd700bc3410cfa09?format=webp&width=200";
            }}
          />
        </motion.div>

        {/* Orbiting elements */}
        {[0, 120, 240].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-[#D4C9C7] rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transformOrigin: "0 0",
            }}
            animate={{
              rotate: [angle, angle + 360],
              x: [25, 25],
              y: [-1.5, -1.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>

      {/* Loading text */}
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-2xl font-black text-white mb-3"
      >
        JD Marc Limited
      </motion.h2>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-[#D4C9C7] mb-8"
      >
        Building Africa's Future
      </motion.p>

      {/* Progress bar */}
      <motion.div
        className="w-48 h-1 bg-[#2D383E] rounded-full mx-auto overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-[#AA7452] to-[#7C5841] rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.8, duration: 2, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Loading text animation */}
      <motion.p
        className="text-[#969A9E] text-sm mt-4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Preparing your experience...
      </motion.p>
    </div>
  </div>
);

// Error boundary component
const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="text-center max-w-md mx-auto">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-10 h-10 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Something went wrong
      </h2>
      <p className="text-gray-600 mb-6">
        We're sorry, but something unexpected happened. Please try refreshing
        the page.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Refresh Page
      </button>
      {process.env.NODE_ENV === "development" && (
        <details className="mt-6 text-left">
          <summary className="cursor-pointer text-gray-500 text-sm">
            Error Details
          </summary>
          <pre className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded overflow-auto">
            {error.message}
          </pre>
        </details>
      )}
    </div>
  </div>
);

// Route component with SEO
const RouteWithSEO = ({
  children,
  seo,
}: {
  children: React.ReactNode;
  seo: typeof pageSEO.home;
}) => (
  <>
    <SEOHead {...seo} />
    {children}
  </>
);

// Create Query Client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  useEffect(() => {
    // Initialize performance optimizations
    initializePerformanceOptimizations();

    // Initialize image lazy loading
    const imageObserver = createImageObserver();
    if (imageObserver) {
      const lazyImages = document.querySelectorAll("img[data-src]");
      lazyImages.forEach((img) => {
        imageObserver.observe(img);
      });
    }

    // Add critical CSS variables
    const root = document.documentElement;
    root.style.setProperty("--primary-dark", "#051822");
    root.style.setProperty("--secondary-dark", "#2D383E");
    root.style.setProperty("--accent-warm", "#7C5841");
    root.style.setProperty("--accent-light", "#AA7452");
    root.style.setProperty("--neutral-mid", "#969A9E");
    root.style.setProperty("--neutral-light", "#D4C9C7");
    root.style.setProperty("--construction-white", "#FFFFFF");

    // Performance monitoring
    if ("performance" in window && "measure" in performance) {
      // Measure app initialization time
      performance.mark("app-start");

      setTimeout(() => {
        performance.mark("app-ready");
        performance.measure("app-initialization", "app-start", "app-ready");

        const measure = performance.getEntriesByName("app-initialization")[0];
        console.log(`App initialization took ${measure.duration.toFixed(2)}ms`);

        // Send to analytics if available
        if (window.gtag) {
          window.gtag("event", "timing_complete", {
            name: "app_initialization",
            value: Math.round(measure.duration),
          });
        }
      }, 100);
    }

    // Cleanup on unmount
    return () => {
      if (imageObserver) {
        imageObserver.disconnect();
      }
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <CallProvider>
              <BrowserRouter>
                <div className="App">
                  <AnimatePresence mode="wait">
                    <Suspense fallback={<LoadingSpinner />}>
                      <Routes>
                        <Route
                          path="/"
                          element={
                            <RouteWithSEO seo={pageSEO.home}>
                              <Home />
                            </RouteWithSEO>
                          }
                        />
                        <Route
                          path="/about"
                          element={
                            <RouteWithSEO seo={pageSEO.about}>
                              <About />
                            </RouteWithSEO>
                          }
                        />
                        <Route
                          path="/services"
                          element={
                            <RouteWithSEO seo={pageSEO.services}>
                              <Services />
                            </RouteWithSEO>
                          }
                        />
                        <Route
                          path="/services/:category"
                          element={
                            <RouteWithSEO seo={pageSEO.services}>
                              <Services />
                            </RouteWithSEO>
                          }
                        />
                        <Route
                          path="/projects"
                          element={
                            <RouteWithSEO seo={pageSEO.projects}>
                              <Projects />
                            </RouteWithSEO>
                          }
                        />
                        <Route
                          path="/contact"
                          element={
                            <RouteWithSEO seo={pageSEO.contact}>
                              <Contact />
                            </RouteWithSEO>
                          }
                        />
                        <Route
                          path="/blog"
                          element={
                            <RouteWithSEO
                              seo={{
                                title:
                                  "Construction Industry Blog & Insights | JD Marc Limited",
                                description:
                                  "Stay updated with the latest construction industry trends, project insights, and expert analysis from JD Marc Limited.",
                                keywords:
                                  "construction blog, industry insights, building trends, project updates, construction news Africa",
                              }}
                            >
                              <Blog />
                            </RouteWithSEO>
                          }
                        />
                        <Route
                          path="/blog/:category"
                          element={
                            <RouteWithSEO
                              seo={{
                                title:
                                  "Construction Blog Categories | JD Marc Limited",
                                description:
                                  "Explore specific construction industry topics including technology, projects, industry insights, and company news.",
                                keywords:
                                  "construction blog categories, industry insights, project updates, construction technology, company news",
                              }}
                            >
                              <Blog />
                            </RouteWithSEO>
                          }
                        />
                        <Route
                          path="/login"
                          element={
                            <RouteWithSEO
                              seo={{
                                title: "Login - JD Marc Limited Client Portal",
                                description:
                                  "Access your JD Marc Limited client portal to manage projects, view progress, and communicate with our team.",
                                keywords:
                                  "client login, project portal, construction management, client access",
                              }}
                            >
                              <Login />
                            </RouteWithSEO>
                          }
                        />
                        <Route
                          path="/register"
                          element={
                            <RouteWithSEO
                              seo={{
                                title:
                                  "Register - Join JD Marc Limited Client Portal",
                                description:
                                  "Create your JD Marc Limited client account to start your construction project and access our premium services.",
                                keywords:
                                  "client registration, new account, construction services, project management",
                              }}
                            >
                              <Register />
                            </RouteWithSEO>
                          }
                        />
                        <Route
                          path="/dashboard"
                          element={
                            <PrivateRoute>
                              <RouteWithSEO
                                seo={{
                                  title: "Client Dashboard - JD Marc Limited",
                                  description:
                                    "Manage your construction projects, track progress, and access all project resources in your personalized dashboard.",
                                  keywords:
                                    "client dashboard, project management, construction progress, project portal",
                                }}
                              >
                                <Dashboard />
                              </RouteWithSEO>
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path="/forgot-password"
                          element={
                            <RouteWithSEO
                              seo={{
                                title: "Reset Password - JD Marc Limited",
                                description:
                                  "Reset your JD Marc Limited account password to regain access to your client portal and project management tools.",
                                keywords:
                                  "password reset, account recovery, client portal access",
                              }}
                            >
                              <ForgotPassword />
                            </RouteWithSEO>
                          }
                        />
                        <Route
                          path="*"
                          element={
                            <RouteWithSEO
                              seo={{
                                title: "Page Not Found - JD Marc Limited",
                                description:
                                  "The page you are looking for could not be found. Visit our homepage to explore JD Marc Limited construction services.",
                                keywords:
                                  "404, page not found, JD Marc Limited",
                              }}
                            >
                              <NotFound />
                            </RouteWithSEO>
                          }
                        />
                      </Routes>
                    </Suspense>
                  </AnimatePresence>

                  {/* Global toast notifications */}
                  <Toaster />
                </div>
              </BrowserRouter>
            </CallProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
