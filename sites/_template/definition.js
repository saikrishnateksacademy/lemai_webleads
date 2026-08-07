import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, removeAdditional: true });
addFormats(ajv);

const schema = {
  type: "object",
  required: ["name", "email", "phone"],
  properties: {
    name: { type: "string", minLength: 2, maxLength: 255 },
    email: { type: "string", format: "email" },
    phone: { type: "string", minLength: 6, maxLength: 30 },
  },
  additionalProperties: false,
};

const validator = ajv.compile(schema);

const newSiteDefinition = {
  siteKey: "REPLACE_WITH_YOUR_SITE_KEY",
  requiresOtp: false,
  model: null,
  upsertKey: "email",
  validator,

  toDbRecord: (data) => ({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
  }),
  toCrmPayload: (lead) => ({
    // ← Define your CRM's expected field names and values here
    full_name: lead.name || "",
    email: lead.email || "",
    mobile: lead.phone || "",
    // program:   lead.course  || "",
    // source:    lead.source  || 000,
  }),

  /**
   * Optional: specific CRM endpoint for this site.
   * Leave undefined to fall back to process.env.CRM_API_URL
   */
  crmUrl: undefined,
  // crmUrl: process.env.NEWSITE_CRM_API_URL,
};

export default newSiteDefinition;
