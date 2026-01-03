import redis from "./redis.js";

const OTP_PREFIX = "otp:";
const OTP_COOLDOWN_PREFIX = "otp:cooldown:";

export const saveOtp = async (email, code) => {
  const payload = JSON.stringify({
    code,
    attempts: 0,
    verified: false
  });

  // OTP valid for 5 minutes
  await redis.setex(`${OTP_PREFIX}${email}`, 300, payload);

  // Cooldown: 30 seconds before resend allowed
  await redis.setex(`${OTP_COOLDOWN_PREFIX}${email}`, 30, "1");
};

export const getOtp = async (email) => {
  const data = await redis.get(`${OTP_PREFIX}${email}`);
  return data ? JSON.parse(data) : null;
};

export const updateOtp = async (email, payload) => {
  await redis.setex(`${OTP_PREFIX}${email}`, 300, JSON.stringify(payload));
};

export const deleteOtp = async (email) => {
  await redis.del(`${OTP_PREFIX}${email}`);
  await redis.del(`${OTP_COOLDOWN_PREFIX}${email}`);
};

// NEW: check cooldown
export const isOtpInCooldown = async (email) => {
  const cooldown = await redis.get(`${OTP_COOLDOWN_PREFIX}${email}`);
  return Boolean(cooldown);
};
