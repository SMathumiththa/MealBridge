const nodemailer = require('nodemailer');
const path = require('path');

let transporter;
let transporterMeta = { isTest: false, previewUrl: null };

const createTransporter = async () => {
  if (transporter) return transporter;

  const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  if (hasSmtpConfig) {
    const port = Number(process.env.SMTP_PORT) || 587;
    const isSecure = process.env.SMTP_SECURE === 'true' || port === 465;

    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: isSecure,
      pool: true,
      maxConnections: 3,
      maxMessages: 100,
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 15000,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    transporterMeta.isTest = false;
    // Non-blocking verification in the background to never delay outgoing requests
    transporter.verify().then(() => {
      console.log('SMTP is configured and verified. Using real email delivery.');
    }).catch(err => {
      console.warn('SMTP connection warning (will retry on send):', err.message);
    });

    return transporter;
  }

  try {
    const account = await Promise.race([
      new Promise((resolve, reject) => {
        nodemailer.createTestAccount((err, acc) => {
          if (err) return reject(err);
          resolve(acc);
        });
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Ethereal test account creation timed out')), 5000))
    ]);

    transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass
      }
    });

    transporterMeta.isTest = true;
    console.log('Using Ethereal test account. Preview emails with nodemailer.getTestMessageUrl.');
    return transporter;
  } catch (testErr) {
    console.warn('Could not initialize Ethereal test transport:', testErr.message);
    return null;
  }
};

const sendFoodAlertEmail = async (ngoEmail, ngoName, foodDetails) => {
  const transport = await createTransporter();
  if (!transport) return;

  const mailOptions = {
    from: process.env.SMTP_FROM || '"MealBridge Admin" <adminmealbridge@gmail.com>',
    to: ngoEmail,
    subject: `🚨 New Food Donation Alert: ${foodDetails.foodName}`,
    text: `Hello ${ngoName},\n\nA new donation of ${foodDetails.quantity} ${foodDetails.unit} of ${foodDetails.foodName} has been posted in ${foodDetails.location}.\n\nLog in to MealBridge to request it before it expires at ${new Date(foodDetails.expiryTime).toLocaleString()}.\n\nThank you!`,
    html: `
      <h2>Hello ${ngoName},</h2>
      <p>A new food donation is available in your area!</p>
      <ul>
        <li><strong>Food:</strong> ${foodDetails.foodName}</li>
        <li><strong>Quantity:</strong> ${foodDetails.quantity} ${foodDetails.unit}</li>
        <li><strong>Location:</strong> ${foodDetails.location}</li>
        <li><strong>Expires At:</strong> ${new Date(foodDetails.expiryTime).toLocaleString()}</li>
      </ul>
      <p>Please log in to MealBridge to request it now.</p>
    `
  };

  try {
    const info = await transport.sendMail(mailOptions);
    console.log(`Email sent to ${ngoEmail}. Preview URL: %s`, nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error(`Error sending email to ${ngoEmail}:`, error);
  }
};

const sendPasswordResetEmail = async (toEmail, toName, resetCode) => {
  const transport = await createTransporter();
  if (!transport) return { previewUrl: null };

  const mailOptions = {
    from: process.env.SMTP_FROM || '"MealBridge Admin" <adminmealbridge@gmail.com>',
    to: toEmail,
    subject: 'MealBridge Password Reset Code',
    text: `Hello ${toName || 'User'},\n\nYou requested a password reset for your MealBridge account. Use the code below to reset your password:\n\n${resetCode}\n\nThis code expires in 20 minutes. If you did not request this, please ignore this email.\n\nThank you!`,
    html: `
      <h2>Hello ${toName || 'User'},</h2>
      <p>You requested a password reset for your MealBridge account.</p>
      <p><strong>Your reset code is:</strong></p>
      <p style="font-size: 24px; font-weight: 700; letter-spacing: 4px;">${resetCode}</p>
      <p>This code expires in 20 minutes. If you did not request this, please ignore this email.</p>
    `
  };

  const info = await transport.sendMail(mailOptions);
  const previewUrl = transporterMeta.isTest ? nodemailer.getTestMessageUrl(info) : null;
  console.log(`Password reset email sent to ${toEmail}. Preview URL: %s`, previewUrl);
  return { previewUrl };
};

const sendTwoFactorCodeEmail = async (toEmail, toName, verificationCode) => {
  try {
    const transport = await createTransporter();
    if (!transport) {
      console.warn(`Email transport not available for 2FA code to ${toEmail}`);
      return { previewUrl: null };
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || '"MealBridge Security" <adminmealbridge@gmail.com>',
      to: toEmail,
      subject: 'MealBridge Login Verification Code',
      text: `Hello ${toName || 'User'},\n\nYour MealBridge verification code is:\n\n${verificationCode}\n\nThis code expires in 5 minutes. If you did not try to sign in, please ignore this email.\n\nThank you!`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff; color: #1e293b;">
          <h2 style="color: #0f766e; margin-top: 0; font-size: 22px; font-weight: 700;">MealBridge Security</h2>
          <p style="font-size: 15px; color: #334155;">Hello <strong>${toName || 'User'}</strong>,</p>
          <p style="font-size: 15px; color: #334155;">Use the verification code below to complete your login:</p>
          <div style="background: #f0fdfa; border: 2px dashed #0d9488; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
            <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #0f766e; font-family: monospace;">${verificationCode}</span>
          </div>
          <p style="color: #64748b; font-size: 13px; line-height: 1.5;">This code expires in 5 minutes. If you did not try to sign in, please ignore this email or change your password.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">MealBridge · Connecting surplus food to communities in need</p>
        </div>
      `
    };

    const info = await transport.sendMail(mailOptions);
    const previewUrl = transporterMeta.isTest ? nodemailer.getTestMessageUrl(info) : null;
    console.log(`2FA email sent to ${toEmail}. Preview URL: %s`, previewUrl);
    return { success: true, previewUrl };
  } catch (err) {
    console.error(`Error sending 2FA email to ${toEmail}:`, err.message);
    return { success: false, error: err.message };
  }
};

const sendVerificationEmail = async (toEmail, toName, verificationCode) => {
  try {
    const transport = await createTransporter();
    if (!transport) {
      console.warn(`Email transport not available for verification code to ${toEmail}`);
      return { previewUrl: null };
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || '"MealBridge Verification" <adminmealbridge@gmail.com>',
      to: toEmail,
      subject: 'MealBridge Email Verification Code',
      text: `Hello ${toName || 'User'},\n\nPlease verify your email address for your MealBridge account. Use the code below:\n\n${verificationCode}\n\nThis code expires in 20 minutes.\n\nThank you!`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff; color: #1e293b;">
          <h2 style="color: #15803d; margin-top: 0; font-size: 22px; font-weight: 700;">Welcome to MealBridge!</h2>
          <p style="font-size: 15px; color: #334155;">Hello <strong>${toName || 'User'}</strong>,</p>
          <p style="font-size: 15px; color: #334155;">Thank you for registering. Please enter the verification code below to verify your email address:</p>
          <div style="background: #f0fdf4; border: 2px dashed #16a34a; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
            <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #15803d; font-family: monospace;">${verificationCode}</span>
          </div>
          <p style="color: #64748b; font-size: 13px; line-height: 1.5;">This verification code expires in 20 minutes. If you did not create a MealBridge account, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">MealBridge · Connecting surplus food to communities in need</p>
        </div>
      `
    };

    const info = await transport.sendMail(mailOptions);
    const previewUrl = transporterMeta.isTest ? nodemailer.getTestMessageUrl(info) : null;
    console.log(`Verification email sent to ${toEmail}. Preview URL: %s`, previewUrl);
    return { success: true, previewUrl };
  } catch (err) {
    console.error(`Error sending verification email to ${toEmail}:`, err.message);
    return { success: false, error: err.message };
  }
};

const sendReceiptEmail = async (toEmail, toName, receiptPath, subject = 'Your MealBridge Donation Receipt') => {
  const transport = await createTransporter();
  if (!transport) return;

  const absolutePath = path.join(__dirname, '..', receiptPath.replace(/^\//, ''));

  const mailOptions = {
    from: process.env.SMTP_FROM || '"MealBridge Receipts" <receipts@mealbridge.com>',
    to: toEmail,
    subject,
    text: `Hello ${toName},\n\nThank you for your donation. Please find your official receipt attached for tax purposes.\n\nBest regards,\nMealBridge`,
    attachments: [
      {
        filename: path.basename(absolutePath),
        path: absolutePath
      }
    ]
  };

  try {
    const info = await transport.sendMail(mailOptions);
    console.log(`Receipt emailed to ${toEmail}. Preview: %s`, nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error(`Error sending receipt to ${toEmail}:`, error);
  }
};

const sendApprovalEmail = async (toEmail, toName) => {
  const transport = await createTransporter();
  if (!transport) return;

  const mailOptions = {
    from: process.env.SMTP_FROM || '"MealBridge Admin" <adminmealbridge@gmail.com>',
    to: toEmail,
    subject: 'Your MealBridge Account is Approved!',
    text: `Hello ${toName},\n\nGreat news! Your MealBridge account has been successfully approved by the admin. You can now log in and start using the platform.\n\nThank you!`,
    html: `
      <h2>Hello ${toName},</h2>
      <p>Great news! Your MealBridge account has been successfully approved by the admin.</p>
      <p>You can now log in and start using the platform.</p>
      <p>Thank you!</p>
    `
  };

  try {
    const info = await transport.sendMail(mailOptions);
    console.log(`Approval email sent to ${toEmail}. Preview URL: %s`, nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error(`Error sending approval email to ${toEmail}:`, error);
  }
};

module.exports = { sendFoodAlertEmail, sendPasswordResetEmail, sendReceiptEmail, sendVerificationEmail, sendApprovalEmail, sendTwoFactorCodeEmail };
