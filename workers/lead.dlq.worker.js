import { Worker } from "bullmq";
import redis from "../utils/redis.js";

new Worker(
  "lead-queue",
  async () => {},
  { connection: redis }
).on("failed", async (job, err) => {
  console.error("🚨 LEAD JOB FAILED PERMANENTLY");
  console.error("Job ID:", job.id);
  console.error("Payload:", job.data);
  console.error("Reason:", err?.message);
});

console.log("Lead DLQ Listener Running");
