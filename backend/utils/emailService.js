const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // For Gmail
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD // Use App Password, not regular password
      }
    });
  }
  
  // For other SMTP services
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Email templates
const getVerificationEmailTemplate = (name, verificationUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="padding: 20px 0; text-align: center;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 40px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <div style="background-color: #3b82f6; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                      <span style="color: white; font-size: 24px;">✉</span>
                    </div>
                    <h1 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: bold;">Welcome, ${name}!</h1>
                    <p style="color: #6b7280; margin: 10px 0 0; font-size: 16px;">Please verify your email address to get started</p>
                  </div>
                  
                  <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; margin: 30px 0;">
                    <p style="margin: 0; color: #374151; line-height: 1.6;">
                      Thank you for registering! To complete your account setup and start using our services, 
                      please verify your email address by clicking the button below.
                    </p>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" 
                       style="background-color: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
                      Verify Email Address
                    </a>
                  </div>
                  
                  <div style="margin: 30px 0; padding: 20px; background-color: #fef3c7; border-radius: 6px; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0; color: #92400e; font-size: 14px;">
                      <strong>Important:</strong> This verification link will expire in 24 hours. 
                      If you didn't create this account, you can safely ignore this email.
                    </p>
                  </div>
                  
                  <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">
                      If the button doesn't work, you can copy and paste this link into your browser:
                    </p>
                    <p style="margin: 10px 0 0; word-break: break-all; font-size: 12px; color: #3b82f6; text-align: center;">
                      ${verificationUrl}
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

const getWelcomeEmailTemplate = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Welcome!</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="padding: 20px 0; text-align: center;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 40px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <div style="background-color: #10b981; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                      <span style="color: white; font-size: 24px;">🎉</span>
                    </div>
                    <h1 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: bold;">Welcome to Our Platform!</h1>
                    <p style="color: #6b7280; margin: 10px 0 0; font-size: 16px;">Your email has been verified successfully</p>
                  </div>
                  
                  <div style="background-color: #f0fdf4; padding: 20px; border-radius: 6px; margin: 30px 0; border-left: 4px solid #10b981;">
                    <p style="margin: 0; color: #065f46; line-height: 1.6;">
                      Congratulations, ${name}! Your account is now fully activated and ready to use. 
                      You can now access all features and start exploring what we have to offer.
                    </p>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL}/login" 
                       style="background-color: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
                      Start Exploring
                    </a>
                  </div>
                  
                  <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">
                      Need help getting started? Contact our support team or check out our help center.
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

const getPasswordResetTemplate = (name, resetUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="padding: 20px 0; text-align: center;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 40px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <div style="background-color: #f59e0b; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                      <span style="color: white; font-size: 24px;">🔒</span>
                    </div>
                    <h1 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: bold;">Reset Your Password</h1>
                    <p style="color: #6b7280; margin: 10px 0 0; font-size: 16px;">We received a request to reset your password</p>
                  </div>
                  
                  <div style="background-color: #fef3c7; padding: 20px; border-radius: 6px; margin: 30px 0; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0; color: #92400e; line-height: 1.6;">
                      Hi ${name}, someone requested a password reset for your account. 
                      If this was you, click the button below to reset your password.
                    </p>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="background-color: #f59e0b; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
                      Reset Password
                    </a>
                  </div>
                  
                  <div style="margin: 30px 0; padding: 20px; background-color: #fee2e2; border-radius: 6px; border-left: 4px solid #ef4444;">
                    <p style="margin: 0; color: #991b1b; font-size: 14px;">
                      <strong>Security Notice:</strong> This link will expire in 1 hour. 
                      If you didn't request this reset, please ignore this email and your password will remain unchanged.
                    </p>
                  </div>
                  
                  <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">
                      If the button doesn't work, copy and paste this link:
                    </p>
                    <p style="margin: 10px 0 0; word-break: break-all; font-size: 12px; color: #f59e0b; text-align: center;">
                      ${resetUrl}
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// Send verification email
const sendVerificationEmail = async (to, name, token) => {
  try {
    const transporter = createTransporter();
    const verificationUrl = process.env.FRONTEND_URL + "/verify-email?token=" + token; 
    console.log(to, name,verificationUrl)
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'Your App'}" <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
      to: to,
      subject: 'Verify Your Email Address',
      html: getVerificationEmailTemplate(name, verificationUrl)
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email
const sendWelcomeEmail = async (to, name) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'Your App'}" <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
      to: to,
      subject: 'Welcome! Your Account is Ready',
      html: getWelcomeEmailTemplate(name)
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
const sendPasswordResetEmail = async (to, name, resetUrl) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'Your App'}" <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
      to: to,
      subject: 'Reset Your Password',
      html: getPasswordResetTemplate(name, resetUrl)
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

// Generic email sender
const sendEmail = async (to, subject, htmlContent, textContent = null) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'Your App'}" <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent,
      text: textContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Test email connection
const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email service is ready');
    return { success: true, message: 'Email service is ready' };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendEmail,
  testEmailConnection
};