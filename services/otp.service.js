import crypto from "crypto";
import {
  saveOtp,
  getOtp,
  updateOtp,
  isOtpInCooldown
} from "../utils/otpStore.js";
import { otpQueue } from "../utils/queue.js";


// Review#1: Need to implement OTP Generation / Verification Login without storing the OTP in any persistant Storage or MemChad
export const sendOtpService = async (email) => {
  // Cooldown check FIRST
  const inCooldown = await isOtpInCooldown(email);
  if (inCooldown) {
    throw new Error("Please wait 30 seconds before requesting another OTP.");
  }

  const existing = await getOtp(email);
  // Review#1: Replace the OTP Generation Logic to 

  const code = crypto.randomInt(100000, 999999).toString();

  await saveOtp(email, code);

  await otpQueue.add("send-otp", { email, code });

  return true;
};

export const verifyOtpService = async (email, otp) => {
  const data = await getOtp(email);

  if (!data) throw new Error("OTP expired or not requested");

  if (data.attempts >= 5) {
    throw new Error("Too many attempts. Please request a new OTP.");
  }

  if (data.code !== otp) {
    data.attempts += 1;
    await updateOtp(email, data);
    throw new Error("Invalid OTP");
  }

  data.verified = true;
  await updateOtp(email, data);

  return true;
};
