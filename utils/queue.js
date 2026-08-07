import { Queue } from "bullmq";
import redis from "./redis.js";

/** OTP email dispatch queue */
export const otpQueue = new Queue("otp-queue", { connection: redis });

/** Unified CRM sync queue — handles ALL registered websites */
export const siteLeadQueue = new Queue("site-lead-queue", { connection: redis });

