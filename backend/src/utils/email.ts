import nodemailer from "nodemailer";
import { logger } from "./logger";

// Email configuration
const createTransporter = () => {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (isDevelopment && process.env.EMAIL_PROVIDER === "ethereal") {
    // Use Ethereal for development testing
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.ETHEREAL_EMAIL,
        pass: process.env.ETHEREAL_PASSWORD,
      },
    });
  }

  // Production configuration for various providers
  switch (process.env.EMAIL_PROVIDER) {
    case "gmail":
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

    case "sendgrid":
      return nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 587,
        auth: {
          user: "apikey",
          pass: process.env.SENDGRID_API_KEY,
        },
      });

    case "mailgun":
      return nodemailer.createTransport({
        host: "smtp.mailgun.org",
        port: 587,
        auth: {
          user: process.env.MAILGUN_SMTP_LOGIN,
          pass: process.env.MAILGUN_SMTP_PASSWORD,
        },
      });

    case "ses":
      return nodemailer.createTransport({
        host: "email-smtp.us-east-1.amazonaws.com",
        port: 587,
        auth: {
          user: process.env.AWS_SES_ACCESS_KEY,
          pass: process.env.AWS_SES_SECRET_KEY,
        },
      });

    default:
      // SMTP configuration
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
  }
};

const transporter = createTransporter();

// Email templates
const emailTemplates = {
  "email-verification": {
    subject: "Verify Your Email - JD Marc Limited",
    html: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Email Verification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #EE690B 0%, #F7931E 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .otp-code { background: white; border: 2px solid #EE690B; color: #EE690B; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; margin: 20px 0; border-radius: 8px; letter-spacing: 5px; }
          .button { display: inline-block; background: #EE690B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏗️ JD Marc Limited</h1>
            <h2>Email Verification</h2>
          </div>
          <div class="content">
            <p>Hello ${data.firstName},</p>
            <p>Thank you for registering with JD Marc Limited! To complete your registration and start exploring our construction services, please verify your email address using the code below:</p>
            
            <div class="otp-code">${data.otp}</div>
            
            <p><strong>This verification code will expire in ${data.expiresIn}.</strong></p>
            
            <p>If you didn't create an account with us, please ignore this email.</p>
            
            <p>Welcome to the JD Marc family!</p>
            
            <p>Best regards,<br>
            The JD Marc Limited Team</p>
          </div>
          <div class="footer">
            <p>JD Marc Limited - Building Africa's Future<br>
            Abuja | London | New York</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: (data: any) => `
      Hello ${data.firstName},
      
      Thank you for registering with JD Marc Limited!
      
      Your verification code is: ${data.otp}
      
      This code will expire in ${data.expiresIn}.
      
      If you didn't create an account with us, please ignore this email.
      
      Best regards,
      The JD Marc Limited Team
    `,
  },

  "password-reset": {
    subject: "Password Reset - JD Marc Limited",
    html: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #EE690B 0%, #F7931E 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .otp-code { background: white; border: 2px solid #EE690B; color: #EE690B; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; margin: 20px 0; border-radius: 8px; letter-spacing: 5px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏗️ JD Marc Limited</h1>
            <h2>Password Reset Request</h2>
          </div>
          <div class="content">
            <p>Hello ${data.firstName},</p>
            <p>We received a request to reset your password. Use the verification code below to proceed with resetting your password:</p>
            
            <div class="otp-code">${data.otp}</div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> This code will expire in ${data.expiresIn}. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
            </div>
            
            <p>For your security, never share this code with anyone.</p>
            
            <p>Best regards,<br>
            The JD Marc Limited Team</p>
          </div>
          <div class="footer">
            <p>JD Marc Limited - Building Africa's Future<br>
            Abuja | London | New York</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: (data: any) => `
      Hello ${data.firstName},
      
      We received a request to reset your password.
      
      Your password reset code is: ${data.otp}
      
      This code will expire in ${data.expiresIn}.
      
      If you didn't request this password reset, please ignore this email.
      
      Best regards,
      The JD Marc Limited Team
    `,
  },

  "contact-confirmation": {
    subject: "Thank You for Contacting JD Marc Limited",
    html: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Contact Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #EE690B 0%, #F7931E 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .info-box { background: white; border-left: 4px solid #EE690B; padding: 20px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏗️ JD Marc Limited</h1>
            <h2>Message Received</h2>
          </div>
          <div class="content">
            <p>Dear ${data.name},</p>
            <p>Thank you for contacting JD Marc Limited! We have received your inquiry and our team will review it promptly.</p>
            
            <div class="info-box">
              <h3>Your Inquiry Details:</h3>
              <p><strong>Subject:</strong> ${data.subject}</p>
              <p><strong>Project Type:</strong> ${data.projectType || "Not specified"}</p>
              <p><strong>Budget Range:</strong> ${data.budget || "Not specified"}</p>
              <p><strong>Timeline:</strong> ${data.timeline || "Not specified"}</p>
              <p><strong>Reference ID:</strong> ${data.referenceId}</p>
            </div>
            
            <p><strong>What happens next?</strong></p>
            <ul>
              <li>Our project team will review your requirements</li>
              <li>We'll contact you within 24-48 hours</li>
              <li>If suitable, we'll schedule a consultation</li>
              <li>You'll receive a detailed proposal</li>
            </ul>
            
            <p>In the meantime, feel free to explore our portfolio at <a href="${process.env.FRONTEND_URL}/projects">our projects page</a>.</p>
            
            <p>Best regards,<br>
            The JD Marc Limited Team</p>
          </div>
          <div class="footer">
            <p>JD Marc Limited - Building Africa's Future<br>
            📧 info@jdmarc.com | 📞 +234 (0) 9 291 3991<br>
            Abuja | London | New York</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: (data: any) => `
      Dear ${data.name},
      
      Thank you for contacting JD Marc Limited!
      
      We have received your inquiry about: ${data.subject}
      Reference ID: ${data.referenceId}
      
      Our team will review your requirements and contact you within 24-48 hours.
      
      Best regards,
      The JD Marc Limited Team
      
      Email: info@jdmarc.com
      Phone: +234 (0) 9 291 3991
    `,
  },

  "project-update": {
    subject: "Project Update - {{projectName}}",
    html: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Project Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #EE690B 0%, #F7931E 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .progress-bar { background: #e0e0e0; border-radius: 10px; overflow: hidden; margin: 20px 0; }
          .progress-fill { background: #28a745; height: 20px; border-radius: 10px; transition: width 0.3s ease; }
          .update-box { background: white; border-left: 4px solid #28a745; padding: 20px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏗️ JD Marc Limited</h1>
            <h2>Project Progress Update</h2>
          </div>
          <div class="content">
            <p>Hello ${data.clientName},</p>
            <p>We're excited to share the latest progress update on your project:</p>
            
            <h3>${data.projectName}</h3>
            
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${data.completionPercentage}%"></div>
            </div>
            <p style="text-align: center;"><strong>${data.completionPercentage}% Complete</strong></p>
            
            <div class="update-box">
              <h4>Latest Update:</h4>
              <p>${data.updateMessage}</p>
              <p><strong>Date:</strong> ${data.updateDate}</p>
              <p><strong>Next Milestone:</strong> ${data.nextMilestone}</p>
            </div>
            
            <p>You can view detailed project information and timeline in your dashboard.</p>
            
            <p>Best regards,<br>
            The JD Marc Project Team</p>
          </div>
          <div class="footer">
            <p>JD Marc Limited - Building Africa's Future</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: (data: any) => `
      Hello ${data.clientName},
      
      Project Update: ${data.projectName}
      Progress: ${data.completionPercentage}% Complete
      
      Latest Update: ${data.updateMessage}
      Date: ${data.updateDate}
      Next Milestone: ${data.nextMilestone}
      
      Best regards,
      The JD Marc Project Team
    `,
  },
};

// Email sending interface
interface EmailOptions {
  to: string | string[];
  subject?: string;
  template?: string;
  data?: any;
  html?: string;
  text?: string;
  attachments?: any[];
}

// Send email function
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    let { to, subject, html, text } = options;

    // If template is specified, use template
    if (
      options.template &&
      emailTemplates[options.template as keyof typeof emailTemplates]
    ) {
      const template =
        emailTemplates[options.template as keyof typeof emailTemplates];
      subject = subject || template.subject;
      html = template.html(options.data || {});
      text = template.text(options.data || {});
    }

    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || "JD Marc Limited",
        address: process.env.EMAIL_FROM_ADDRESS || "noreply@jdmarc.com",
      },
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      html,
      text,
      attachments: options.attachments || [],
    };

    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV === "development") {
      logger.info(`Email sent: ${info.messageId}`);
      if (process.env.EMAIL_PROVIDER === "ethereal") {
        logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    }

    return true;
  } catch (error) {
    logger.error("Email sending failed:", error);
    return false;
  }
};

// Send bulk emails
export const sendBulkEmail = async (
  recipients: string[],
  template: string,
  data: any,
): Promise<{ success: number; failed: number }> => {
  const results = await Promise.allSettled(
    recipients.map((email) =>
      sendEmail({
        to: email,
        template,
        data: { ...data, email },
      }),
    ),
  );

  const success = results.filter(
    (result) => result.status === "fulfilled" && result.value,
  ).length;
  const failed = results.length - success;

  logger.info(`Bulk email sent: ${success} successful, ${failed} failed`);

  return { success, failed };
};

// Verify email configuration
export const verifyEmailConfig = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    logger.info("✅ Email configuration verified");
    return true;
  } catch (error) {
    logger.error("❌ Email configuration failed:", error);
    return false;
  }
};

export default transporter;
