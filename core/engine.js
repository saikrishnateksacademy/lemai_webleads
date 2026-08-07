import { getStrategy } from "../registry.js";
import { getOtp, deleteOtp } from "../utils/otpStore.js";
import { siteLeadQueue } from "../utils/queue.js";
import logger from "../utils/logger.js";

// Custom Error Classes
export class SiteNotFoundError extends Error {
  constructor(siteKey) {
    super(`Unknown site: '${siteKey}'`);
    this.code = "SITE_NOT_FOUND";
    this.statusCode = 404;
  }
}

export class ValidationError extends Error {
  constructor(errors) {
    super("Request payload validation failed");
    this.code = "VALIDATION_FAILED";
    this.statusCode = 400;
    this.errors = errors;
  }
}

export class OtpVerificationError extends Error {
  constructor(message = "Email not verified. Please verify OTP before submitting.") {
    super(message);
    this.code = "OTP_NOT_VERIFIED";
    this.statusCode = 403;
  }
}

// Queue Options (same for all sites)
const QUEUE_JOB_OPTIONS = {
  attempts: 8,
  backoff: {
    type: "exponential",
    delay: 10000,   // 10s → 20s → 40s → 80s ...
  },
  removeOnComplete: true,
  removeOnFail: false,  // keep failed jobs visible in Bull Board
};

// Core Engine 
/**
 * Steps:
 *   1. Resolve site strategy from registry
 *   2. Validate request payload (AJV — site's own schema)
 *   3. Enforce OTP if site requires it
 *   4. Upsert lead into site's own DB table
 *   5. Delete OTP record (if applicable)
 *   6. Enqueue CRM sync job to unified queue
 */
export const submitLead = async (siteKey, data) => {
  // Resolve strategy
  const strategy = getStrategy(siteKey);
  if (!strategy) throw new SiteNotFoundError(siteKey);

  // Validate payload against site's own AJV schema
  const valid = strategy.validator(data);
  if (!valid) throw new ValidationError(strategy.validator.errors);

  // OTP check (only if site requires it)
  if (strategy.requiresOtp) {
    const otp = await getOtp(data.email);
    if (!otp || !otp.verified) {
      throw new OtpVerificationError();
    }
  }

  // Map incoming payload → DB fields and upsert
  const dbRecord = strategy.toDbRecord(data);
  const upsertKey = strategy.upsertKey || "email";

  let lead;
  const existingLead = await strategy.model.findOne({
    where: { [upsertKey]: data[upsertKey] },
  });

  if (existingLead) {
    await existingLead.update({
      ...dbRecord,
      status: "PENDING_CRM",
      retry_count: 0,
    });
    lead = existingLead;
  } else {
    lead = await strategy.model.create({
      ...dbRecord,
      status: "PENDING_CRM",
      retry_count: 0,
    });
  }

  // Delete OTP after successful DB write
  if (strategy.requiresOtp) {
    await deleteOtp(data.email);
  }

  // Enqueue CRM sync job to unified queue
  await siteLeadQueue.add(
    "crm-sync",
    { siteKey, leadId: lead.id },
    QUEUE_JOB_OPTIONS
  );

  return lead.id;
};
