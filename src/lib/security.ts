// Content Security Policy Configuration
export const cspConfig = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // For inline scripts (minimize in production)
    "'unsafe-eval'", // Required for Google Analytics gtag function
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://connect.facebook.net',
    'https://cdn.builder.io'
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // For CSS-in-JS and Tailwind
    'https://fonts.googleapis.com'
  ],
  'img-src': [
    "'self'",
    'data:',
    'https:',
    'https://cdn.builder.io',
    'https://images.unsplash.com'
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com'
  ],
  'connect-src': [
    "'self'",
    'https://api.jdmarc.com',
    'https://www.google-analytics.com',
    'https://vitals.vercel-analytics.com'
  ],
  'media-src': [
    "'self'",
    'https://cdn.builder.io'
  ],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
};

// Generate CSP header string
export const generateCSPHeader = (): string => {
  return Object.entries(cspConfig)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive.replace(/-/g, '-');
      }
      return `${directive.replace(/-/g, '-')} ${sources.join(' ')}`;
    })
    .join('; ');
};

// Apply CSP to the document
export const applyCSP = (): void => {
  if (typeof document !== 'undefined') {
    // Only apply CSP in production to avoid development issues
    if (process.env.NODE_ENV === 'production') {
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = generateCSPHeader();
      document.head.appendChild(meta);
    } else {
      // In development, log the CSP that would be applied
      console.log('CSP (disabled in development):', generateCSPHeader());
    }
  }
};

// Rate Limiting System
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: () => string;
  skipSuccessful?: boolean;
  skipFailedRequests?: boolean;
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private config: Required<RateLimitConfig>;

  constructor(config: RateLimitConfig) {
    this.config = {
      keyGenerator: () => this.getClientIdentifier(),
      skipSuccessful: false,
      skipFailedRequests: false,
      ...config,
    };
  }

  private getClientIdentifier(): string {
    // In a real browser environment, use a combination of factors
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    ].join('|');

    // Simple hash function for fingerprinting
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return `client_${Math.abs(hash)}`;
  }

  check(): { allowed: boolean; remaining: number; resetTime: Date } {
    const key = this.config.keyGenerator();
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Get existing requests for this key
    const existingRequests = this.requests.get(key) || [];

    // Filter out requests outside the current window
    const requestsInWindow = existingRequests.filter(time => time > windowStart);

    // Check if we're over the limit
    const allowed = requestsInWindow.length < this.config.maxRequests;
    const remaining = Math.max(0, this.config.maxRequests - requestsInWindow.length);

    if (allowed) {
      // Add this request to the list
      requestsInWindow.push(now);
      this.requests.set(key, requestsInWindow);
    }

    // Calculate reset time
    const resetTime = new Date(now + this.config.windowMs);

    return { allowed, remaining, resetTime };
  }

  reset(key?: string): void {
    if (key) {
      this.requests.delete(key);
    } else {
      this.requests.clear();
    }
  }
}

// Form submission rate limiter
export const formRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 form submissions per 15 minutes
});

// API request rate limiter
export const apiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 API requests per minute
});

// Input Sanitization
interface SanitizationConfig {
  stripHtml: boolean;
  escapeHtml: boolean;
  maxLength: number;
  allowedTags?: string[];
  allowedAttributes?: string[];
}

class InputSanitizer {
  private config: SanitizationConfig;

  constructor(config: SanitizationConfig) {
    this.config = config;
  }

  sanitize(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    let sanitized = input;

    // Trim and limit length
    sanitized = sanitized.trim();
    if (sanitized.length > this.config.maxLength) {
      sanitized = sanitized.substring(0, this.config.maxLength);
    }

    // Strip or escape HTML
    if (this.config.stripHtml) {
      sanitized = this.stripHtml(sanitized);
    } else if (this.config.escapeHtml) {
      sanitized = this.escapeHtml(sanitized);
    }

    // Remove dangerous patterns
    sanitized = this.removeDangerousPatterns(sanitized);

    return sanitized;
  }

  private stripHtml(input: string): string {
    // Create a temporary DOM element to strip HTML
    if (typeof document !== 'undefined') {
      const temp = document.createElement('div');
      temp.innerHTML = input;
      return temp.textContent || temp.innerText || '';
    }

    // Fallback regex-based HTML stripping
    return input.replace(/<[^>]*>/g, '');
  }

  private escapeHtml(input: string): string {
    const escapeMap: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };

    return input.replace(/[&<>"'/]/g, (char) => escapeMap[char]);
  }

  private removeDangerousPatterns(input: string): string {
    // Remove common XSS patterns
    const dangerousPatterns = [
      /javascript:/gi,
      /data:text\/html/gi,
      /vbscript:/gi,
      /onload=/gi,
      /onerror=/gi,
      /onclick=/gi,
      /onmouseover=/gi,
      /<script/gi,
      /<iframe/gi,
      /<object/gi,
      /<embed/gi,
      /<form/gi,
    ];

    dangerousPatterns.forEach(pattern => {
      input = input.replace(pattern, '');
    });

    return input;
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  validatePhone(phone: string): boolean {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Check if it's a valid length (7-15 digits)
    return cleaned.length >= 7 && cleaned.length <= 15;
  }

  validateURL(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }
}

// Pre-configured sanitizers
export const generalSanitizer = new InputSanitizer({
  stripHtml: true,
  escapeHtml: true,
  maxLength: 1000,
});

export const messageSanitizer = new InputSanitizer({
  stripHtml: true,
  escapeHtml: true,
  maxLength: 5000,
});

export const nameSanitizer = new InputSanitizer({
  stripHtml: true,
  escapeHtml: true,
  maxLength: 100,
});

// Security Headers
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

// Apply security headers (for client-side applications, this would be done by the server)
export const applySecurityHeaders = (): void => {
  // Note: In a real application, these headers should be set by the server
  // This is for demonstration purposes only
  if (typeof document !== 'undefined') {
    Object.entries(securityHeaders).forEach(([header, value]) => {
      const meta = document.createElement('meta');
      meta.httpEquiv = header;
      meta.content = value;
      document.head.appendChild(meta);
    });
  }
};

// Secure Form Handler
interface SecureFormOptions {
  rateLimiter?: RateLimiter;
  sanitizer?: InputSanitizer;
  csrfProtection?: boolean;
  honeypot?: boolean;
}

export class SecureFormHandler {
  private options: SecureFormOptions;

  constructor(options: SecureFormOptions = {}) {
    this.options = {
      rateLimiter: formRateLimiter,
      sanitizer: generalSanitizer,
      csrfProtection: true,
      honeypot: true,
      ...options,
    };
  }

  validateSubmission(formData: Record<string, any>): {
    valid: boolean;
    errors: string[];
    sanitizedData: Record<string, any>;
  } {
    const errors: string[] = [];
    const sanitizedData: Record<string, any> = {};

    // Rate limiting check
    if (this.options.rateLimiter) {
      const rateLimitResult = this.options.rateLimiter.check();
      if (!rateLimitResult.allowed) {
        errors.push(`Too many requests. Please try again after ${rateLimitResult.resetTime.toLocaleTimeString()}`);
        return { valid: false, errors, sanitizedData };
      }
    }

    // Honeypot check (anti-bot)
    if (this.options.honeypot && formData.website) {
      // If honeypot field is filled, it's likely a bot
      errors.push('Spam submission detected');
      return { valid: false, errors, sanitizedData };
    }

    // Sanitize and validate each field
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'string' && this.options.sanitizer) {
        sanitizedData[key] = this.options.sanitizer.sanitize(value);

        // Additional validation based on field type
        if (key.toLowerCase().includes('email')) {
          if (!this.options.sanitizer.validateEmail(sanitizedData[key])) {
            errors.push('Invalid email address');
          }
        } else if (key.toLowerCase().includes('phone')) {
          if (!this.options.sanitizer.validatePhone(sanitizedData[key])) {
            errors.push('Invalid phone number');
          }
        } else if (key.toLowerCase().includes('url') || key.toLowerCase().includes('website')) {
          if (sanitizedData[key] && !this.options.sanitizer.validateURL(sanitizedData[key])) {
            errors.push('Invalid URL');
          }
        }
      } else {
        sanitizedData[key] = value;
      }
    });

    // Check for required fields
    const requiredFields = ['name', 'email', 'message'];
    requiredFields.forEach(field => {
      if (!sanitizedData[field] || sanitizedData[field].trim() === '') {
        errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      sanitizedData,
    };
  }
}

// CSRF Protection
class CSRFProtection {
  private tokenKey = 'jdmarc_csrf_token';

  generateToken(): string {
    const token = this.generateRandomString(32);
    sessionStorage.setItem(this.tokenKey, token);
    return token;
  }

  validateToken(token: string): boolean {
    const storedToken = sessionStorage.getItem(this.tokenKey);
    return storedToken === token && token.length === 32;
  }

  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

export const csrfProtection = new CSRFProtection();

// Security Event Logger
interface SecurityEvent {
  type: 'rate_limit_exceeded' | 'invalid_input' | 'csrf_violation' | 'suspicious_activity';
  timestamp: Date;
  details: any;
  clientId: string;
}

class SecurityLogger {
  private events: SecurityEvent[] = [];

  logEvent(type: SecurityEvent['type'], details: any): void {
    const event: SecurityEvent = {
      type,
      timestamp: new Date(),
      details,
      clientId: this.getClientId(),
    };

    this.events.push(event);

    // In production, send to security monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToSecurityService(event);
    } else {
      console.warn('Security Event:', event);
    }
  }

  private getClientId(): string {
    return sessionStorage.getItem('client_id') || 'anonymous';
  }

  private sendToSecurityService(event: SecurityEvent): void {
    // Implementation for sending to security monitoring service
    // Example: Sentry, DataDog, CloudFlare, etc.
  }

  getEvents(): SecurityEvent[] {
    return [...this.events];
  }
}

export const securityLogger = new SecurityLogger();

// Initialize security measures
export const initializeSecurity = (): void => {
  // Apply CSP
  applyCSP();
  
  // Apply security headers (client-side demonstration)
  applySecurityHeaders();
  
  // Set up global error handling for security events
  window.addEventListener('error', (event) => {
    if (event.message.includes('Content Security Policy')) {
      securityLogger.logEvent('csrf_violation', {
        message: event.message,
        source: event.filename,
        line: event.lineno,
      });
    }
  });
};

// Utility function to check if running in secure context
export const isSecureContext = (): boolean => {
  return window.isSecureContext && location.protocol === 'https:';
};

// Password strength validator
export const validatePasswordStrength = (password: string): {
  score: number;
  feedback: string[];
  isStrong: boolean;
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('Password should be at least 8 characters long');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Include lowercase letters');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Include uppercase letters');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Include numbers');

  if (/[^a-zA-Z\d]/.test(password)) score += 1;
  else feedback.push('Include special characters');

  return {
    score,
    feedback,
    isStrong: score >= 4,
  };
};
