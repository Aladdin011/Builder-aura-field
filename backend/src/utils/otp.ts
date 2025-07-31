import crypto from "crypto";
import { logger } from "./logger";

// Generate a 6-digit OTP
export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

// Generate a more secure alphanumeric OTP
export const generateSecureOTP = (length: number = 8): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Validate OTP format
export const validateOTP = (otp: string): boolean => {
  // Check if OTP is 6 digits
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};

// Validate secure OTP format
export const validateSecureOTP = (otp: string, length: number = 8): boolean => {
  const otpRegex = new RegExp(`^[A-Z0-9]{${length}}$`);
  return otpRegex.test(otp);
};

// Verify OTP (alias for validateOTP for backward compatibility)
export const verifyOTP = validateOTP;

// Check if OTP is expired (legacy function for backward compatibility)
export const isOTPExpiredLegacy = (
  createdAt: Date,
  expiryMinutes: number = 15,
): boolean => {
  const now = new Date();
  const expiryTime = new Date(createdAt.getTime() + expiryMinutes * 60 * 1000);
  return now > expiryTime;
};

// Generate OTP with expiry information
export const generateOTPWithExpiry = (expiryMinutes: number = 10) => {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

  return {
    otp,
    expiresAt,
    expiryMinutes,
  };
};

// Check if OTP is expired
export const isOTPExpired = (expiresAt: Date): boolean => {
  return new Date() > expiresAt;
};

// Generate a hash for OTP (for additional security)
export const hashOTP = (otp: string): string => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

// Verify hashed OTP
export const verifyHashedOTP = (otp: string, hashedOTP: string): boolean => {
  const otpHash = hashOTP(otp);
  return otpHash === hashedOTP;
};

// Rate limiting for OTP generation
const otpRateLimits = new Map<string, { count: number; resetTime: number }>();

export const checkOTPRateLimit = (
  identifier: string,
  maxAttempts: number = 5,
  windowMinutes: number = 15,
): boolean => {
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;

  const current = otpRateLimits.get(identifier);

  if (!current || now > current.resetTime) {
    // Reset or create new rate limit entry
    otpRateLimits.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= maxAttempts) {
    logger.warn(`OTP rate limit exceeded for identifier: ${identifier}`);
    return false;
  }

  // Increment count
  current.count++;
  otpRateLimits.set(identifier, current);

  return true;
};

// Clean up expired rate limit entries
export const cleanupOTPRateLimits = (): void => {
  const now = Date.now();
  for (const [identifier, data] of otpRateLimits.entries()) {
    if (now > data.resetTime) {
      otpRateLimits.delete(identifier);
    }
  }
};

// Schedule cleanup every hour
setInterval(cleanupOTPRateLimits, 60 * 60 * 1000);

// OTP attempt tracking for security
const otpAttempts = new Map<
  string,
  { attempts: number; lastAttempt: number; blocked: boolean }
>();

export const trackOTPAttempt = (identifier: string, success: boolean): void => {
  const now = Date.now();
  const current = otpAttempts.get(identifier) || {
    attempts: 0,
    lastAttempt: 0,
    blocked: false,
  };

  if (success) {
    // Reset on successful verification
    otpAttempts.delete(identifier);
    return;
  }

  // Increment failed attempts
  current.attempts++;
  current.lastAttempt = now;

  // Block after 5 failed attempts
  if (current.attempts >= 5) {
    current.blocked = true;
    logger.warn(`OTP attempts blocked for identifier: ${identifier}`);
  }

  otpAttempts.set(identifier, current);
};

export const isOTPBlocked = (identifier: string): boolean => {
  const current = otpAttempts.get(identifier);
  if (!current) return false;

  // Unblock after 1 hour
  const oneHour = 60 * 60 * 1000;
  if (current.blocked && Date.now() - current.lastAttempt > oneHour) {
    otpAttempts.delete(identifier);
    return false;
  }

  return current.blocked;
};

// Generate OTP for specific use cases
export const generateEmailVerificationOTP = () => {
  return generateOTPWithExpiry(10); // 10 minutes expiry
};

export const generatePasswordResetOTP = () => {
  return generateOTPWithExpiry(15); // 15 minutes expiry
};

export const generateLoginVerificationOTP = () => {
  return generateOTPWithExpiry(5); // 5 minutes expiry
};

export const generatePhoneVerificationOTP = () => {
  return generateOTPWithExpiry(10); // 10 minutes expiry
};

// Utility to format OTP for display
export const formatOTPForDisplay = (otp: string): string => {
  // Format as XXX-XXX for better readability
  if (otp.length === 6) {
    return `${otp.slice(0, 3)}-${otp.slice(3)}`;
  }
  return otp;
};

// Generate backup codes (for 2FA)
export const generateBackupCodes = (count: number = 10): string[] => {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    codes.push(generateSecureOTP(8));
  }
  return codes;
};

export default {
  generateOTP,
  generateSecureOTP,
  validateOTP,
  validateSecureOTP,
  generateOTPWithExpiry,
  isOTPExpired,
  hashOTP,
  verifyHashedOTP,
  checkOTPRateLimit,
  trackOTPAttempt,
  isOTPBlocked,
  generateEmailVerificationOTP,
  generatePasswordResetOTP,
  generateLoginVerificationOTP,
  generatePhoneVerificationOTP,
  formatOTPForDisplay,
  generateBackupCodes,
};
