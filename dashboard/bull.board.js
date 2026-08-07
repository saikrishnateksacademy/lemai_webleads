import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter }   from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter }  from "@bull-board/express";
import { otpQueue, siteLeadQueue } from "../utils/queue.js";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [
    new BullMQAdapter(otpQueue),        // OTP email dispatch
    new BullMQAdapter(siteLeadQueue),   // All sites CRM sync
  ],
  serverAdapter,
});

export default serverAdapter;
