import { Worker } from "bullmq";
import redis from "../utils/redis.js";
import db from "../config/database.js";
import axios from "axios";

export const startLeadWorker = () => {
  new Worker(
    "lead-queue",
    async job => {
      const { leadId } = job.data;

      const [rows] = await db.query(
        "SELECT * FROM leads WHERE id = ?",
        [leadId]
      );
      const lead = rows[0];
      if (!lead) return;

      await axios.post(process.env.CRM_API_URL, {
        email: lead.email,
        name: lead.name,
        phone: lead.full_phone
      });

      await db.query(
        "UPDATE leads SET status = ?, retry_count = 0 WHERE id = ?",
        ["SENT_TO_CRM", leadId]
      );
    },
    { connection: redis }
  );

  console.log("✅ Lead Worker started");
};
