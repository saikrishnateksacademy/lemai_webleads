import { validateLead } from "../validators/lead.schema.js";
import { validateInfozitLead } from "../validators/infozitLead.schema.js";

export const validateLeadRequest = (req, res, next) => {
  const valid = validateLead(req.body);

  if (!valid) {
    return res.status(400).json({
      success: false,
      message: "Invalid lead data",
      errors: validateLead.errors
    });
  }

  next();
};

export const validateInfozitLeadRequest = (req, res, next) => {
  const valid = validateInfozitLead(req.body);

  if (!valid) {
    return res.status(400).json({
      success: false,
      message: "Invalid Infozit lead data",
      errors: validateInfozitLead.errors
    });
  }

  next();
};

// Backwards-compatible name expected by routes
export const validateLeadMiddleware = validateLeadRequest;
