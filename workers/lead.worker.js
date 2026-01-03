import "../config/env.js";
import { Worker } from "bullmq";
import axios from "axios";
import redis from "../utils/redis.js";
import db from "../config/database.js";

const CRM_TIMEOUT = 15000; // 15 seconds

new Worker(
  "lead-queue",
  async job => {
    const { leadId } = job.data;
    console.log("Processing Lead CRM Sync | Lead ID:", leadId);

    // Fetch lead
    const [rows] = await db.query(
      "SELECT * FROM leads WHERE id = ?",
      [leadId]
    );
    const lead = rows?.[0];

    if (!lead) {
      console.warn("Lead Not Found, skipping job | Lead ID:", leadId);
      return;
    }

    try {
      // ---- PUSH TO CRM ----
      await axios.post(
        process.env.CRM_API_URL,
        {
          email: lead.email,
          name: lead.name,
          phone: lead.full_phone
        },
        { timeout: CRM_TIMEOUT }
      );

      // Update DB status
      await db.query(
        "UPDATE leads SET status = ?, retry_count = 0 WHERE id = ?",
        ["SENT_TO_CRM", leadId]
      );

      console.log("CRM Sync Success |", lead.email);
    } 
    
    catch (err) {
      console.error(
        "CRM Sync Failed | Lead:",
        lead.email,
        "| Attempt:",
        job.attemptsMade + 1,
        "| Reason:",
        err.message
      );

      await db.query(
        "UPDATE leads SET status = ?, retry_count = retry_count + 1 WHERE id = ?",
        ["RETRYING", leadId]
      );

      throw err;   //IMPORTANT: triggers BullMQ retry
    }
  },

  {
    connection: redis
  }
);

console.log("Lead Worker Running with Retry Support");
