import express from "express";
import { submitLead } from "../controllers/lead.controller.js";
import { validateLeadRequest } from "../middlewares/ajvValidate.js";

const router = express.Router();

router.post(
    "/submit",
    validateLeadRequest,
    submitLead
);

export default router;
