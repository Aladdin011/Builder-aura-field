import express, { Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../utils/database";
import { generateOTP, verifyOTP, isOTPExpired } from "../utils/otp";
import { sendEmail } from "../utils/email";
import { logger } from "../utils/logger";
import { authenticateToken, generateTokens } from "../middleware/auth";
import {
  validateUserRegistration,
  validateUserLogin,
  validateOTP as validateOTPMiddleware,
} from "../middleware/validation";
import { createLeadScore } from "../services/leadScoring";
import { trackUserAnalytics } from "../services/analytics";
import { asyncHandler, createError } from "../middleware/errorHandler";

const router = express.Router();

// Validation schemas
const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  company: z.string().optional(),
  role: z.enum(["CLIENT", "ADMIN", "MANAGER", "CONTRACTOR"]).default("CLIENT"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  deviceInfo: z.string().optional(),
  rememberMe: z.boolean().default(false),
});

/**
 * User Registration
 */
router.post(
  "/register",
  asyncHandler(async (req: Request, res: Response) => {
    const validatedData = registerSchema.parse(req.body);
    const { firstName, lastName, email, password, phone, company, role } =
      validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw createError(
        "User with this email already exists",
        409,
        "USER_EXISTS",
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate email verification OTP
    const emailOTP = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone,
        company,
        role,
        isEmailVerified: false,
        analytics: {
          create: {
            ipAddress: req.ip || "unknown",
            userAgent: req.get("User-Agent") || "unknown",
            source: "registration",
            metadata: { registrationDate: new Date() },
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        company: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    // Store OTP for verification
    await prisma.otpVerification.create({
      data: {
        userId: user.id,
        email: email.toLowerCase(),
        otp: emailOTP,
        type: "EMAIL_VERIFICATION",
        expiresAt: otpExpiresAt,
      },
    });

    // Send verification email
    try {
      await sendEmail({
        to: email,
        subject: "Verify Your Email Address",
        template: "emailVerification",
        data: {
          firstName,
          verificationCode: emailOTP,
          companyName: "JD Marc Limited",
        },
      });
    } catch (emailError) {
      logger.error("Failed to send verification email", {
        userId: user.id,
        email,
        error: emailError,
      });
    }

    logger.info("User registered successfully", {
      userId: user.id,
      email,
      role,
    });

    res.status(201).json({
      success: true,
      data: user,
      message:
        "Registration successful. Please check your email for verification code.",
    });
  }),
);

/**
 * User Login
 */
router.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const validatedData = loginSchema.parse(req.body);
    const { email, password, deviceInfo, rememberMe } = validatedData;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw createError(
        "Invalid email or password",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    // Check if user is active
    if (!user.isActive) {
      throw createError(
        "Your account has been disabled",
        401,
        "ACCOUNT_DISABLED",
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createError(
        "Invalid email or password",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    // Create user session
    const expiresAt = new Date();
    if (rememberMe) {
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days
    } else {
      expiresAt.setDate(expiresAt.getDate() + 1); // 1 day
    }

    // Create session placeholder to get sessionId for tokens
    const sessionId = crypto.randomUUID();
    
    // Generate tokens with sessionId
    const tokens = generateTokens(user.id, sessionId);

    const session = await prisma.userSession.create({
      data: {
        id: sessionId,
        userId: user.id,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        deviceInfo: deviceInfo || "Unknown Device",
        ipAddress: req.ip || null,
        userAgent: req.get("User-Agent") || null,
        expiresAt,
        isActive: true,
        lastActivity: new Date(),
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    logger.info("User logged in successfully", {
      userId: user.id,
      email: user.email,
      sessionId: session.id,
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          company: user.company,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
        tokens,
      },
      message: "Login successful",
    });
  }),
);

/**
 * Verify OTP
 */
router.post(
  "/verify-otp",
  asyncHandler(async (req: Request, res: Response) => {
    const { email, otp, type } = req.body;

    // Find OTP record
    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        email: email.toLowerCase(),
        otp,
        type,
        isUsed: false,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      throw createError("Invalid or expired OTP", 400, "INVALID_OTP");
    }

    // Check if OTP is expired
    if (isOTPExpired(otpRecord.createdAt)) {
      throw createError("OTP has expired", 400, "OTP_EXPIRED");
    }

    // Mark OTP as used
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    });

    // If email verification, update user
    if (type === "EMAIL_VERIFICATION") {
      await prisma.user.update({
        where: { email: email.toLowerCase() },
        data: {
          isEmailVerified: true,
          emailVerifiedAt: new Date(),
        },
      });
    }

    logger.info("OTP verified successfully", {
      email,
      type,
    });

    res.json({
      success: true,
      message: "OTP verified successfully",
    });
  }),
);

/**
 * Get current user
 */
router.get(
  "/me",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        company: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        lastLoginAt: true,
        profile: true,
      },
    });

    if (!user) {
      throw createError("User not found", 404, "USER_NOT_FOUND");
    }

    res.json({
      success: true,
      data: user,
    });
  }),
);

/**
 * Logout
 */
router.post(
  "/logout",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.user!.sessionId;

    // Invalidate session
    await prisma.userSession.update({
      where: { id: sessionId },
      data: {
        isActive: false,
        refreshToken: { set: null },
      },
    });

    logger.info("User logged out", {
      userId: req.user!.id,
      sessionId,
    });

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  }),
);

export default router;
