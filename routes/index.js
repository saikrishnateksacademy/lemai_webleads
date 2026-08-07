import { Router } from "express";
import otpRoutes  from "./otp.routes.js";
import siteRoutes from "./site.routes.js";

const router = Router();

// OTP email verification
router.use("/otp", otpRoutes);

// Universal site lead endpoint: POST /api/v1/sites/:siteKey/leads
router.use("/sites", siteRoutes);

export default router;
