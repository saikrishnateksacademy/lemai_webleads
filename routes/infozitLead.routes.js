import express from "express";
import { submitInfozitLead } from "../controllers/infozitLead.controller.js";
import { validateInfozitLeadRequest } from "../middlewares/ajvValidate.js";

const router = express.Router();

router.post(
  "/submit",
  validateInfozitLeadRequest,
  submitInfozitLead
);

export default router;
