import { saveAndQueueInfozitLead } from "../services/infozitLead.service.js";

export const submitInfozitLead = async (req, res) => {
  try {
    const leadId = await saveAndQueueInfozitLead(req.body);

    return res.status(200).json({
      success: true,
      message: "Infozit lead received. CRM sync in background.",
      leadId
    });

  } catch (err) {
    console.error("Infozit lead submit failed:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to submit Infozit lead"
    });
  }
};
