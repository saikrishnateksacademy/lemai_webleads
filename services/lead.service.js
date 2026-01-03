import { Lead } from "../models/index.js";
import { leadQueue } from "../utils/queue.js";
import { getOtp, deleteOtp } from "../utils/otpStore.js";

const salesMap = {
    "0-5": "SIZE_0_5",
    "5-10": "SIZE_5_10",
    "10-25": "SIZE_10_25",
    "25-50": "SIZE_25_50",
    "50-100": "SIZE_50_100",
    "Above 100": "ABOVE_100",
};

const heardMap = {
    "Google Search": "GOOGLE_SEARCH",
    "FaceBook & Instagram": "FB_INSTAGRAM",
    "Social Media": "SOCIAL_MEDIA",
    "Reference": "REFERENCE",
    "Influencer": "INFLUENCER",
    "Others": "OTHERS",
};

export const saveAndQueueLead = async (data) => {
    const otp = await getOtp(data.email);

    if (!otp || !otp.verified) {
        throw new Error("Email not verified. Please verify OTP before submitting lead.");
    }

    // basic sanity guard for numbers
    if (!/^\+\d+$/.test(data.country_code)) throw new Error("Invalid country code");
    if (!/^\d{6,15}$/.test(data.phone_number)) throw new Error("Invalid phone number");

    const full = `${data.country_code}${data.phone_number}`;
    const heard = data.heard_from?.toLowerCase();

    const existingLead = await Lead.findOne({ where: { email: data.email } });

    let lead;

    if (existingLead) {
        await existingLead.update({
            name: data.name,
            country_code: data.country_code,
            phone_number: data.phone_number,
            full_phone: full,

            company_name: data.company_name || null,
            city: data.city || null,

            sales_team_size: salesMap[data.sales_team_size] || null,
            heard_from: heardMap[data.heard_from] || null,
            heard_from_text: heard === "others" ? data.heard_from_text : null,

            status: "PENDING_CRM",
            retry_count: 0
        });

        lead = existingLead;
        console.log("Lead updated instead of created");
    } else {
        lead = await Lead.create({
            name: data.name,
            email: data.email,

            country_code: data.country_code,
            phone_number: data.phone_number,
            full_phone: full,

            company_name: data.company_name || null,
            city: data.city || null,

            sales_team_size: salesMap[data.sales_team_size] || null,
            heard_from: heardMap[data.heard_from] || null,
            heard_from_text: heard === "others" ? data.heard_from_text : null,

            status: "PENDING_CRM",
            retry_count: 0
        });

        console.log("New lead created");
    }

    // deleting otp after successful lead submission
    await deleteOtp(data.email);

    await leadQueue.add(
        "crm-sync",
        { leadId: lead.id },
        {
            attempts: 8, 
            backoff: {
                type: "exponential",
                delay: 10000 // 10s → 20s → 40s → 80s ...
            },
            removeOnComplete: true,
            removeOnFail: false, // keep failed leads visible
            timeout: 60000 // 60s
        }
    );

    return lead.id;
};
