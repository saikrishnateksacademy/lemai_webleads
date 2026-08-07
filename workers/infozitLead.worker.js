import { Worker } from "bullmq";
import redis from "../utils/redis.js";
import db from "../config/database.js";
import axios from "axios";

export const startInfozitLeadWorker = () => {
  new Worker(
    "infozit-lead-queue",
    async job => {
      const { leadId } = job.data;

      const [rows] = await db.query(
        "SELECT * FROM infozit_website_leads WHERE id = ?",
        [leadId]
      );
      const lead = rows[0];
      if (!lead) return;

      if (process.env.CRM_API_URL) {
        await axios.post(process.env.CRM_API_URL, {
          email: lead.email,
          name: lead.name,
          phone: lead.contact,
          city: lead.city,
          service: lead.service,
          occupation: lead.occupation,
          message: lead.message,
          source: lead.source
        });
      }

      await db.query(
        "UPDATE infozit_website_leads SET status = ?, retry_count = 0 WHERE id = ?",
        ["SENT_TO_CRM", leadId]
      );
    },
    { connection: redis }
  );

  console.log("✅ Infozit Lead Worker started");
};
