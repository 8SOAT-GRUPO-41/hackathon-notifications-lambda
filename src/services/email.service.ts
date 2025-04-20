import nodemailer from "nodemailer";
import { config } from "../config";
import { NotificationPayload } from "../handler";

// Configure nodemailer with AWS SES
const transporter = nodemailer.createTransport(config.email.smtp);

// Email templates
const generateCompletedTemplate = (payload: NotificationPayload): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #2c3e50; text-align: center;">Video Processing Complete</h2>
      <div style="padding: 15px; background-color: #f8f9fa; border-radius: 4px; margin-bottom: 20px;">
        <p style="margin: 5px 0;"><strong>Video ID:</strong> ${payload.videoId}</p>
        <p style="margin: 5px 0;"><strong>Video Name:</strong> ${payload.videoName}</p>
        <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #27ae60; font-weight: bold;">COMPLETED</span></p>
      </div>
      <p>Your video has been successfully processed and is now available for viewing.</p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="#" style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Your Video</a>
      </div>
      <p style="color: #7f8c8d; font-size: 12px; text-align: center; margin-top: 30px;">This is an automated message, please do not reply to this email.</p>
    </div>
  `;
};

const generateFailedTemplate = (payload: NotificationPayload): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
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
