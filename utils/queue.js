import { Queue } from "bullmq";
import redis from "./redis.js";

export const otpQueue = new Queue("otp-queue", { connection: redis });
export const leadQueue = new Queue("lead-queue", { connection: redis });
