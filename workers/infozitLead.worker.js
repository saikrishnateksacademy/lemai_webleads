import "../config/env.js";
import { Worker } from "bullmq";
import redis from "../utils/redis.js";
import { InfozitWebsiteLead } from "../models/index.js";
import axios from "axios";

export const startInfozitLeadWorker = () => {
  const worker = new Worker(
    "infozit-lead-queue",
    async (job) => {
      const { leadId } = job.data;

      const lead = await InfozitWebsiteLead.findByPk(leadId);
      if (!lead) {
        // console.error(`❌ Infozit Lead ID ${leadId} not found in database`);
        return;
      }

      if (!process.env.CRM_API_URL) {
        // console.error("❌ CRM_API_URL is missing in environment variables!");
        throw new Error("CRM_API_URL not configured");
      }

      // console.log(`🚀 Sending Infozit Lead ID ${leadId} (${lead.email}) to CRM at ${process.env.CRM_API_URL}...`);

      const crmPayload = {
        name: lead.name || "",
        email: lead.email || "",
        phone_number: lead.contact || "",
        city: lead.city || "",
        which_program_are_you_interested_in: lead.service || "",
        current_employment_status: lead.occupation || "",
        what_type_of_business_do_you_operate: lead.message || "",
        source: lead.source ? Number(lead.source) || lead.source : 329
      };

      const response = await axios.post(process.env.CRM_API_URL, crmPayload);

      // console.log(`✅ CRM Response for Infozit Lead ID ${leadId}:`, response.status);

      await lead.update({
        status: "SENT_TO_CRM",
        retry_count: 0
      });
    },
    { connection: redis }
  );

  worker.on("failed", async (job, err) => {
    // console.error(`❌ Infozit Lead Worker Job ${job?.id} failed:`, err.message);
    if (job?.data?.leadId) {
      try {
        const lead = await InfozitWebsiteLead.findByPk(job.data.leadId);
        if (lead) {
          await lead.update({
            status: "FAILED",
            retry_count: (lead.retry_count || 0) + 1
          });
        }
      } catch (updateErr) {
        console.error("Failed to update status on job failure:", updateErr.message);
      }
    }
  });

  // console.log("✅ Infozit Lead Worker started");
  return worker;
};
