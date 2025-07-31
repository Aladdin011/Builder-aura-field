import express, { Request, Response } from "express";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "../utils/database";
import { sendEmail } from "../utils/email";
import { logger } from "../utils/logger";
import {
  validateContactForm,
  validatePaginationQuery,
} from "../middleware/validation";
import {
  authenticateToken,
  requireRole,
  optionalAuth,
} from "../middleware/auth";
import { createLeadScore, updateLeadScore } from "../services/leadScoring";
import { trackUserAnalytics } from "../services/analytics";
import { asyncHandler, createError } from "../middleware/errorHandler";

const router = express.Router();

// Validation schemas
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  projectType: z
    .enum([
      "RESIDENTIAL",
      "COMMERCIAL",
      "INDUSTRIAL",
      "RENOVATION",
      "CONSULTATION",
    ])
    .optional(),
  budget: z
    .enum(["UNDER_10K", "10K_50K", "50K_100K", "100K_500K", "OVER_500K"])
    .optional(),
  timeline: z
    .enum(["ASAP", "WITHIN_MONTH", "WITHIN_QUARTER", "WITHIN_YEAR", "NO_RUSH"])
    .optional(),
  location: z.string().optional(),
  source: z
    .enum([
      "WEBSITE",
      "GOOGLE",
      "SOCIAL_MEDIA",
      "REFERRAL",
      "ADVERTISEMENT",
      "OTHER",
    ])
    .optional(),
});

/**
 * Submit Contact Form
 */
router.post(
  "/submit",
  optionalAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const validatedData = contactFormSchema.parse(req.body);
    const {
      name,
      email,
      phone,
      company,
      subject,
      message,
      projectType,
      budget,
      timeline,
      location,
      source,
    } = validatedData;

    // Calculate lead score
    const tempUserId = crypto.randomUUID();
    const leadScore = await createLeadScore(tempUserId, {
      projectType,
      budget,
      timeline,
      hasPhone: !!phone,
      hasCompany: !!company,
      messageLength: message.length,
      source,
    });

    // Create contact form entry
    const contactForm = await prisma.contactForm.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone,
        company,
        subject,
        message,
        projectType,
        budget,
        timeline,
        location,
        source: source || "WEBSITE",
        status: "NEW",
        priority: leadScore.priority,
        leadScore: leadScore.score,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        userId: req.user?.id || null,
      },
    });

    // Send confirmation email to user
    try {
      await sendEmail({
        to: email,
        subject: "Thank you for contacting JD Marc Limited",
        template: "contactConfirmation",
        data: {
          name,
          subject,
          message,
          contactId: contactForm.id,
          companyName: "JD Marc Limited",
        },
      });
    } catch (emailError) {
      logger.error("Failed to send confirmation email", {
        contactId: contactForm.id,
        email,
        error: emailError,
      });
    }

    // Send notification email to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || "admin@jdmarc.com";
      await sendEmail({
        to: adminEmail,
        subject: `New Contact Form Submission - ${subject}`,
        template: "newContactNotification",
        data: {
          name,
          email,
          phone,
          company,
          subject,
          message,
          projectType,
          budget,
          timeline,
          location,
          leadScore: leadScore.totalScore,
          priority: leadScore.classification,
          contactId: contactForm.id,
        },
      });
    } catch (emailError) {
      logger.error("Failed to send admin notification email", {
        contactId: contactForm.id,
        error: emailError,
      });
    }

    // Track analytics if user is authenticated
    if (req.user) {
      try {
        await trackUserAnalytics(req.user.id, "contact_form_submit", {
          contactId: contactForm.id,
          projectType,
          budget,
          leadScore: leadScore.score,
        });
      } catch (analyticsError) {
        logger.error("Failed to track analytics", {
          userId: req.user.id,
          contactId: contactForm.id,
          error: analyticsError,
        });
      }
    }

    logger.info("Contact form submitted successfully", {
      contactId: contactForm.id,
      name,
      email,
      projectType,
      leadScore: leadScore.score,
      priority: leadScore.priority,
    });

    res.status(201).json({
      success: true,
      data: {
        id: contactForm.id,
        status: contactForm.status,
        leadScore: leadScore.score,
        priority: leadScore.priority,
      },
      message: "Thank you for your message. We will get back to you soon!",
    });
  }),
);

/**
 * Get all contact forms (Admin/Manager only)
 */
router.get(
  "/",
  authenticateToken,
  requireRole(["ADMIN", "MANAGER"]),
  validatePaginationQuery,
  asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const priority = req.query.priority as string;
    const projectType = req.query.projectType as string;
    const search = req.query.search as string;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as string) || "desc";

    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (projectType) where.projectType = projectType;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get contact forms with pagination
    const [contactForms, total] = await Promise.all([
      prisma.contactForm.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      prisma.contactForm.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: contactForms,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
      },
    });
  }),
);

/**
 * Get contact form by ID (Admin/Manager only)
 */
router.get(
  "/:id",
  authenticateToken,
  requireRole(["ADMIN", "MANAGER"]),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const contactForm = await prisma.contactForm.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            company: true,
          },
        },
      },
    });

    if (!contactForm) {
      throw createError("Contact form not found", 404, "CONTACT_NOT_FOUND");
    }

    res.json({
      success: true,
      data: contactForm,
    });
  }),
);

/**
 * Update contact form status (Admin/Manager only)
 */
router.patch(
  "/:id",
  authenticateToken,
  requireRole(["ADMIN", "MANAGER"]),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, priority, assignedTo, notes, followUpDate } = req.body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (notes) updateData.notes = notes;
    if (followUpDate) updateData.followUpDate = new Date(followUpDate);

    const contactForm = await prisma.contactForm.update({
      where: { id },
      data: updateData,
    });

    logger.info("Contact form updated", {
      contactId: id,
      updatedBy: req.user!.id,
      updates: Object.keys(updateData),
    });

    res.json({
      success: true,
      data: contactForm,
      message: "Contact form updated successfully",
    });
  }),
);

/**
 * Get contact form statistics (Admin/Manager only)
 */
router.get(
  "/stats/overview",
  authenticateToken,
  requireRole(["ADMIN", "MANAGER"]),
  asyncHandler(async (req: Request, res: Response) => {
    const [
      totalContacts,
      newContacts,
      inProgressContacts,
      completedContacts,
      highPriorityContacts,
      averageLeadScore,
    ] = await Promise.all([
      prisma.contactForm.count(),
      prisma.contactForm.count({ where: { status: "NEW" } }),
      prisma.contactForm.count({ where: { status: "IN_PROGRESS" } }),
      prisma.contactForm.count({ where: { status: "COMPLETED" } }),
      prisma.contactForm.count({ where: { priority: "HIGH" } }),
      prisma.contactForm.aggregate({
        _avg: { leadScore: true },
      }),
    ]);

    // Get monthly contact form submissions
    const monthlyData = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*) as count
      FROM "ContactForm"
      WHERE "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month DESC
    `;

    res.json({
      success: true,
      data: {
        overview: {
          total: totalContacts,
          new: newContacts,
          inProgress: inProgressContacts,
          completed: completedContacts,
          highPriority: highPriorityContacts,
          averageLeadScore: averageLeadScore._avg.leadScore || 0,
        },
        monthlyData,
      },
    });
  }),
);

export default router;
