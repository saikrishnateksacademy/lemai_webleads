import { Router } from "express";
import otpRoutes from "./otp.routes.js";
import leadRoutes from "./lead.routes.js";

const router = Router();

// Versioning stays here. Centralized, clean, scalable.
router.use("/otp", otpRoutes);
router.use("/leads", leadRoutes);

export default router;
