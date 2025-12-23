import * as otpService from "../services/otp.service.js";

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email required" });

  await otpService.generateOtp(email);
  res.json({ message: "OTP Sent" });
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(400).json({ message: "Email & OTP required" });

  const valid = await otpService.verifyOtp(email, otp);

  if (!valid) return res.status(400).json({ message: "Invalid OTP" });

  res.json({ message: "OTP Verified" });
};
