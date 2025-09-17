import nodemailer from 'nodemailer'

interface EmailData {
  to: string
  subject: string
  html: string
  cc?: string
}

class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    // Initialize transporter with fallback for development
    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER || 'moh.conference@health.go.ug',
          pass: process.env.SMTP_PASSWORD || 'ndc2025conference'
        },
        // Add these options for better compatibility
        tls: {
          rejectUnauthorized: false
        }
      })
    } catch (error) {
      console.warn('Email service initialization failed, running in no-email mode:', error)
      // Create a mock transporter for development
      this.transporter = {
        sendMail: async () => {
          console.log('Mock email sent (no SMTP configured)')
          return { messageId: 'mock-message-id' }
        }
      } as any
    }
  }

  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      // Skip email sending if no proper SMTP config in development
      if (!process.env.SMTP_PASSWORD || process.env.SMTP_PASSWORD === 'your_app_password_here') {
        console.log('Email sending skipped - no proper SMTP configuration')
        console.log('Would send email to:', emailData.to, 'Subject:', emailData.subject)
        return true // Return true to not break the flow
      }

      const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'Conference 2025'}" <${process.env.SMTP_USER || 'moh.conference@health.go.ug'}>`,
        to: emailData.to,
        cc: emailData.cc,
        subject: emailData.subject,
        html: emailData.html,
      }

      await this.transporter.sendMail(mailOptions)
      console.log('Email sent successfully to:', emailData.to)
      return true
    } catch (error) {
      console.error('Error sending email:', error)
      // Don't throw error, just log it to prevent breaking the application flow
      return false
    }
  }

  // Registration confirmation email
  async sendRegistrationConfirmation(
    userEmail: string, 
    userName: string, 
    registrationId: number
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #7c3aed; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9f9f9; }
              .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
              .status { background: #ede9fe; padding: 10px; border-left: 4px solid #7c3aed; margin: 20px 0; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Registration Confirmation</h1>
                  <p>Conference 2025</p>
              </div>
              <div class="content">
                  <h2>Dear ${userName},</h2>
                  <p>Thank you for registering for Conference 2025!</p>
                  
                  <div class="status">
                      <strong>Registration ID:</strong> #${registrationId}<br>
                      <strong>Status:</strong> ✅ CONFIRMED
                  </div>
                  
                  <p>Your registration has been successfully submitted and confirmed. Here's what you can expect next:</p>
                  
                  <p><strong>Next Steps:</strong></p>
                  <ul>
                      <li>You will receive your conference badge and materials at registration</li>
                      <li>Conference schedule and venue details will be sent closer to the event</li>
                      <li>Please bring a valid ID for registration check-in</li>
                  </ul>
                  
                  <p>We're excited to have you join us at this important conference!</p>
                  
                  <p>Best regards,<br>
                  Conference Organizing Committee<br>
                  Ministry of Health, Uganda</p>
              </div>
              <div class="footer">
                  <p>For inquiries: <a href="mailto:moh.conference@health.go.ug">moh.conference@health.go.ug</a> | Call: 0800-100-066</p>
              </div>
          </div>
      </body>
      </html>
    `

    return this.sendEmail({
      to: userEmail,
      cc: 'moh.conference@health.go.ug',
      subject: 'Conference 2025 - Registration Confirmed',
      html
    })
  }

  // Registration rejection email
  async sendRegistrationRejection(
    userEmail: string, 
    userName: string, 
    registrationId: number, 
    reason?: string
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9f9f9; }
              .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
              .status { background: #fee2e2; padding: 10px; border-left: 4px solid #dc2626; margin: 20px 0; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Registration Status Update</h1>
                  <p>Conference 2025</p>
              </div>
              <div class="content">
                  <h2>Dear ${userName},</h2>
                  <p>Thank you for your interest in Conference 2025.</p>
                  
                  <div class="status">
                      <strong>Registration Status:</strong> ❌ NOT APPROVED<br>
                      <strong>Registration ID:</strong> #${registrationId}
                  </div>
                  
                  <p>We regret to inform you that your registration could not be approved at this time.</p>
                  
                  ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
                  
                  <p><strong>Next Steps:</strong></p>
                  <ul>
                      <li>You may resubmit your registration with the correct information</li>
                      <li>Ensure all required documents are properly submitted</li>
                      <li>Contact us if you need clarification on requirements</li>
                  </ul>
                  
                  <p>If you believe this decision was made in error or need assistance, please contact us at <a href="mailto:moh.conference@health.go.ug">moh.conference@health.go.ug</a></p>
                  
                  <p>Best regards,<br>
                  Conference Organizing Committee<br>
                  Ministry of Health, Uganda</p>
              </div>
              <div class="footer">
                  <p>For inquiries: <a href="mailto:moh.conference@health.go.ug">moh.conference@health.go.ug</a> | Call: 0800-100-066</p>
              </div>
          </div>
      </body>
      </html>
    `

    return this.sendEmail({
      to: userEmail,
      cc: 'moh.conference@health.go.ug',
      subject: 'Conference 2025 - Registration Status Update',
      html
    })
  }

  // Abstract submission confirmation
  async sendAbstractConfirmation(
    userEmail: string, 
    userName: string, 
    abstractTitle: string, 
    abstractId: number
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #7c3aed; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9f9f9; }
              .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
              .status { background: #ede9fe; padding: 10px; border-left: 4px solid #7c3aed; margin: 20px 0; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Abstract Submission Received</h1>
                  <p>Conference 2025</p>
              </div>
              <div class="content">
                  <h2>Dear ${userName},</h2>
                  <p>Thank you for submitting your abstract to Conference 2025!</p>
                  
                  <div class="status">
                      <strong>Abstract Title:</strong> ${abstractTitle}<br>
                      <strong>Submission ID:</strong> #${abstractId}<br>
                      <strong>Status:</strong> Under Review
                  </div>
                  
                  <p>Your abstract has been received and will be reviewed by our scientific committee. The review process typically takes 2-3 weeks.</p>
                  
                  <p><strong>Review Process:</strong></p>
                  <ul>
                      <li>Scientific committee review</li>
                      <li>Feedback and decision notification</li>
                      <li>Presentation format assignment (if accepted)</li>
                  </ul>
                  
                  <p>You will be notified of the review outcome via email. Thank you for your contribution to the conference!</p>
                  
                  <p>Best regards,<br>
                  Conference Scientific Committee<br>
                  Ministry of Health, Uganda</p>
              </div>
              <div class="footer">
                  <p>For inquiries: <a href="mailto:moh.conference@health.go.ug">moh.conference@health.go.ug</a> | Call: 0800-100-066</p>
              </div>
          </div>
      </body>
      </html>
    `

    return this.sendEmail({
      to: userEmail,
      cc: 'moh.conference@health.go.ug',
      subject: `Conference 2025 - Abstract Submission Received: ${abstractTitle}`,
      html
    })
  }

  // Pre-conference meeting confirmation
  async sendPreConferenceMeetingConfirmation(
    userEmail: string,
    organizerName: string,
    sessionTitle: string,
    meetingDate: string,
    meetingType: string,
    submissionId: number
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #7c3aed; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9f9f9; }
              .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
              .status { background: #ede9fe; padding: 10px; border-left: 4px solid #7c3aed; margin: 20px 0; }
              .deadline { background: #fef3c7; padding: 10px; border-left: 4px solid #f59e0b; margin: 20px 0; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Pre-Conference Meeting Submission Received</h1>
                  <p>Conference 2025</p>
              </div>
              <div class="content">
                  <h2>Dear ${organizerName},</h2>
                  <p>Thank you for submitting your pre-conference meeting proposal!</p>
                  
                  <div class="status">
                      <strong>Session Title:</strong> ${sessionTitle}<br>
                      <strong>Meeting Type:</strong> ${meetingType}<br>
                      <strong>Date:</strong> ${meetingDate}<br>
                      <strong>Submission ID:</strong> #${submissionId}<br>
                      <strong>Status:</strong> Under Review
                  </div>
                  
                  <div class="deadline">
                      <strong>⚠️ Important:</strong> The submission deadline is September 30th, 2025.
                  </div>
                  
                  <p>Your proposal has been received and will be reviewed by our organizing committee. The review process typically takes 5-7 business days.</p>
                  
                  <p><strong>Next Steps:</strong></p>
                  <ul>
                      <li>Committee review of your proposal</li>
                      <li>Notification of approval status</li>
                      <li>Payment instructions (if approved)</li>
                      <li>Session scheduling confirmation</li>
                  </ul>
                  
                  <p><strong>Pricing Information:</strong></p>
                  <ul>
                      <li>Rate: USD $2,000 per hour</li>
                      <li>Payment required upon approval</li>
                  </ul>
                  
                  <p>You will be notified of the review outcome via email. If you have any questions, please contact us at:</p>
                  <ul>
                      <li>Email: moh.conference@health.go.ug</li>
                      <li>Phone: 0800-100-066</li>
                  </ul>
                  
                  <p>Thank you for your participation!</p>
                  
                  <p>Best regards,<br>
                  Conference Organizing Committee<br>
                  Ministry of Health, Uganda</p>
              </div>
              <div class="footer">
                  <p>For inquiries: <a href="mailto:moh.conference@health.go.ug">moh.conference@health.go.ug</a> | Call: 0800-100-066</p>
              </div>
          </div>
      </body>
      </html>
    `

    return this.sendEmail({
      to: userEmail,
      cc: 'moh.conference@health.go.ug',
      subject: `Conference 2025 - Pre-Conference Meeting Submission Received: ${sessionTitle}`,
      html
    })
  }
}

export const emailService = new EmailService()
