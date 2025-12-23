import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, removeAdditional: true });
addFormats(ajv);

export const leadSchema = {
  type: "object",
  required: ["name", "email", "country_code", "phone_number"],
  properties: {
    name: { type: "string", minLength: 2, maxLength: 150 },
    email: { type: "string", format: "email" },

    country_code: {
      type: "string",
      pattern: "^\\+[0-9]{1,4}$"
    },

    phone_number: {
      type: "string",
      pattern: "^[0-9]{6,15}$"
    },

    company_name: { type: "string", nullable: true },
    city: { type: "string", nullable: true },

    sales_team_size: {
      type: "string",
      enum: ["0-5","5-10","10-25","25-50","50-100","Above 100"],
      nullable: true
    },

    heard_from: {
      type: "string",
      enum: [
        "Google Search",
        "FB & Instagram",
        "Social Media",
        "Reference",
        "Inf",
        "Others"
      ],
      nullable: true
    },

    heard_from_text: {
      type: "string",
      minLength: 3,
      maxLength: 255,
      nullable: true
    }
  },

  allOf: [
    {
      if: {
        properties: { heard_from: { const: "Others" } }
      },
      then: {
        required: ["heard_from_text"]
      }
    }
  ],

  additionalProperties: false
};

export const validateLead = ajv.compile(leadSchema);
