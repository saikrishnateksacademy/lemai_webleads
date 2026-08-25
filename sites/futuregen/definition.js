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
    phone: { type: "string", minLength: 6, maxLength: 50 },
    email: { type: "string", format: "email", nullable: true },
    course: { type: "string", nullable: true },
    courseSlug: { type: "string", nullable: true },
    message: { type: "string", nullable: true },
    pagePath: { type: "string", nullable: true },
    pageTitle: { type: "string", nullable: true },
    meta: { type: "object", additionalProperties: true, nullable: true },
    clientTimestamp: { type: "string", nullable: true },
    referrer: { type: "string", nullable: true },
    utmSource: { type: "string", nullable: true },
    utmMedium: { type: "string", nullable: true },
    utmCampaign: { type: "string", nullable: true },
    utmTerm: { type: "string", nullable: true },
    utmContent: { type: "string", nullable: true },
    deviceType: { type: "string", nullable: true },
    userAgent: { type: "string", nullable: true },

    // CRM fields
    owner: { type: ["number", "string"], nullable: true },
    category: { type: ["number", "string"], nullable: true },
    product: { type: ["number", "string"], nullable: true },
    volume: { type: ["number", "string"], nullable: true },
    highest_qualification: { type: "string", nullable: true },
    highestQualification: { type: "string", nullable: true },
    what_is_your_current_qualification: { type: "string", nullable: true },
    current_status: { type: "string", nullable: true },
    currentStatus: { type: "string", nullable: true },
    campaign: { type: "string", nullable: true },
    interested_course: { type: "string", nullable: true },
    which_course_are_you_interested_in: { type: "string", nullable: true },
    when_you_want_to_start: { type: "string", nullable: true },
    when_would_you_like_to_start: { type: "string", nullable: true },
    whenToStart: { type: "string", nullable: true },
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

  toDbRecord: (data) => ({
    source: data.source ? String(data.source) : "321",
    name: data.name,
    phone: data.phone,
    email: data.email || null,
    course: data.course || data.which_course_are_you_interested_in || data.interested_course || null,
    course_slug: data.courseSlug || null,
    message: data.message || null,
    page_path: data.pagePath || null,
    page_title: data.pageTitle || null,
    meta: data.meta || null,
    client_timestamp: data.clientTimestamp || null,
    referrer: data.referrer || null,
    utm_source: data.utmSource || null,
    utm_medium: data.utmMedium || null,
    utm_campaign: data.utmCampaign || null,
    utm_term: data.utmTerm || null,
    utm_content: data.utmContent || null,
    device_type: data.deviceType || null,
    user_agent: data.userAgent || null,

    // CRM fields
    owner: data.owner ? Number(data.owner) : null,
    category: data.category ? Number(data.category) : null,
    product: data.product ? Number(data.product) : null,
    volume: data.volume ? Number(data.volume) : null,
    highest_qualification: data.highest_qualification || data.highestQualification || data.what_is_your_current_qualification || null,
    current_status: data.current_status || data.currentStatus || null,
    campaign: data.campaign || data.utmCampaign || null,
    when_to_start: data.when_you_want_to_start || data.when_would_you_like_to_start || data.whenToStart || null,
  }),

  toCrmPayload: (lead) => {
    const course = lead.course || lead.course_slug || "";
    const qualification = lead.highest_qualification || lead.meta?.highest_qualification || lead.meta?.what_is_your_current_qualification || "";
    const currentStatus = lead.current_status || lead.meta?.current_status || "";
    const startTiming = lead.when_to_start || lead.meta?.when_you_want_to_start || lead.meta?.when_would_you_like_to_start || "";
    const campaignVal = lead.campaign || lead.utm_campaign || lead.utm_source || "";

    const payload = {
      name: lead.name || "",
      email: lead.email || "",
      phone_number: lead.phone ? String(lead.phone).replace(/\s+/g, "") : "",
      source: lead.source ? (Number(lead.source) || lead.source) : 321,
      which_course_are_you_interested_in: course,
      interested_course: course,
      campaign: campaignVal,
      highest_qualification: qualification,
      what_is_your_current_qualification: qualification,
      current_status: currentStatus,
      when_you_want_to_start: startTiming,
      when_would_you_like_to_start: startTiming,
    };

    if (lead.owner !== null && lead.owner !== undefined) {
      payload.owner = Number(lead.owner) || lead.owner;
    } else if (lead.meta?.owner !== undefined) {
      payload.owner = Number(lead.meta.owner) || lead.meta.owner;
    }

    if (lead.category !== null && lead.category !== undefined) {
      payload.category = Number(lead.category) || lead.category;
    } else if (lead.meta?.category !== undefined) {
      payload.category = Number(lead.meta.category) || lead.meta.category;
    }

    if (lead.product !== null && lead.product !== undefined) {
      payload.product = Number(lead.product) || lead.product;
    } else if (lead.meta?.product !== undefined) {
      payload.product = Number(lead.meta.product) || lead.meta.product;
    }

    if (lead.volume !== null && lead.volume !== undefined) {
      payload.volume = Number(lead.volume) || lead.volume;
    } else if (lead.meta?.volume !== undefined) {
      payload.volume = Number(lead.meta.volume) || lead.meta.volume;
    }

    return payload;
  },

  get crmUrl() {
    return process.env.FEATURE_GEN_CRM_URL || process.env.FUTURE_GEN_CRM_URL;
  },
};

export default futuregenDefinition;
