import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, removeAdditional: true });
addFormats(ajv);

export const infozitLeadSchema = {
  type: "object",
  required: ["name", "email", "contact"],
  properties: {
    source: { type: "string", nullable: true },
    name: { type: "string", minLength: 2, maxLength: 255 },
    email: { type: "string", format: "email" },
    contact: { type: "string", minLength: 6, maxLength: 30 },
    city: { type: "string", nullable: true },
    service: { type: "string", nullable: true },
    occupation: { type: "string", nullable: true },
    message: { type: "string", nullable: true }
  },
  additionalProperties: false
};

export const validateInfozitLead = ajv.compile(infozitLeadSchema);
