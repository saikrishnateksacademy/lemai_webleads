import { Worker } from "bullmq";
import redis from "../utils/redis.js";
import { sendEmail } from "../utils/email.js";

new Worker(
  "otp-queue",
  async (job) => {
    const { email, otp } = job.data;

    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`
    });
  },
  { connection: redis }
);

console.log("OTP Worker Running");
