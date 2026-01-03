import { sendOtpService, verifyOtpService } from "../services/otp.service.js";

export const sendOtp = async (req, res) => {
  try {
    await sendOtpService(req.body.email);

    res.json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    await verifyOtpService(req.body.email, req.body.otp);

    res.json({
      success: true,
      message: "OTP verified"
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
