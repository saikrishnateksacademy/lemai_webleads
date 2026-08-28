import "../../config/env.js";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import FutureGenLead from "./model.js";

const ajv = new Ajv({ allErrors: true, removeAdditional: true, strict: false });
addFormats(ajv);

const schema = {
  type: "object",
  required: ["name", "phone"],
  properties: {
    source: { type: ["string", "number"], nullable: true },
    name: { type: "string", minLength: 1, maxLength: 255 },
    phone: { type: "string", pattern: "^(\\+?[0-9]{1,4})?[0-9]{10}$" },
    email: { type: "string", format: "email", nullable: true },
    course: { type: "string", nullable: true },
    message: { type: "string", nullable: true },
    pagePath: { type: "string", nullable: true },
    referrer: { type: "string", nullable: true },
    discount: { type: ["string", "number"], nullable: true },
    form_source: { type: "string", nullable: true },
  },
  additionalProperties: false,
};

const validator = ajv.compile(schema);

const futuregenDefinition = {
  siteKey: "futuregen",
  requiresOtp: false,
  model: FutureGenLead,
  upsertKey: "phone",
  validator,

  toDbRecord: (data) => {
    const digitsOnly = data.phone ? String(data.phone).replace(/\D/g, "") : "";
    const tenDigitPhone = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly;

    return {
      source: data.source ? String(data.source) : "101",
      name: data.name,
      phone: tenDigitPhone,
      email: data.email || null,
      course: data.course || null,
      message: data.message || null,
      page_path: data.pagePath || null,
      referrer: data.referrer || null,
      discount: data.discount ? String(data.discount) : null,
      form_source: data.form_source || null,
    };
  },

  toCrmPayload: (lead) => {
    const course = lead.course || "";
    const digitsOnly = lead.phone ? String(lead.phone).replace(/\D/g, "") : "";
    const tenDigitPhone = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly;

    return {
      name: lead.name || "",
      email: lead.email || "",
      phone_number: tenDigitPhone,
      source: lead.source ? (Number(lead.source) || lead.source) : 101,
      course,
      which_course_are_you_interested_in: course,
      interested_course: course,
      message: lead.message || "",
      page_path: lead.page_path || "",
      referrer: lead.referrer || "",
      discount: lead.discount || "",
      form_source: lead.form_source || "",
    };
  },

  get crmUrl() {
    return process.env.FEATURE_GEN_CRM_URL || process.env.FUTURE_GEN_CRM_URL;
  },
};

export default futuregenDefinition;
