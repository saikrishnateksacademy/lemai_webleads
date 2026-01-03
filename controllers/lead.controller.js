import { saveAndQueueLead } from "../services/lead.service.js";

export const submitLead = async (req, res) => {
  try {
    const leadId = await saveAndQueueLead(req.body);

    return res.status(200).json({
      success: true,
      message: "Lead received. CRM sync in background.",
      leadId
    });

  } catch (err) {
    console.error("Lead submit failed:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to submit lead"
    });
  }
};
