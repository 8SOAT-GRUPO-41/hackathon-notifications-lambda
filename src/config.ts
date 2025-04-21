export const config = {
  email: {
    smtp: {
      host: process.env.SMTP_HOST || "email-smtp.us-east-1.amazonaws.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME || "",
        pass: process.env.SMTP_PASSWORD || "",
      },
    },
    sender: process.env.SENDER_EMAIL || "notifications@example.com",
  },
  frontendUrl:
    "http://hackathon-g41-frontend-bucket.s3-website-us-east-1.amazonaws.com",
};
