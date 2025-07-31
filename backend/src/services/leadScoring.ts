import { prisma } from "@/utils/database";
import { logger } from "@/utils/logger";

// Lead scoring factors and weights
interface LeadScoringFactors {
  timeOnSiteScore: number;
  pageDepthScore: number;
  portfolioEngagement: number;
  contactFormScore: number;
  returnVisitorScore: number;
  deviceQualityScore: number;
  timeOfDayScore: number;
}

interface LeadScoringInput {
  userType?: "new" | "returning" | "enterprise";
  source?: string;
  deviceType?: "mobile" | "tablet" | "desktop";
  timeOnSite?: number;
  pageViews?: number;
  portfolioViews?: number;
  contactFormSubmission?: boolean;
  projectType?: string;
  budget?: string;
  timeline?: string;
  hasPhone?: boolean;
  hasCompany?: boolean;
  company?: boolean;
  timeOfDay?: "morning" | "afternoon" | "evening";
  location?: string;
}

// Create initial lead score
export const createLeadScore = async (
  userId: string,
  input: LeadScoringInput,
) => {
  try {
    const factors = calculateLeadFactors(input);
    const totalScore = Object.values(factors).reduce(
      (sum, score) => sum + score,
      0,
    );
    const classification = classifyLead(totalScore);
    const estimatedValue = calculateEstimatedValue(input, totalScore);
    const probability = calculateConversionProbability(classification, factors);
    const urgency = calculateUrgency(totalScore, input);
    const nextAction = determineNextAction(classification, input);

    const leadScore = await prisma.leadScoring.create({
      data: {
        userId,
        totalScore,
        ...factors,
        classification,
        estimatedValue,
        probability,
        urgency,
        nextAction,
      },
    });

    logger.info("Lead score created", {
      userId,
      totalScore,
      classification,
      estimatedValue,
      probability,
    });

    // Send high-value lead alerts
    if (classification === "HOT" || classification === "QUALIFIED") {
      await sendHighValueLeadAlert(userId, leadScore);
    }

    return leadScore;
  } catch (error) {
    logger.error("Create lead score error:", error);
    throw error;
  }
};

// Update existing lead score
export const updateLeadScore = async (
  userId: string,
  input: LeadScoringInput,
) => {
  try {
    const existingScore = await prisma.leadScoring.findUnique({
      where: { userId },
    });

    if (!existingScore) {
      return await createLeadScore(userId, input);
    }

    // Calculate new factors
    const factors = calculateLeadFactors(input, existingScore);
    const totalScore = Object.values(factors).reduce(
      (sum, score) => sum + score,
      0,
    );
    const classification = classifyLead(totalScore);
    const estimatedValue = calculateEstimatedValue(input, totalScore);
    const probability = calculateConversionProbability(classification, factors);
    const urgency = calculateUrgency(totalScore, input);
    const nextAction = determineNextAction(classification, input);

    const updatedScore = await prisma.leadScoring.update({
      where: { userId },
      data: {
        totalScore,
        ...factors,
        classification,
        estimatedValue,
        probability,
        urgency,
        nextAction,
        lastUpdated: new Date(),
      },
    });

    logger.info("Lead score updated", {
      userId,
      oldScore: existingScore.totalScore,
      newScore: totalScore,
      oldClassification: existingScore.classification,
      newClassification: classification,
    });

    // Send alerts for classification upgrades
    if (shouldSendUpgradeAlert(existingScore.classification, classification)) {
      await sendLeadUpgradeAlert(
        userId,
        existingScore.classification,
        classification,
      );
    }

    return updatedScore;
  } catch (error) {
    logger.error("Update lead score error:", error);
    throw error;
  }
};

// Calculate individual scoring factors
const calculateLeadFactors = (
  input: LeadScoringInput,
  existing?: any,
): LeadScoringFactors => {
  const factors: LeadScoringFactors = {
    timeOnSiteScore: calculateTimeOnSiteScore(input.timeOnSite || 0),
    pageDepthScore: calculatePageDepthScore(input.pageViews || 1),
    portfolioEngagement: calculatePortfolioEngagement(
      input.portfolioViews || 0,
    ),
    contactFormScore: calculateContactFormScore(
      input.contactFormSubmission,
      input.projectType,
      input.budget,
    ),
    returnVisitorScore: calculateReturnVisitorScore(input.userType),
    deviceQualityScore: calculateDeviceQualityScore(input.deviceType),
    timeOfDayScore: calculateTimeOfDayScore(input.timeOfDay),
  };

  // If existing scores, take the maximum to prevent degradation
  if (existing) {
    factors.timeOnSiteScore = Math.max(
      factors.timeOnSiteScore,
      existing.timeOnSiteScore,
    );
    factors.pageDepthScore = Math.max(
      factors.pageDepthScore,
      existing.pageDepthScore,
    );
    factors.portfolioEngagement = Math.max(
      factors.portfolioEngagement,
      existing.portfolioEngagement,
    );
    factors.contactFormScore = Math.max(
      factors.contactFormScore,
      existing.contactFormScore,
    );
    factors.returnVisitorScore = Math.max(
      factors.returnVisitorScore,
      existing.returnVisitorScore,
    );
    factors.deviceQualityScore = Math.max(
      factors.deviceQualityScore,
      existing.deviceQualityScore,
    );
    factors.timeOfDayScore = Math.max(
      factors.timeOfDayScore,
      existing.timeOfDayScore,
    );
  }

  return factors;
};

// Individual scoring functions
const calculateTimeOnSiteScore = (timeOnSite: number): number => {
  if (timeOnSite > 300000) return 25; // 5+ minutes
  if (timeOnSite > 120000) return 20; // 2+ minutes
  if (timeOnSite > 60000) return 15; // 1+ minute
  if (timeOnSite > 30000) return 10; // 30+ seconds
  return 5;
};

const calculatePageDepthScore = (pageViews: number): number => {
  if (pageViews > 10) return 20;
  if (pageViews > 5) return 15;
  if (pageViews > 3) return 10;
  return 5;
};

const calculatePortfolioEngagement = (portfolioViews: number): number => {
  return Math.min(portfolioViews * 5, 20);
};

const calculateContactFormScore = (
  submitted?: boolean,
  projectType?: string,
  budget?: string,
): number => {
  if (!submitted) return 0;

  let score = 30; // Base score for contact form submission

  // Project type bonuses
  const projectTypeScores = {
    SMART_CITIES: 15,
    INFRASTRUCTURE: 12,
    COMMERCIAL: 10,
    RESIDENTIAL: 8,
    RENOVATION: 6,
    INTERIOR_DESIGN: 5,
  };

  if (
    projectType &&
    projectTypeScores[projectType as keyof typeof projectTypeScores]
  ) {
    score += projectTypeScores[projectType as keyof typeof projectTypeScores];
  }

  // Budget bonuses
  if (budget) {
    if (
      budget.includes("$1M") ||
      budget.includes("₦1B") ||
      budget.includes("high")
    ) {
      score += 20;
    } else if (
      budget.includes("$500K") ||
      budget.includes("₦500M") ||
      budget.includes("medium")
    ) {
      score += 10;
    } else if (
      budget.includes("$100K") ||
      budget.includes("₦100M") ||
      budget.includes("low")
    ) {
      score += 5;
    }
  }

  return Math.min(score, 50); // Cap at 50 points
};

const calculateReturnVisitorScore = (userType?: string): number => {
  switch (userType) {
    case "enterprise":
      return 20;
    case "returning":
      return 15;
    case "new":
      return 5;
    default:
      return 0;
  }
};

const calculateDeviceQualityScore = (deviceType?: string): number => {
  // Higher quality devices might indicate higher budget
  switch (deviceType) {
    case "desktop":
      return 10;
    case "tablet":
      return 7;
    case "mobile":
      return 5;
    default:
      return 5;
  }
};

const calculateTimeOfDayScore = (timeOfDay?: string): number => {
  // Business hours indicate professional interest
  switch (timeOfDay) {
    case "morning":
      return 10; // 9-12
    case "afternoon":
      return 10; // 12-18
    case "evening":
      return 5; // 18-21
    default:
      return 2; // Late night/early morning
  }
};

// Lead classification
const classifyLead = (
  totalScore: number,
): "COLD" | "WARM" | "HOT" | "QUALIFIED" => {
  if (totalScore >= 80) return "QUALIFIED";
  if (totalScore >= 60) return "HOT";
  if (totalScore >= 40) return "WARM";
  return "COLD";
};

// Calculate estimated project value
const calculateEstimatedValue = (
  input: LeadScoringInput,
  score: number,
): number => {
  let baseValue = 50000; // Default project value in USD

  // Adjust based on project type
  const projectTypeMultipliers = {
    SMART_CITIES: 5.0,
    INFRASTRUCTURE: 4.0,
    COMMERCIAL: 3.0,
    RESIDENTIAL: 2.0,
    RENOVATION: 1.5,
    INTERIOR_DESIGN: 1.0,
  };

  if (
    input.projectType &&
    projectTypeMultipliers[
      input.projectType as keyof typeof projectTypeMultipliers
    ]
  ) {
    baseValue *=
      projectTypeMultipliers[
        input.projectType as keyof typeof projectTypeMultipliers
      ];
  }

  // Adjust based on budget hints
  if (input.budget) {
    if (input.budget.includes("$1M") || input.budget.includes("₦1B")) {
      baseValue = Math.max(baseValue, 1000000);
    } else if (
      input.budget.includes("$500K") ||
      input.budget.includes("₦500M")
    ) {
      baseValue = Math.max(baseValue, 500000);
    } else if (
      input.budget.includes("$100K") ||
      input.budget.includes("₦100M")
    ) {
      baseValue = Math.max(baseValue, 100000);
    }
  }

  // Company indicates larger projects
  if (input.company) {
    baseValue *= 1.5;
  }

  // Score multiplier
  const scoreMultiplier = Math.min(score / 50, 3); // Max 3x multiplier
  baseValue *= scoreMultiplier;

  return Math.round(baseValue);
};

// Calculate conversion probability
const calculateConversionProbability = (
  classification: string,
  factors: LeadScoringFactors,
): number => {
  const baseProbabilities = {
    COLD: 0.05,
    WARM: 0.15,
    HOT: 0.35,
    QUALIFIED: 0.65,
  };

  let probability =
    baseProbabilities[classification as keyof typeof baseProbabilities];

  // Adjust based on specific factors
  if (factors.contactFormScore > 30) probability += 0.1;
  if (factors.portfolioEngagement > 15) probability += 0.05;
  if (factors.returnVisitorScore > 10) probability += 0.05;
  if (factors.timeOnSiteScore > 20) probability += 0.05;

  return Math.min(0.95, probability);
};

// Calculate urgency
const calculateUrgency = (
  score: number,
  input: LeadScoringInput,
): "LOW" | "MEDIUM" | "HIGH" => {
  if (score > 80 || input.projectType === "SMART_CITIES") return "HIGH";
  if (score > 60 || input.contactFormSubmission) return "MEDIUM";
  return "LOW";
};

// Determine next action
const determineNextAction = (
  classification: string,
  input: LeadScoringInput,
): string => {
  switch (classification) {
    case "QUALIFIED":
      return "Schedule sales call within 24 hours";
    case "HOT":
      return "Send personalized proposal within 48 hours";
    case "WARM":
      if (input.contactFormSubmission) {
        return "Follow up with detailed project information";
      }
      return "Send relevant case studies and project examples";
    case "COLD":
      return "Add to nurture email sequence";
    default:
      return "Continue monitoring engagement";
  }
};

// Alert functions
const sendHighValueLeadAlert = async (userId: string, leadScore: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        profile: {
          select: {
            company: true,
          },
        },
      },
    });

    if (!user) return;

    // Send email to sales team
    const salesEmails = process.env.SALES_EMAILS?.split(",") || [
      "sales@jdmarc.com",
    ];

    // This would be implemented with your email service
    logger.info("High-value lead alert triggered", {
      userId,
      userEmail: user.email,
      company: user.profile?.company,
      score: leadScore.totalScore,
      classification: leadScore.classification,
      estimatedValue: leadScore.estimatedValue,
    });

    // In a real implementation, you'd send emails, Slack notifications, etc.
  } catch (error) {
    logger.error("Send high-value lead alert error:", error);
  }
};

const sendLeadUpgradeAlert = async (
  userId: string,
  oldClassification: string,
  newClassification: string,
) => {
  try {
    logger.info("Lead upgraded", {
      userId,
      from: oldClassification,
      to: newClassification,
    });

    // Send notification to sales team about lead upgrade
    // This would trigger email, Slack, or in-app notifications
  } catch (error) {
    logger.error("Send lead upgrade alert error:", error);
  }
};

const shouldSendUpgradeAlert = (
  oldClass: string,
  newClass: string,
): boolean => {
  const hierarchy = ["COLD", "WARM", "HOT", "QUALIFIED"];
  const oldIndex = hierarchy.indexOf(oldClass);
  const newIndex = hierarchy.indexOf(newClass);

  return newIndex > oldIndex;
};

// Get lead scoring analytics
export const getLeadScoringAnalytics = async () => {
  try {
    const [
      totalLeads,
      leadsByClassification,
      averageScore,
      conversionRates,
      recentHighValueLeads,
    ] = await Promise.all([
      prisma.leadScoring.count(),
      prisma.leadScoring.groupBy({
        by: ["classification"],
        _count: { id: true },
        _avg: { totalScore: true },
      }),
      prisma.leadScoring.aggregate({
        _avg: { totalScore: true },
      }),
      calculateConversionRates(),
      prisma.leadScoring.findMany({
        where: {
          classification: { in: ["HOT", "QUALIFIED"] },
          lastUpdated: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              profile: {
                select: {
                  company: true,
                },
              },
            },
          },
        },
        orderBy: { totalScore: "desc" },
        take: 10,
      }),
    ]);

    return {
      overview: {
        totalLeads,
        averageScore: Math.round(averageScore._avg.totalScore || 0),
        leadsByClassification,
        conversionRates,
      },
      recentHighValueLeads,
    };
  } catch (error) {
    logger.error("Get lead scoring analytics error:", error);
    throw error;
  }
};

// Calculate conversion rates (this would use actual conversion data)
const calculateConversionRates = async () => {
  // This is a simplified calculation
  // In a real system, you'd track actual conversions to projects
  const conversions = await prisma.contactForm.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  const total = conversions.reduce((sum, item) => sum + item._count.id, 0);
  const won = conversions.find((item) => item.status === "WON")?._count.id || 0;

  return {
    overall: total > 0 ? (won / total) * 100 : 0,
    byClassification: {
      QUALIFIED: 65,
      HOT: 35,
      WARM: 15,
      COLD: 5,
    },
  };
};

export default {
  createLeadScore,
  updateLeadScore,
  getLeadScoringAnalytics,
};
