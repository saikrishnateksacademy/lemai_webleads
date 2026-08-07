import "../config/env.js";
import { Worker } from "bullmq";
import axios from "axios";
import redis from "../utils/redis.js";
import logger from "../utils/logger.js";
import { getStrategy } from "../registry.js";

// Retry / Timeout Configuration
const CRM_TIMEOUT_MS = 60_000;   // 60 seconds per CRM request
const CRM_RETRY_DELAY = 10_000;   // base backoff: 10s → 20s → 40s …

// Job Processor
const processJob = async (job) => {
  const { siteKey, leadId } = job.data;

  // Resolve site strategy
  const strategy = getStrategy(siteKey);
  if (!strategy) {
    // Unknown site — don't retry; log and discard
    logger.error({ siteKey, leadId }, "[Worker] Unknown siteKey — job discarded");
    return;
  }

  // Fetch the lead from site's own model
  const lead = await strategy.model.findByPk(leadId);
  if (!lead) {
    logger.warn({ siteKey, leadId }, "[Worker] Lead not found in DB — job discarded");
    return;
  }

  // Resolve CRM endpoint — per-site override or global default
  const crmUrl = strategy.crmUrl || process.env.CRM_API_URL;
  if (!crmUrl) {
    throw new Error(`[Worker] CRM URL not configured for site '${siteKey}'`);
  }

  // Build exact CRM payload using site's own toCrmPayload()
  const crmPayload = strategy.toCrmPayload(lead);

  logger.debug({ siteKey, leadId, crmUrl }, "[Worker] Sending lead to CRM");

  // POST to CRM
  await axios.post(crmUrl, crmPayload, {
    timeout: CRM_TIMEOUT_MS,
    headers: { "Content-Type": "application/json" },
  });

  // Mark lead as successfully sent
  await lead.update({ status: "SENT_TO_CRM", retry_count: 0 });

  logger.debug({ siteKey, leadId }, "[Worker] ✅ Lead sent to CRM successfully");
};

// Failure Handler
const handleFailure = async (job, err) => {
  const { siteKey, leadId } = job?.data ?? {};

  logger.error(
    { siteKey, leadId, jobId: job?.id, err: err?.message, attemptsMade: job?.attemptsMade },
    "[Worker] ❌ Job failed"
  );

  if (!siteKey || !leadId) return;

  try {
    const strategy = getStrategy(siteKey);
    if (!strategy) return;

    const lead = await strategy.model.findByPk(leadId);
    if (!lead) return;

    const isLastAttempt = job?.attemptsMade >= (job?.opts?.attempts ?? 8);

    await lead.update({
      status: isLastAttempt ? "FAILED" : "RETRYING",
      retry_count: (lead.retry_count || 0) + 1,
    });
  } catch (updateErr) {
    logger.error({ err: updateErr.message }, "[Worker] Failed to update lead status after job failure");
  }
};

// Worker Factory
export const startUnifiedLeadWorker = () => {
  const worker = new Worker("site-lead-queue", processJob, {
    connection: redis,
    concurrency: 5,   // process up to 5 CRM sync jobs in parallel
  });

  worker.on("failed", handleFailure);
  worker.on("error", (err) => logger.error({ err: err.message }, "[Worker] Worker error"));
  worker.on("stalled", (jobId) => logger.warn({ jobId }, "[Worker] Job stalled"));
  worker.on("completed", (job) => logger.debug({ jobId: job.id, siteKey: job.data?.siteKey }, "[Worker] Job completed"));

  logger.info("[Worker] ✅ Unified Lead Worker started (site-lead-queue)");
  return worker;
};
