import { Worker } from "bullmq";
import redis from "../utils/redis.js";
import { sendEmail } from "../utils/email.js";

export const startOtpWorker = () => {
  new Worker(
    "otp-queue",
    async job => {
      const { email, code } = job.data;

      await sendEmail({
        to: email,
        subject: "Your OTP Code – Secure Verification",
        otp: code
      });
    },
    { connection: redis }
  );

  console.log("✅ OTP Worker started");
};
