import Ajv from "ajv";
import addFormats from "ajv-formats";
import InfozitLead from "./model.js";

const ajv = new Ajv({ allErrors: true, removeAdditional: true });
addFormats(ajv);

const schema = {
  type: "object",
  required: ["name", "email", "contact"],
  properties: {
    source: { type: ["string", "number"], nullable: true },
    name: { type: "string", minLength: 2, maxLength: 255 },
    email: { type: "string", format: "email" },
    contact:{ type: "string", pattern: "^(\\+?[0-9]{1,4})?[0-9]{10}$"},
    city: { type: "string", nullable: true },
    service: { type: "string", nullable: true },
    occupation: { type: "string", nullable: true },
    message: { type: "string", nullable: true },
  },
  additionalProperties: false,
};

const validator = ajv.compile(schema);

const infozitDefinition = {
  siteKey: "infozit",
  requiresOtp: false,
  model: InfozitLead,
  upsertKey: "email",
  validator,
  toDbRecord: (data) => ({
    source: data.source || null,
    name: data.name,
    email: data.email,
    contact: data.contact,
    city: data.city || null,
    service: data.service || null,
    occupation: data.occupation || null,
    message: data.message || null,
  }),

  toCrmPayload: (lead) => ({
    name: lead.name || "",
    email: lead.email || "",
    phone_number: lead.contact || "",
    city: lead.city || "",
    which_program_are_you_interested_in: lead.service || "",
    current_employment_status: lead.occupation || "",
    what_type_of_business_do_you_operate: lead.message || "",
    source: lead.source ? (Number(lead.source) || lead.source) : 329,
  }),

  crmUrl: undefined,
};
export default infozitDefinition;