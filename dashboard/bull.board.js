import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { otpQueue, leadQueue } from "../utils/queue.js";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [
    new BullMQAdapter(otpQueue),
    new BullMQAdapter(leadQueue)
  ],
  serverAdapter
});

export default serverAdapter;
