import { Lead } from "../models/index.js";
import { leadQueue } from "../utils/queue.js";

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
  "FB & Instagram": "FB_INSTAGRAM",
  "Social Media": "SOCIAL_MEDIA",
  "Reference": "REFERENCE",
  "Inf": "INFLUENCER",
  "Others": "OTHERS",
};

export const saveAndQueueLead = async (data) => {
  const full = `${data.country_code}${data.phone_number}`;

  // Check if lead already exists
  const existingLead = await Lead.findOne({
    where: { email: data.email }
  });

  let lead;

  if (existingLead) {
    // UPDATE existing record
    await existingLead.update({
      name: data.name,
      country_code: data.country_code,
      phone_number: data.phone_number,
      full_phone: full,

      company_name: data.company_name || null,
      city: data.city || null,

      sales_team_size: salesMap[data.sales_team_size] || null,
      heard_from: heardMap[data.heard_from] || null,
      heard_from_text:
        data.heard_from === "Others" ? data.heard_from_text : null,

      status: "PENDING_CRM",
      retry_count: 0
    });

    lead = existingLead;
    console.log("Lead updated instead of created");
  } else {
    // CREATE new lead
    lead = await Lead.create({
      name: data.name,
      email: data.email,

      country_code: data.country_code,
      phone_number: data.phone_number,
      full_phone: full,

      company_name: data.company_name || null,
      city: data.city || null,

      sales_team_size: salesMap[data.sales_team_size] || null,
      heard_from: heardMap[data.heard_from] || null,
      heard_from_text:
        data.heard_from === "Others" ? data.heard_from_text : null,

      status: "PENDING_CRM",
      retry_count: 0
    });

    console.log("New lead created");
  }

  // Queue CRM Sync
  await leadQueue.add("crm-sync", { leadId: lead.id });

  return lead.id;
};
