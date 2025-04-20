import { SQSHandler } from "aws-lambda";
import { sendEmailNotification } from "./services/email.service";

type JobStatus = "COMPLETED" | "FAILED";

type Channel = "EMAIL";

export type NotificationPayload = {
  status: JobStatus;
  videoId: string;
  videoName: string;
  notificationChannel: Channel;
  email?: string;
  failureReason?: string;
};

export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    try {
      const event = JSON.parse(record.body) as NotificationPayload;
      await sendNotification(event);
    } catch (error) {
      console.error("Error processing SQS record:", error);
      throw error;
    }
  }
};

export const sendNotification = async (payload: NotificationPayload) => {
  console.log(
    `Processing notification for video: ${payload.videoId}, status: ${payload.status}`
  );

  if (payload.notificationChannel === "EMAIL") {
    if (!payload.email) {
      console.warn(
        `Cannot send email notification - no email address provided for video ${payload.videoId}`
      );
      return;
    }

    try {
      await sendEmailNotification(payload);
      console.log(`Email notification sent successfully to ${payload.email}`);
    } catch (error) {
      console.error(`Failed to send email notification: ${error}`);
      throw error;
    }
  } else {
    console.warn(
      `Unsupported notification channel: ${payload.notificationChannel}`
    );
  }
};
