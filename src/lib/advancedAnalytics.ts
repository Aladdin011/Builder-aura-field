import { useAppStore } from '@/stores/appStore';

// Core Web Vitals and Performance Metrics
export interface WebVitalsMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
  timestamp: Date;
}

export interface UserJourneyData {
  sessionId: string;
  userId?: string;
  startTime: Date;
  currentPage: string;
  previousPage?: string;
  referrer: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  deviceInfo: {
    userAgent: string;
    screenResolution: string;
    viewport: { width: number; height: number };
    deviceType: 'mobile' | 'tablet' | 'desktop';
    browser: string;
    os: string;
  };
  interactions: Array<{
    type: string;
    element: string;
    timestamp: Date;
    value?: any;
    coordinates?: { x: number; y: number };
  }>;
}

export interface ConversionMetrics {
  conversionRate: number;
  funnelSteps: Array<{
    step: string;
    completions: number;
    dropoffs: number;
    conversionRate: number;
  }>;
  averageTimeToConvert: number;
  topConversionPaths: string[];
  revenueAttribution: number;
}

export interface EngagementMetrics {
  timeOnPage: number;
  scrollDepth: number;
  clickThroughRate: number;
  bounceRate: number;
  pagesPerSession: number;
  returnVisitorRate: number;
  socialShares: number;
  downloadRate: number;
}

// Advanced Analytics Engine
export class AdvancedAnalyticsEngine {
  private sessionId: string;
  private userId?: string;
  private startTime: Date;
  private events: Array<any> = [];
  private performanceObserver?: PerformanceObserver;
  
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = new Date();
    this.initializeTracking();
  }
  
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private initializeTracking() {
    this.setupPerformanceMonitoring();
    this.setupUserInteractionTracking();
    this.setupNavigationTracking();
    this.setupErrorTracking();
    this.setupConversionTracking();
  }
  
  // Performance Monitoring
  private setupPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      // Monitor Core Web Vitals
      this.performanceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.trackPerformanceMetric(entry);
        });
      });
      
      this.performanceObserver.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    }
    
    // Monitor resource loading
    window.addEventListener('load', () => {
      this.trackResourcePerformance();
    });
  }
  
  private trackPerformanceMetric(entry: PerformanceEntry) {
    const { updatePerformance } = useAppStore.getState();
    
    switch (entry.entryType) {
      case 'largest-contentful-paint':
        updatePerformance({ lcp: (entry as any).startTime });
        break;
      case 'first-input':
        updatePerformance({ fid: (entry as any).processingStart - entry.startTime });
        break;
      case 'layout-shift':
        if (!(entry as any).hadRecentInput) {
          updatePerformance({ cls: (entry as any).value });
        }
        break;
      case 'paint':
        if (entry.name === 'first-contentful-paint') {
          updatePerformance({ fcp: entry.startTime });
        }
        break;
    }
  }
  
  private trackResourcePerformance() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const { updatePerformance } = useAppStore.getState();
    
    updatePerformance({
      ttfb: navigation.responseStart - navigation.fetchStart
    });
    
    // Track slow resources
    const resources = performance.getEntriesByType('resource');
    const slowResources = resources.filter(resource => resource.duration > 1000);
    
    if (slowResources.length > 0) {
      this.trackEvent('performance', 'slow_resources', {
        count: slowResources.length,
        resources: slowResources.map(r => ({ name: r.name, duration: r.duration }))
      });
    }
  }
  
  // User Interaction Tracking
  private setupUserInteractionTracking() {
    try {
      // Click tracking with heat mapping - throttled to prevent spam
      let lastClickTime = 0;
      let lastClickElement: HTMLElement | null = null;
      const CLICK_THROTTLE_MS = 1000; // Increased throttle time

      document.addEventListener('click', (event) => {
        try {
          const now = Date.now();
          const target = event.target as HTMLElement;

          // Enhanced throttling: check both time and element
          if ((now - lastClickTime < CLICK_THROTTLE_MS) && lastClickElement === target) {
            return; // Throttle rapid clicks on same element
          }

          // Only track significant interactions
          if (this.shouldTrackElement(target)) {
            lastClickTime = now;
            lastClickElement = target;
            this.trackInteraction('click', event);
          }
        } catch (error) {
          // Reduce console noise - only log severe errors
          if (error instanceof Error && error.message.includes('Cannot read')) {
            console.warn('Click tracking error:', error.message);
          }
        }
      }, { passive: true });

      // Scroll depth tracking - throttled
      let maxScrollDepth = 0;
      let scrollTimeout: NodeJS.Timeout | null = null;

      document.addEventListener('scroll', () => {
        if (scrollTimeout) return; // Throttle scroll events

        scrollTimeout = setTimeout(() => {
          try {
            const scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
            const scrollDepth = Math.round((window.scrollY / (scrollHeight - window.innerHeight)) * 100);

            if (scrollDepth > maxScrollDepth && scrollDepth % 25 === 0 && scrollDepth <= 100) {
              maxScrollDepth = scrollDepth;
              this.trackEvent('engagement', 'scroll_depth', { depth: scrollDepth });
            }
          } catch (error) {
            // Silent fail for scroll tracking
          }
          scrollTimeout = null;
        }, 250); // 250ms throttle
      }, { passive: true });

      // Form interaction tracking
      document.addEventListener('focus', (event) => {
        try {
          if ((event.target as HTMLElement).tagName === 'INPUT' || (event.target as HTMLElement).tagName === 'TEXTAREA') {
            this.trackInteraction('form_focus', event);
          }
        } catch (error) {
          console.warn('Form interaction tracking error:', error);
        }
      }, { passive: true });

      // Time on page tracking
      let startTime = Date.now();
      document.addEventListener('beforeunload', () => {
        try {
          const timeOnPage = Date.now() - startTime;
          this.trackEvent('engagement', 'time_on_page', { duration: timeOnPage });
        } catch (error) {
          console.warn('Time tracking error:', error);
        }
      });
    } catch (error) {
      console.warn('Failed to setup user interaction tracking:', error);
    }
  }
  
  private shouldTrackElement(element: HTMLElement): boolean {
    if (!element || !element.tagName) return false;

    // Skip tracking for certain elements to reduce noise
    const skipElements = ['HTML', 'BODY', 'DIV', 'SPAN', 'SVG', 'PATH'];
    if (skipElements.includes(element.tagName)) return false;

    // Only track meaningful interactions
    const trackableElements = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'];
    const hasClickHandler = element.onclick || element.getAttribute('data-track') === 'true';
    const isTrackableTag = trackableElements.includes(element.tagName);
    const hasRole = element.getAttribute('role') === 'button' || element.getAttribute('role') === 'link';
    const hasAriaLabel = element.getAttribute('aria-label');

    // Additional check for disabled elements
    if (element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true') {
      return false;
    }

    return isTrackableTag || hasClickHandler || hasRole || hasAriaLabel;
  }

  private trackInteraction(type: string, event: Event) {
    try {
      const target = event.target as HTMLElement;
      if (!target) return;

      const element = this.getElementSelector(target);
      if (!element) return;

      const interactionData = {
        type,
        element,
        timestamp: new Date(),
        coordinates: type === 'click' && event instanceof MouseEvent ? {
          x: event.clientX || 0,
          y: event.clientY || 0
        } : undefined,
        value: this.getSafeElementValue(target),
      };

      this.trackEvent('interaction', type, interactionData);

      // Update app store safely
      try {
        const { trackUserInteraction } = useAppStore.getState();
        if (trackUserInteraction) {
          trackUserInteraction(`${type}-${element}`);
        }
      } catch (storeError) {
        // Silent fail for store updates
      }
    } catch (error) {
      // Silent fail for interaction tracking
    }
  }

  private getSafeElementValue(element: HTMLElement): string {
    try {
      if (element instanceof HTMLInputElement) {
        return element.value?.slice(0, 100) || '';
      }
      if (element instanceof HTMLTextAreaElement) {
        return element.value?.slice(0, 100) || '';
      }
      return element.textContent?.slice(0, 100) || '';
    } catch {
      return '';
    }
  }
  
  private getElementSelector(element: HTMLElement): string {
    try {
      if (!element || !element.tagName) return 'unknown';

      // Create a unique selector for the element
      if (element.id && typeof element.id === 'string') {
        return `#${element.id}`;
      }

      if (element.className && typeof element.className === 'string') {
        const firstClass = element.className.trim().split(' ')[0];
        if (firstClass) {
          return `.${firstClass}`;
        }
      }

      // Check for data attributes
      if (element.getAttribute && element.getAttribute('data-testid')) {
        return `[data-testid="${element.getAttribute('data-testid')}"]`;
      }

      return element.tagName.toLowerCase();
    } catch {
      return 'unknown';
    }
  }
  
  // Navigation and Page View Tracking
  private setupNavigationTracking() {
    // SPA navigation tracking
    let currentPage = window.location.pathname;
    
    const trackPageView = () => {
      const newPage = window.location.pathname;
      if (newPage !== currentPage) {
        this.trackEvent('navigation', 'page_view', {
          from: currentPage,
          to: newPage,
          timestamp: new Date()
        });
        currentPage = newPage;
      }
    };
    
    // Listen for SPA navigation
    window.addEventListener('popstate', trackPageView);
    
    // Override history methods for SPA tracking
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(trackPageView, 0);
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(trackPageView, 0);
    };
  }
  
  // Error Tracking
  private setupErrorTracking() {
    try {
      window.addEventListener('error', (event) => {
        try {
          this.trackEvent('error', 'javascript_error', {
            message: event.message,
            filename: event.filename,
            line: event.lineno,
            column: event.colno,
            stack: event.error?.stack,
            timestamp: new Date()
          });
        } catch (trackingError) {
          console.warn('Error tracking failed:', trackingError);
        }
      }, { passive: true });

      window.addEventListener('unhandledrejection', (event) => {
        try {
          this.trackEvent('error', 'promise_rejection', {
            reason: event.reason,
            timestamp: new Date()
          });
        } catch (trackingError) {
          console.warn('Promise rejection tracking failed:', trackingError);
        }
      }, { passive: true });
    } catch (error) {
      console.warn('Failed to setup error tracking:', error);
    }
  }
  
  // Conversion Tracking
  private setupConversionTracking() {
    // Track specific conversion events
    const conversionEvents = [
      'contact-form-submit',
      'phone-click',
      'email-click',
      'project-inquiry',
      'consultation-request',
      'portfolio-download'
    ];
    
    conversionEvents.forEach(eventType => {
      document.addEventListener(eventType, (event: any) => {
        this.trackConversion(eventType, event.detail);
      });
    });
  }
  
  trackConversion(type: string, data?: any) {
    const conversionData = {
      type,
      timestamp: new Date(),
      sessionId: this.sessionId,
      userId: this.userId,
      page: window.location.pathname,
      referrer: document.referrer,
      data
    };
    
    this.trackEvent('conversion', type, conversionData);
    
    // Update conversion funnel
    this.updateConversionFunnel(type);
  }
  
  private updateConversionFunnel(conversionType: string) {
    const funnelSteps = [
      'page_view',
      'portfolio_view',
      'service_view',
      'contact_form_view',
      'contact_form_submit'
    ];
    
    const currentStepIndex = funnelSteps.indexOf(conversionType);
    if (currentStepIndex !== -1) {
      // Track progression through funnel
      this.trackEvent('funnel', 'step_completion', {
        step: conversionType,
        stepIndex: currentStepIndex,
        timestamp: new Date()
      });
    }
  }
  
  // A/B Testing
  assignABTestVariant(testName: string, variants: string[]): string {
    const existingVariant = localStorage.getItem(`ab_test_${testName}`);
    if (existingVariant && variants.includes(existingVariant)) {
      return existingVariant;
    }
    
    const variant = variants[Math.floor(Math.random() * variants.length)];
    localStorage.setItem(`ab_test_${testName}`, variant);
    
    this.trackEvent('ab_test', 'variant_assigned', {
      testName,
      variant,
      timestamp: new Date()
    });
    
    return variant;
  }
  
  trackABTestConversion(testName: string, variant: string, conversionType: string) {
    this.trackEvent('ab_test', 'conversion', {
      testName,
      variant,
      conversionType,
      timestamp: new Date()
    });
  }
  
  // Heat Map Data Collection
  collectHeatMapData(element: HTMLElement, eventType: 'click' | 'hover' | 'scroll') {
    const rect = element.getBoundingClientRect();
    const heatMapData = {
      element: this.getElementSelector(element),
      eventType,
      coordinates: {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      timestamp: new Date()
    };
    
    this.trackEvent('heatmap', eventType, heatMapData);
  }
  
  // Core tracking method
  trackEvent(category: string, action: string, data?: any) {
    try {
      if (!category || !action) return;

      const event = {
        category: String(category),
        action: String(action),
        data: data || {},
        timestamp: new Date(),
        sessionId: this.sessionId,
        userId: this.userId,
        page: window.location?.pathname || '',
        userAgent: navigator?.userAgent || '',
      };

      // Prevent event overflow
      if (this.events.length > 1000) {
        this.events = this.events.slice(-500); // Keep last 500 events
      }

      this.events.push(event);

      // Send to analytics service (implement your preferred analytics service)
      this.sendToAnalytics(event);

      // Update app store if relevant
      this.updateAppStore(event);
    } catch (error) {
      // Silent fail for event tracking to not break the app
    }
  }
  
  private sendToAnalytics(event: any) {
    try {
      // In a real implementation, send to your analytics service
      // Examples: Google Analytics, Mixpanel, Amplitude, etc.

      // Google Analytics 4 example:
      if (typeof gtag !== 'undefined') {
        gtag('event', event.action, {
          event_category: event.category,
          event_label: event.data?.element || '',
          value: event.data?.value || 0,
          custom_parameter_1: event.sessionId,
        });
      }

      // Minimal console logging for development - only critical events
      if (process.env.NODE_ENV === 'development') {
        const criticalCategories = ['error', 'conversion'];
        const importantActions = ['javascript_error', 'contact_form_submit', 'phone_click'];

        if (criticalCategories.includes(event.category) || importantActions.includes(event.action)) {
          console.log('Analytics Event:', {
            category: event.category,
            action: event.action,
            timestamp: event.timestamp.toISOString()
          });
        }
      }
    } catch (error) {
      // Silent fail for analytics to not break the app
      if (process.env.NODE_ENV === 'development') {
        console.warn('Analytics send failed:', error);
      }
    }
  }
  
  private updateAppStore(event: any) {
    try {
      const state = useAppStore.getState();
      if (!state || !state.updateAnalytics) return;

      const { updateAnalytics } = state;

      // Update relevant analytics in app store
      if (event.category === 'engagement') {
        updateAnalytics({
          lastInteraction: event.timestamp
        });
      }
    } catch (error) {
      // Silent fail for app store updates
    }
  }
  
  // Data Export and Reporting
  exportData(format: 'json' | 'csv' = 'json') {
    const data = {
      sessionId: this.sessionId,
      userId: this.userId,
      startTime: this.startTime,
      events: this.events,
      summary: this.generateSummary()
    };
    
    if (format === 'csv') {
      return this.convertToCSV(data);
    }
    
    return JSON.stringify(data, null, 2);
  }
  
  private generateSummary() {
    const totalEvents = this.events.length;
    const eventsByCategory = this.events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const sessionDuration = Date.now() - this.startTime.getTime();
    
    return {
      totalEvents,
      eventsByCategory,
      sessionDuration,
      pagesViewed: new Set(this.events.filter(e => e.category === 'navigation').map(e => e.page)).size
    };
  }
  
  private convertToCSV(data: any): string {
    const headers = ['timestamp', 'category', 'action', 'page', 'element', 'value'];
    const rows = data.events.map((event: any) => [
      event.timestamp.toISOString(),
      event.category,
      event.action,
      event.page,
      event.data?.element || '',
      event.data?.value || ''
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
  
  // Cleanup
  destroy() {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    
    // Send final batch of events
    this.trackEvent('session', 'end', {
      duration: Date.now() - this.startTime.getTime(),
      eventCount: this.events.length
    });
  }
}

// Singleton instance
export const advancedAnalytics = new AdvancedAnalyticsEngine();

// React hook for easy usage
export const useAdvancedAnalytics = () => {
  return {
    trackEvent: advancedAnalytics.trackEvent.bind(advancedAnalytics),
    trackConversion: advancedAnalytics.trackConversion.bind(advancedAnalytics),
    assignABTestVariant: advancedAnalytics.assignABTestVariant.bind(advancedAnalytics),
    trackABTestConversion: advancedAnalytics.trackABTestConversion.bind(advancedAnalytics),
    collectHeatMapData: advancedAnalytics.collectHeatMapData.bind(advancedAnalytics),
    exportData: advancedAnalytics.exportData.bind(advancedAnalytics),
  };
};

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  advancedAnalytics.destroy();
});
