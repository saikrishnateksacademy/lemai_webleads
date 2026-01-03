import { validateLead } from "../validators/lead.schema.js";

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

// Backwards-compatible name expected by routes
export const validateLeadMiddleware = validateLeadRequest;
