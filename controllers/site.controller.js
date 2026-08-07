import { submitLead, SiteNotFoundError, ValidationError, OtpVerificationError } from "../core/engine.js";
import logger from "../utils/logger.js";

/**
 * POST /api/v1/sites/:siteKey/leads
 * Dynamic handler — works for any registered site.
 * All business logic lives in core/engine.js and the site's definition.js.
 */
export const submitSiteLead = async (req, res) => {
  const { siteKey } = req.params;

  try {
    const leadId = await submitLead(siteKey, req.body);

    return res.status(200).json({
      success: true,
      message: "Lead received. CRM sync queued.",
      siteKey,
      leadId,
    });

  } catch (err) {
    if (err instanceof SiteNotFoundError) {
      return res.status(404).json({
        success: false,
        code: err.code,
        message: err.message,
      });
    }

    /* 400 — AJV schema validation failure */
    if (err instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        code: err.code,
        message: err.message,
        errors: err.errors,
      });
    }

    //403 — OTP not verified 
    if (err instanceof OtpVerificationError) {
      return res.status(403).json({
        success: false,
        code: err.code,
        message: err.message,
      });
    }

    // 500 — unexpected error 
    logger.error({ siteKey, err: err.message }, "[Controller] Unhandled lead submission error");
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
};
