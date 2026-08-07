import express from "express";
import { submitSiteLead } from "../controllers/site.controller.js";
import { isRegisteredSite } from "../registry.js";

const router = express.Router();

// Lightweight middleware: reject unknown siteKeys before hitting the controller. Returns a clean 404 immediately without touching the DB or queue.

const guardSite = (req, res, next) => {
  const { siteKey } = req.params;
  if (!isRegisteredSite(siteKey)) {
    return res.status(404).json({
      success: false,
      message: `No registered site found for key: '${siteKey}'`,
    });
  }
  next();
};

router.post("/:siteKey/leads", guardSite, submitSiteLead);

export default router;
