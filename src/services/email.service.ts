import nodemailer from "nodemailer";
import { config } from "../config";
import { NotificationPayload } from "../handler";

// Configure nodemailer with AWS SES
const transporter = nodemailer.createTransport(config.email.smtp);

// Logo HTML for email templates
const logoHtml = `
  <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07));">
      <rect width="42" height="42" rx="10" fill="rgb(211, 15, 89)" />
      <circle cx="21" cy="21" r="13" fill="white" fillOpacity="0.1" stroke="white" strokeWidth="1" />
      <circle cx="21" cy="14" r="3" fill="white" />
      <circle cx="14" cy="21" r="3" fill="white" />
      <circle cx="28" cy="21" r="3" fill="white" />
      <circle cx="21" cy="28" r="3" fill="white" />
      <circle cx="21" cy="21" r="3.5" fill="white" />
      <line x1="21" y1="17" x2="21" y2="18" stroke="white" strokeWidth="1.5" />
      <line x1="17" y1="21" x2="18" y2="21" stroke="white" strokeWidth="1.5" />
      <line x1="24" y1="21" x2="25" y2="21" stroke="white" strokeWidth="1.5" />
      <line x1="21" y1="24" x2="21" y2="25" stroke="white" strokeWidth="1.5" />
      <path d="M21 13L19 15H23L21 13Z" fill="rgb(211, 15, 89)" />
      <path d="M13 21L15 19V23L13 21Z" fill="rgb(211, 15, 89)" />
      <path d="M29 21L27 19V23L29 21Z" fill="rgb(211, 15, 89)" />
      <path d="M21 29L23 27H19L21 29Z" fill="rgb(211, 15, 89)" />
      <path d="M19.5 19.5H22.5V22.5H19.5V19.5Z" fill="rgb(211, 15, 89)" />
    </svg>
    <span style="font-weight: bold; font-size: 24px; letter-spacing: -0.5px; color: rgb(211, 15, 89); margin-left: 12px;">FIAP X</span>
  </div>
`;

// Email templates
const generateCompletedTemplate = (payload: NotificationPayload): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      ${logoHtml}
      <h2 style="color: #2c3e50; text-align: center;">Video Processing Complete</h2>
      <div style="padding: 15px; background-color: #f8f9fa; border-radius: 4px; margin-bottom: 20px;">
        <p style="margin: 5px 0;"><strong>Video ID:</strong> ${payload.videoId}</p>
        <p style="margin: 5px 0;"><strong>Video Name:</strong> ${payload.videoName}</p>
        <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #27ae60; font-weight: bold;">COMPLETED</span></p>
      </div>
      <p>Your video has been successfully processed and is now available for viewing.</p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="${config.frontendUrl}/results" style="background-color: #d30f59; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Your Video</a>
      </div>
      <p style="color: #7f8c8d; font-size: 12px; text-align: center; margin-top: 30px;">This is an automated message, please do not reply to this email.</p>
    </div>
  `;
};

const generateFailedTemplate = (payload: NotificationPayload): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      ${logoHtml}
      <h2 style="color: #2c3e50; text-align: center;">Video Processing Failed</h2>
      <div style="padding: 15px; background-color: #f8f9fa; border-radius: 4px; margin-bottom: 20px;">
        <p style="margin: 5px 0;"><strong>Video ID:</strong> ${
          payload.videoId
        }</p>
        <p style="margin: 5px 0;"><strong>Video Name:</strong> ${
          payload.videoName
        }</p>
        <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #e74c3c; font-weight: bold;">FAILED</span></p>
      </div>
      <p><strong>Reason for failure:</strong> ${
        payload.failureReason || "Unknown error occurred during processing"
      }</p>
      <p>Please try uploading your video again. If the problem persists, contact our support team.</p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="#" style="background-color: #e74c3c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Contact Support</a>
      </div>
      <p style="color: #7f8c8d; font-size: 12px; text-align: center; margin-top: 30px;">This is an automated message, please do not reply to this email.</p>
    </div>
  `;
};

export const sendEmailNotification = async (
  payload: NotificationPayload
): Promise<void> => {
  if (!payload.email) {
    console.warn("No email address provided for notification");
    return;
  }

  const subject =
    payload.status === "COMPLETED"
      ? `Video Processing Complete: ${payload.videoName}`
      : `Video Processing Failed: ${payload.videoName}`;

  const htmlContent =
    payload.status === "COMPLETED"
      ? generateCompletedTemplate(payload)
      : generateFailedTemplate(payload);

  const mailOptions = {
    from: config.email.sender,
    to: payload.email,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
