import redis from "../utils/redis.js";
import { otpQueue } from "../utils/queue.js";

export const generateOtp = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redis.set(`otp:${email}`, otp, "EX", 300);

  await otpQueue.add("send-otp", { email, otp });

  return otp;
};

export const verifyOtp = async (email, otp) => {
  const stored = await redis.get(`otp:${email}`);
  if (!stored || stored !== otp) return false;

  await redis.del(`otp:${email}`);
  return true;
};
