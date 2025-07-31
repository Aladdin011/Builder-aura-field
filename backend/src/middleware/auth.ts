import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/database";
import { logger } from "../utils/logger";

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        userId: string;
        sessionId: string;
        role: string;
        email: string;
      };
    }
  }
}

interface JWTPayload {
  userId: string;
  sessionId: string;
  type: "access" | "refresh";
  iat: number;
  exp: number;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

/**
 * Generate JWT tokens
 */
export const generateTokens = (
  userId: string,
  sessionId: string,
): TokenPair => {
  const accessToken = jwt.sign(
    { userId, sessionId, type: "access" },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" } as jwt.SignOptions,
  );

  const refreshToken = jwt.sign(
    { userId, sessionId, type: "refresh" },
    (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET) as string,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" } as jwt.SignOptions,
  );

  return {
    accessToken,
    refreshToken,
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  };
};

/**
 * Main authentication middleware
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Access token is required",
        code: "NO_TOKEN",
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify JWT token
    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    } catch (jwtError: any) {
      logger.warn("Invalid token attempt", {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        error: jwtError.message,
      });

      return res.status(401).json({
        success: false,
        error: "Invalid or expired token",
        code: "INVALID_TOKEN",
      });
    }

    // Check if it's an access token
    if (decoded.type !== "access") {
      return res.status(401).json({
        success: false,
        error: "Invalid token type",
        code: "INVALID_TOKEN_TYPE",
      });
    }

    // Verify session exists and is active
    const session = await prisma.userSession.findUnique({
      where: { id: decoded.sessionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            isEmailVerified: true,
          },
        },
      },
    });

    if (!session || !session.isActive) {
      return res.status(401).json({
        success: false,
        error: "Session not found or inactive",
        code: "INVALID_SESSION",
      });
    }

    if (!session.user.isActive) {
      return res.status(401).json({
        success: false,
        error: "User account is disabled",
        code: "ACCOUNT_DISABLED",
      });
    }

    // Update last activity
    await prisma.userSession.update({
      where: { id: decoded.sessionId },
      data: { lastActivity: new Date() },
    });

    // Attach user info to request
    req.user = {
      id: session.user.id,
      userId: session.user.id,
      sessionId: decoded.sessionId,
      role: session.user.role,
      email: session.user.email,
    };

    next();
  } catch (error: any) {
    logger.error("Authentication middleware error", {
      error: error.message,
      stack: error.stack,
      ip: req.ip,
    });

    return res.status(500).json({
      success: false,
      error: "Authentication failed",
      code: "AUTH_ERROR",
    });
  }
};

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(); // No token, continue without user
  }

  try {
    await authenticateToken(req, res, next);
  } catch (error) {
    // If auth fails, continue without user (don't throw error)
    next();
  }
};

/**
 * Role-based access control middleware
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
        code: "AUTH_REQUIRED",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn("Unauthorized access attempt", {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: allowedRoles,
        endpoint: req.path,
        method: req.method,
        ip: req.ip,
      });

      return res.status(403).json({
        success: false,
        error: "Insufficient permissions",
        code: "INSUFFICIENT_PERMISSIONS",
      });
    }

    next();
  };
};

/**
 * Email verification requirement middleware
 */
export const requireEmailVerification = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
      code: "AUTH_REQUIRED",
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { isEmailVerified: true },
  });

  if (!user?.isEmailVerified) {
    return res.status(403).json({
      success: false,
      error: "Email verification required",
      code: "EMAIL_VERIFICATION_REQUIRED",
    });
  }

  next();
};

/**
 * Validate refresh token
 */
export const validateRefreshToken = async (
  refreshToken: string,
): Promise<{ userId: string; sessionId: string } | null> => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!,
    ) as JWTPayload;

    if (decoded.type !== "refresh") {
      return null;
    }

    // Verify session exists and is active
    const session = await prisma.userSession.findUnique({
      where: {
        id: decoded.sessionId,
        refreshToken: refreshToken,
        isActive: true,
      },
      include: {
        user: {
          select: { id: true, isActive: true },
        },
      },
    });

    if (!session || !session.user.isActive) {
      return null;
    }

    return {
      userId: decoded.userId,
      sessionId: decoded.sessionId,
    };
  } catch (error) {
    return null;
  }
};

/**
 * Logout and invalidate session
 */
export const invalidateSession = async (sessionId: string): Promise<void> => {
  await prisma.userSession.update({
    where: { id: sessionId },
    data: {
      isActive: false,
      refreshToken: { set: null }, // Clear refresh token
    },
  });
};

/**
 * Logout all user sessions
 */
export const invalidateAllUserSessions = async (
  userId: string,
): Promise<void> => {
  await prisma.userSession.updateMany({
    where: { userId },
    data: {
      isActive: false,
      refreshToken: { set: null },
    },
  });
};

// Legacy exports for backward compatibility
export const authMiddleware = authenticateToken;
