import { InfozitWebsiteLead } from "../models/index.js";
import { infozitLeadQueue } from "../utils/queue.js";

export const saveAndQueueInfozitLead = async (data) => {
  const existingLead = await InfozitWebsiteLead.findOne({ where: { email: data.email } });

  let lead;

  if (existingLead) {
    await existingLead.update({
      source: data.source || null,
      name: data.name,
      contact: data.contact,
      city: data.city || null,
      service: data.service || null,
      occupation: data.occupation || null,
      message: data.message || null,
      status: "PENDING_CRM",
      retry_count: 0
    });
    lead = existingLead;
    console.log("Infozit Lead updated instead of created");
  } else {
    lead = await InfozitWebsiteLead.create({
      source: data.source || null,
      name: data.name,
      email: data.email,
      contact: data.contact,
      city: data.city || null,
      service: data.service || null,
      occupation: data.occupation || null,
      message: data.message || null,
      status: "PENDING_CRM",
      retry_count: 0
    });
    console.log("New Infozit Lead created");
  }

  await infozitLeadQueue.add(
    "crm-sync",
    { leadId: lead.id },
    {
      attempts: 8,
      backoff: {
        type: "exponential",
        delay: 10000
      },
      removeOnComplete: true,
      removeOnFail: false,
      timeout: 60000
    }
  );

  return lead.id;
};
