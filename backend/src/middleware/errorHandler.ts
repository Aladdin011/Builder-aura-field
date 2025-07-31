import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
  details?: any;
}

/**
 * Global error handling middleware
 */
export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Log the error
  logger.error("Error occurred", {
    message: error.message,
    stack: error.stack,
    statusCode: error.statusCode,
    code: error.code,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    userId: (req as any).user?.id,
  });

  // Default error values
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal Server Error";
  let code = error.code || "INTERNAL_ERROR";
  let details = error.details;

  // Handle specific error types
  switch (error.name) {
    case "ValidationError":
      statusCode = 400;
      message = "Validation Error";
      code = "VALIDATION_ERROR";
      break;

    case "CastError":
      statusCode = 400;
      message = "Invalid ID format";
      code = "INVALID_ID";
      break;

    case "JsonWebTokenError":
      statusCode = 401;
      message = "Invalid token";
      code = "INVALID_TOKEN";
      break;

    case "TokenExpiredError":
      statusCode = 401;
      message = "Token expired";
      code = "TOKEN_EXPIRED";
      break;

    case "MulterError":
      statusCode = 400;
      if (error.code === "LIMIT_FILE_SIZE") {
        message = "File too large";
        code = "FILE_TOO_LARGE";
      } else if (error.code === "LIMIT_FILE_COUNT") {
        message = "Too many files";
        code = "TOO_MANY_FILES";
      } else {
        message = "File upload error";
        code = "UPLOAD_ERROR";
      }
      break;
  }

  // Handle Prisma errors
  if (error.message.includes("Unique constraint")) {
    statusCode = 409;
    message = "Resource already exists";
    code = "DUPLICATE_RESOURCE";

    // Extract field name from Prisma error
    const fieldMatch = error.message.match(/Key \(([^)]+)\)/);
    if (fieldMatch) {
      details = { field: fieldMatch[1] };
    }
  }

  if (error.message.includes("Foreign key constraint")) {
    statusCode = 400;
    message = "Invalid reference";
    code = "INVALID_REFERENCE";
  }

  if (error.message.includes("Record to delete does not exist")) {
    statusCode = 404;
    message = "Resource not found";
    code = "RESOURCE_NOT_FOUND";
  }

  // Handle rate limiting errors
  if (error.message.includes("Too many requests")) {
    statusCode = 429;
    message = "Too many requests";
    code = "RATE_LIMIT_EXCEEDED";
  }

  // Don't leak sensitive information in production
  if (process.env.NODE_ENV === "production" && statusCode === 500) {
    message = "Something went wrong";
    details = undefined;
  }

  // Send error response
  const response: any = {
    success: false,
    error: message,
    code,
  };

  if (details) {
    response.details = details;
  }

  if (process.env.NODE_ENV === "development" && error.stack) {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * Handle 404 errors
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error: AppError = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  error.code = "ROUTE_NOT_FOUND";
  next(error);
};

/**
 * Create custom error
 */
export const createError = (
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: any,
): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  if (code) {
    error.code = code;
  }
  error.details = details;
  error.isOperational = true;
  return error;
};

/**
 * Async error wrapper
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
