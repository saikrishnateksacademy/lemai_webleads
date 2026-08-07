import "../config/env.js";
import { Worker } from "bullmq";
import redis from "../utils/redis.js";
import { Lead } from "../models/index.js";
import axios from "axios";

const salesTeamSizeNumberMap = {
  "0-5": 5,
  "5-10": 10,
  "10-25": 25,
  "25-50": 50,
  "50-100": 100,
  "Above 100": 10000,
  "SIZE_0_5": 5,
  "SIZE_5_10": 10,
  "SIZE_10_25": 25,
  "SIZE_25_50": 50,
  "SIZE_50_100": 100,
  "ABOVE_100": 10000
};

const parseSalesTeamSize = (val) => {
  if (!val) return undefined;
  if (typeof val === "number" && !isNaN(val)) return val;
  if (salesTeamSizeNumberMap[val]) return salesTeamSizeNumberMap[val];
  const parsed = Number(val);
  return !isNaN(parsed) ? parsed : undefined;
};

export const startLeadWorker = () => {
  const worker = new Worker(
    "lead-queue",
    async (job) => {
      const { leadId } = job.data;

      const lead = await Lead.findByPk(leadId);
      if (!lead) {
        // console.error(`❌ Lead ID ${leadId} not found in database`);
        return;
      }

      if (!process.env.CRM_API_URL) {
        // console.error("❌ CRM_API_URL is missing in environment variables!");
        throw new Error("CRM_API_URL not configured");
      }

      // console.log(`🚀 Sending Lemai Lead ID ${leadId} (${lead.email}) to CRM at ${process.env.CRM_API_URL}...`);

      const crmPayload = {
        name: lead.name || "",
        email: lead.email || "",
        phone_number: lead.full_phone || lead.phone_number || "",
        company: lead.company_name || "",
        city: lead.city || "",
        heard_from: lead.heard_from_text || lead.heard_from || "",
        source: lead.source_id ? Number(lead.source_id) || lead.source_id : 172
      };

      const teamSize = parseSalesTeamSize(lead.sales_team_size);
      if (teamSize !== undefined) {
        crmPayload.sales_team_size = teamSize;
      }

      const response = await axios.post(process.env.CRM_API_URL, crmPayload);

      // console.log(`✅ CRM Response for Lemai Lead ID ${leadId}:`, response.status);

      await lead.update({
        status: "SENT_TO_CRM",
        retry_count: 0
      });
    },
    { connection: redis }
  );

  worker.on("failed", async (job, err) => {
    // console.error(`❌ Lead Worker Job ${job?.id} failed:`, err.message);
    if (job?.data?.leadId) {
      try {
        const lead = await Lead.findByPk(job.data.leadId);
        if (lead) {
          await lead.update({
            status: "FAILED",
            retry_count: (lead.retry_count || 0) + 1
          });
        }
      } catch (updateErr) {
        console.error("Failed to update lead status on job failure:", updateErr.message);
      }
    }
  });

  console.log("✅ Lead Worker started");
  return worker;
};
