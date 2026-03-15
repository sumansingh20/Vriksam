import config from '../config';

/**
 * Email service for Vriksham platform.
 * Uses a transport abstraction so the underlying provider (SMTP, SendGrid, SES)
 * can be swapped without changing controller/service code.
 *
 * In production, integrate with your SMTP/SES provider using nodemailer or similar.
 * For now, emails are logged in development and sent via SMTP in production.
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

async function sendEmail(options: EmailOptions): Promise<boolean> {
  // In development, log the email instead of sending
  if (config.app.isDevelopment) {
    console.log('[Email Service] Would send email:', {
      to: options.to,
      subject: options.subject,
      preview: options.text?.substring(0, 100) || options.html.substring(0, 100),
    });
    return true;
  }

  // Production: use nodemailer or AWS SES
  // This integration point connects to your SMTP provider
  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });

    await transporter.sendMail({
      from: `${config.app.name} <${config.email.from}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    return true;
  } catch (error) {
    console.error('[Email Service] Failed to send email:', error);
    return false;
  }
}

export const emailService = {
  /**
   * Send welcome email to a newly registered user
   */
  async sendWelcome(params: { email: string; name: string }): Promise<boolean> {
    return sendEmail({
      to: params.email,
      subject: `Welcome to ${config.app.name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2D5016;">Welcome to ${config.app.name}, ${params.name}!</h1>
          <p>Thank you for joining our green infrastructure platform. We're excited to help you manage and grow your green spaces.</p>
          <h2>Getting Started</h2>
          <ul>
            <li>Set up your locations and plants</li>
            <li>Choose a subscription plan</li>
            <li>Schedule your first maintenance visit</li>
          </ul>
          <p>If you need any help, our team is here to assist you.</p>
          <p style="color: #666;">- The ${config.app.name} Team</p>
        </div>
      `,
      text: `Welcome to ${config.app.name}, ${params.name}! Thank you for joining our green infrastructure platform.`,
    });
  },

  /**
   * Send invoice email to a client
   */
  async sendInvoice(params: {
    email: string;
    name: string;
    invoiceNumber: string;
    amount: number;
    dueDate: string;
    downloadUrl?: string;
  }): Promise<boolean> {
    return sendEmail({
      to: params.email,
      subject: `${config.app.name} - Invoice #${params.invoiceNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2D5016;">Invoice #${params.invoiceNumber}</h1>
          <p>Dear ${params.name},</p>
          <p>A new invoice has been generated for your account:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Invoice Number</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${params.invoiceNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Amount</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">&#8377;${params.amount.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Due Date</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${params.dueDate}</td>
            </tr>
          </table>
          ${params.downloadUrl ? `<p><a href="${params.downloadUrl}" style="color: #2D5016;">Download Invoice</a></p>` : ''}
          <p style="color: #666;">- The ${config.app.name} Team</p>
        </div>
      `,
      text: `Invoice #${params.invoiceNumber} - Amount: Rs.${params.amount} - Due Date: ${params.dueDate}`,
    });
  },

  /**
   * Send maintenance reminder to a client
   */
  async sendMaintenanceReminder(params: {
    email: string;
    name: string;
    scheduledDate: string;
    technicianName: string;
    locationName: string;
  }): Promise<boolean> {
    return sendEmail({
      to: params.email,
      subject: `${config.app.name} - Maintenance Visit Scheduled`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2D5016;">Maintenance Visit Reminder</h1>
          <p>Dear ${params.name},</p>
          <p>A maintenance visit has been scheduled for your location:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${params.scheduledDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Technician</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${params.technicianName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Location</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${params.locationName}</td>
            </tr>
          </table>
          <p>Please ensure the area is accessible for our team.</p>
          <p style="color: #666;">- The ${config.app.name} Team</p>
        </div>
      `,
      text: `Maintenance visit scheduled for ${params.scheduledDate} at ${params.locationName} by ${params.technicianName}.`,
    });
  },

  /**
   * Send health alert for a plant that needs attention
   */
  async sendHealthAlert(params: {
    email: string;
    name: string;
    plantName: string;
    healthScore: number;
    issue: string;
    recommendation: string;
  }): Promise<boolean> {
    const severity = params.healthScore < 30 ? 'Critical' : params.healthScore < 60 ? 'Warning' : 'Notice';
    const color = params.healthScore < 30 ? '#D32F2F' : params.healthScore < 60 ? '#F57C00' : '#388E3C';

    return sendEmail({
      to: params.email,
      subject: `${config.app.name} - Plant Health ${severity}: ${params.plantName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: ${color};">Plant Health ${severity}</h1>
          <p>Dear ${params.name},</p>
          <p>We've detected a health concern with one of your plants:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Plant</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${params.plantName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Health Score</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd; color: ${color};"><strong>${params.healthScore}/100</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Issue</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${params.issue}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Recommendation</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${params.recommendation}</td>
            </tr>
          </table>
          <p>Our team has been notified and will take appropriate action.</p>
          <p style="color: #666;">- The ${config.app.name} Team</p>
        </div>
      `,
      text: `Plant Health ${severity}: ${params.plantName} - Score: ${params.healthScore}/100 - ${params.issue}. Recommendation: ${params.recommendation}`,
    });
  },

  /**
   * Send password reset email
   */
  async sendPasswordReset(params: {
    email: string;
    name: string;
    resetToken: string;
  }): Promise<boolean> {
    const resetUrl = `${config.app.frontendUrl}/reset-password?token=${params.resetToken}`;

    return sendEmail({
      to: params.email,
      subject: `${config.app.name} - Password Reset Request`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2D5016;">Password Reset</h1>
          <p>Dear ${params.name},</p>
          <p>We received a request to reset your password. Click the link below to set a new password:</p>
          <p style="margin: 20px 0;">
            <a href="${resetUrl}" style="background-color: #2D5016; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
              Reset Password
            </a>
          </p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
          <p style="color: #666;">- The ${config.app.name} Team</p>
        </div>
      `,
      text: `Password reset link: ${resetUrl} - This link expires in 1 hour.`,
    });
  },
};

export default emailService;
