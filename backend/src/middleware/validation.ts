import { Request, Response, NextFunction } from "express";
import { body, validationResult, ValidationChain } from "express-validator";
import { logger } from "../utils/logger";

/**
 * Validation middleware to handle express-validator results
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
): void | Response => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.type === "field" ? (error as any).path : "unknown",
      message: error.msg,
      value: error.type === "field" ? (error as any).value : undefined,
    }));

    logger.warn("Validation failed", {
      endpoint: req.path,
      method: req.method,
      errors: errorMessages,
      ip: req.ip,
    });

    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errorMessages,
      code: "VALIDATION_ERROR",
    });
  }

  next();
};

/**
 * User registration validation rules
 */
export const validateUserRegistration = [
  body("firstName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage(
      "First name can only contain letters, spaces, hyphens, and apostrophes",
    ),

  body("lastName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage(
      "Last name can only contain letters, spaces, hyphens, and apostrophes",
    ),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),

  body("password")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
    ),

  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),

  body("company")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Company name cannot exceed 100 characters"),

  body("role")
    .optional()
    .isIn(["CLIENT", "ADMIN", "MANAGER", "CONTRACTOR"])
    .withMessage("Invalid role specified"),

  handleValidationErrors,
];

/**
 * User login validation rules
 */
export const validateUserLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),

  body("password").notEmpty().withMessage("Password is required"),

  body("deviceInfo")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Device info cannot exceed 255 characters"),

  body("rememberMe")
    .optional()
    .isBoolean()
    .withMessage("Remember me must be a boolean value"),

  handleValidationErrors,
];

/**
 * Contact form validation rules
 */
export const validateContactForm = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage(
      "Name can only contain letters, spaces, hyphens, and apostrophes",
    ),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),

  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),

  body("company")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Company name cannot exceed 100 characters"),

  body("subject")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Subject must be between 5 and 200 characters"),

  body("message")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Message must be between 10 and 2000 characters"),

  body("projectType")
    .optional()
    .isIn([
      "RESIDENTIAL",
      "COMMERCIAL",
      "INDUSTRIAL",
      "RENOVATION",
      "CONSULTATION",
    ])
    .withMessage("Invalid project type specified"),

  body("budget")
    .optional()
    .isIn(["UNDER_10K", "10K_50K", "50K_100K", "100K_500K", "OVER_500K"])
    .withMessage("Invalid budget range specified"),

  body("timeline")
    .optional()
    .isIn(["ASAP", "WITHIN_MONTH", "WITHIN_QUARTER", "WITHIN_YEAR", "NO_RUSH"])
    .withMessage("Invalid timeline specified"),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Location cannot exceed 200 characters"),

  body("source")
    .optional()
    .isIn([
      "WEBSITE",
      "GOOGLE",
      "SOCIAL_MEDIA",
      "REFERRAL",
      "ADVERTISEMENT",
      "OTHER",
    ])
    .withMessage("Invalid source specified"),

  handleValidationErrors,
];

/**
 * OTP verification validation rules
 */
export const validateOTP = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),

  body("otp")
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage("OTP must be a 6-digit number"),

  body("type")
    .isIn(["EMAIL_VERIFICATION", "PASSWORD_RESET", "LOGIN_VERIFICATION"])
    .withMessage("Invalid OTP type specified"),

  handleValidationErrors,
];

/**
 * Password reset validation rules
 */
export const validatePasswordReset = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),

  body("otp")
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage("OTP must be a 6-digit number"),

  body("newPassword")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
    ),

  handleValidationErrors,
];

/**
 * Change password validation rules
 */
export const validatePasswordChange = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .isLength({ min: 8, max: 128 })
    .withMessage("New password must be between 8 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
    ),

  handleValidationErrors,
];

/**
 * Project validation rules
 */
export const validateProject = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Project title must be between 5 and 200 characters"),

  body("description")
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage("Project description must be between 20 and 2000 characters"),

  body("category")
    .isIn([
      "RESIDENTIAL",
      "COMMERCIAL",
      "INDUSTRIAL",
      "RENOVATION",
      "CONSULTATION",
    ])
    .withMessage("Invalid project category specified"),

  body("location")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Project location must be between 5 and 200 characters"),

  body("budget").optional().isNumeric().withMessage("Budget must be a number"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date"),

  body("estimatedEndDate")
    .optional()
    .isISO8601()
    .withMessage("Estimated end date must be a valid date"),

  body("features")
    .optional()
    .isArray()
    .withMessage("Features must be an array"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),

  handleValidationErrors,
];

/**
 * Testimonial validation rules
 */
export const validateTestimonial = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),

  body("company")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Company name cannot exceed 100 characters"),

  body("position")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Position cannot exceed 100 characters"),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Location cannot exceed 200 characters"),

  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("testimonial")
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage("Testimonial must be between 20 and 1000 characters"),

  body("projectName")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Project name cannot exceed 200 characters"),

  body("projectValue")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Project value cannot exceed 50 characters"),

  body("projectDuration")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Project duration cannot exceed 50 characters"),

  handleValidationErrors,
];

/**
 * Generic ID validation
 */
export const validateId = [
  body("id").isUUID().withMessage("Invalid ID format"),

  handleValidationErrors,
];

/**
 * Query parameter validation helpers
 */
export const validatePaginationQuery = (
  req: Request,
  res: Response,
  next: NextFunction,
): void | Response => {
  const { page, limit } = req.query;

  if (page && (isNaN(Number(page)) || Number(page) < 1)) {
    return res.status(400).json({
      success: false,
      error: "Page must be a positive number",
      code: "INVALID_PAGE",
    });
  }

  if (
    limit &&
    (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)
  ) {
    return res.status(400).json({
      success: false,
      error: "Limit must be a number between 1 and 100",
      code: "INVALID_LIMIT",
    });
  }

  next();
};

/**
 * File upload validation
 */
export const validateFileUpload = (
  allowedTypes: string[],
  maxSize: number = 5 * 1024 * 1024,
) => {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    if (!req.file && !req.files) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
        code: "NO_FILE_UPLOADED",
      });
    }

    const files = req.files
      ? Array.isArray(req.files)
        ? req.files
        : [req.file]
      : [req.file];

    for (const file of files) {
      if (!file) continue;

      // Check file type
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          error: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
          code: "INVALID_FILE_TYPE",
        });
      }

      // Check file size
      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          error: `File size too large. Maximum size: ${maxSize / 1024 / 1024}MB`,
          code: "FILE_TOO_LARGE",
        });
      }
    }

    next();
  };
};
