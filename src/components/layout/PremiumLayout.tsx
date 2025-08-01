import { ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import PremiumNavigation from './PremiumNavigation';
import { useAppStore } from '@/stores/appStore';
import { useAdvancedAnalytics } from '@/lib/advancedAnalytics';

// Import the modern design system styles
import '../../styles/modern-design-system.css';

interface PremiumLayoutProps {
  children: ReactNode;
  className?: string;
  hideNavigation?: boolean;
}

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function PremiumLayout({ 
  children, 
  className = "", 
  hideNavigation = false 
}: PremiumLayoutProps) {
  const { theme, reducedMotion } = useAppStore();
  const analytics = useAdvancedAnalytics();

  // Apply theme and accessibility preferences
  useEffect(() => {
    const html = document.documentElement;
    
    // Apply theme
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    // Apply reduced motion preference
    if (reducedMotion) {
      html.style.setProperty('--motion-duration', '0ms');
    } else {
      html.style.removeProperty('--motion-duration');
    }

    // Track page view
    analytics.trackEvent('page', 'view', {
      url: window.location.pathname,
      title: document.title,
      timestamp: new Date(),
    });
  }, [theme, reducedMotion, analytics]);

  // Handle page visibility changes for analytics
  useEffect(() => {
    const handleVisibilityChange = () => {
      try {
        if (document.hidden) {
          analytics.trackEvent('page', 'blur', {
            duration: Date.now() - performance.now(),
          });
        } else {
          analytics.trackEvent('page', 'focus', {
            timestamp: Date.now(),
          });
        }
      } catch (error) {
        console.warn('Error in visibility change handler:', error);
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });
      return () => {
        try {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        } catch (error) {
          console.warn('Error removing visibility change listener:', error);
        }
      };
    }
  }, [analytics]);

  return (
    <div className="min-h-screen bg-surface-primary">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-warm focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-accent-light"
      >
        Skip to main content
      </a>

      {/* Navigation */}
      {!hideNavigation && <PremiumNavigation />}

      {/* Main Content */}
      <motion.main
        id="main-content"
        className={`${!hideNavigation ? 'pt-20' : ''} ${className}`}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        role="main"
        aria-label="Main content"
      >
        {children}
      </motion.main>

      {/* Performance monitoring overlay (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <PerformanceMonitor />
      )}
    </div>
  );
}

// Performance monitor component for development
const PerformanceMonitor = () => {
  const { performance } = useAppStore();

  if (!performance) return null;

  return (
    <motion.div
      className="fixed bottom-4 left-4 z-50 p-3 glass-dark rounded-lg text-white text-xs font-mono"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span>LCP:</span>
          <span className={performance.lcp > 2500 ? 'text-red-400' : 'text-green-400'}>
            {Math.round(performance.lcp)}ms
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span>FID:</span>
          <span className={performance.fid > 100 ? 'text-red-400' : 'text-green-400'}>
            {Math.round(performance.fid)}ms
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span>CLS:</span>
          <span className={performance.cls > 0.1 ? 'text-red-400' : 'text-green-400'}>
            {performance.cls.toFixed(3)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span>FCP:</span>
          <span className={performance.fcp > 1800 ? 'text-orange-400' : 'text-green-400'}>
            {Math.round(performance.fcp)}ms
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// HOC for automatic layout wrapping
export const withPremiumLayout = (Component: React.ComponentType<any>) => {
  return function WrappedComponent(props: any) {
    return (
      <PremiumLayout>
        <Component {...props} />
      </PremiumLayout>
    );
  };
};

// Layout variant for full-screen components
export const FullScreenLayout = ({ children, className = "" }: { 
  children: ReactNode; 
  className?: string; 
}) => (
  <motion.div
    className={`min-h-screen ${className}`}
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {children}
  </motion.div>
);

// Layout variant for centered content
export const CenteredLayout = ({ children, className = "" }: { 
  children: ReactNode; 
  className?: string; 
}) => (
  <PremiumLayout className={`flex items-center justify-center min-h-screen ${className}`}>
    {children}
  </PremiumLayout>
);

// Layout variant for dashboard-style layouts
export const DashboardLayout = ({ children, sidebar, className = "" }: { 
  children: ReactNode; 
  sidebar?: ReactNode;
  className?: string; 
}) => (
  <PremiumLayout className={className}>
    <div className="flex h-screen">
      {sidebar && (
        <motion.aside
          className="w-64 bg-surface-secondary border-r border-surface-tertiary"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {sidebar}
        </motion.aside>
      )}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  </PremiumLayout>
);
