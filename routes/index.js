import { Router } from "express";
import otpRoutes from "./otp.routes.js";
import leadRoutes from "./lead.routes.js";
import infozitLeadRoutes from "./infozitLead.routes.js";

const router = Router();

// Versioning stays here. Centralized, clean, scalable.
router.use("/otp", otpRoutes);
router.use("/leads", leadRoutes);
router.use("/infozit-leads", infozitLeadRoutes);

export default router;
