import Ajv from "ajv";
import addFormats from "ajv-formats";
import LemaiLead from "./model.js";

const ajv = new Ajv({ allErrors: true, removeAdditional: true });
addFormats(ajv);

const salesMap = {
  "0-5": "SIZE_0_5",
  "5-10": "SIZE_5_10",
  "10-25": "SIZE_10_25",
  "25-50": "SIZE_25_50",
  "50-100": "SIZE_50_100",
  "Above 100": "ABOVE_100",
};

const heardMap = {
  "Google Search": "GOOGLE_SEARCH",
  "FaceBook & Instagram": "FB_INSTAGRAM",
  "Social Media": "SOCIAL_MEDIA",
  "Reference": "REFERENCE",
  "Influencer": "INFLUENCER",
  "Others": "OTHERS",
};

// Maps stored ENUM value → number for CRM
const salesSizeToNumber = {
  SIZE_0_5: 5,
  SIZE_5_10: 10,
  SIZE_10_25: 25,
  SIZE_25_50: 50,
  SIZE_50_100: 100,
  ABOVE_100: 10000,
  // also accept raw labels
  "0-5": 5,
  "5-10": 10,
  "10-25": 25,
  "25-50": 50,
  "50-100": 100,
  "Above 100": 10000,
};

const schema = {
  type: "object",
  required: ["name", "email", "country_code", "phone_number"],
  properties: {
    name: { type: "string", minLength: 2, maxLength: 150 },
    email: { type: "string", format: "email" },
    country_code: { type: "string", pattern: "^\\+[0-9]{1,4}$" },
    phone_number: { type: "string", pattern: "^[0-9]{6,15}$" },
    company_name: { type: "string", nullable: true },
    city: { type: "string", nullable: true },
    source_id: { type: ["string", "number"], nullable: true },
    sales_team_size: {
      type: "string",
      enum: ["0-5", "5-10", "10-25", "25-50", "50-100", "Above 100"],
      nullable: true,
    },
    heard_from: {
      type: "string",
      enum: [
        "Google Search", "FaceBook & Instagram", "Social Media",
        "Reference", "Influencer", "Others",
      ],
      nullable: true,
    },
    heard_from_text: { type: "string", minLength: 3, maxLength: 255, nullable: true },
  },
  allOf: [
    {
      if: { properties: { heard_from: { const: "Others" } } },
      then: { required: ["heard_from_text"] },
    },
  ],
  additionalProperties: false,
};

const validator = ajv.compile(schema);

const lemaiDefinition = {
  siteKey: "lemai",

  requiresOtp: true,
  model: LemaiLead,

  upsertKey: "email",

  validator,
  toDbRecord: (data) => {
    const full = `${data.country_code}${data.phone_number}`;
    const heard = data.heard_from?.toLowerCase();

    return {
      name: data.name,
      email: data.email,
      country_code: data.country_code,
      phone_number: data.phone_number,
      full_phone: full,
      company_name: data.company_name || null,
      city: data.city || null,
      source_id: data.source_id ?? null,
      sales_team_size: salesMap[data.sales_team_size] || null,
      heard_from: heardMap[data.heard_from] || null,
      heard_from_text: heard === "others" ? data.heard_from_text : null,
    };
  },
  toCrmPayload: (lead) => {
    const payload = {
      name: lead.name || "",
      email: lead.email || "",
      phone_number: lead.full_phone || lead.phone_number || "",
      company: lead.company_name || "",
      city: lead.city || "",
      heard_from: lead.heard_from_text || lead.heard_from || "",
      source: lead.source_id ? (Number(lead.source_id) || lead.source_id) : 172,
    };

    const teamSize = salesSizeToNumber[lead.sales_team_size];
    if (teamSize !== undefined) payload.sales_team_size = teamSize;

    return payload;
  },

  crmUrl: undefined,
};

export default lemaiDefinition;
