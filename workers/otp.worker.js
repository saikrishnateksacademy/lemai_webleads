import "../config/env.js";
import { Worker } from "bullmq";
import redis from "../utils/redis.js";
import { sendEmail } from "../utils/email.js";

new Worker(
  "otp-queue",
  async job => {
    try {
      const { email, code } = job.data;

      await sendEmail({
        to: email,
        subject: "Your OTP Code for Secure Verification",
        otp: code
      });

      console.log("OTP Email sent:", email);
      return true;
    } catch (err) {
      console.error("EMAIL FAILED:", err.response?.body || err.message);
      throw err; // REQUIRED for retries
    }
  },
  { connection: redis }
);
