// import rateLimit from "express-rate-limit";

// export default rateLimit({
//   windowMs: 60 * 1000,
//   max: 60,
//   // Review#1: Better messaging for rate limiting
//   message: "Too many requests"
// });


const rateLimitMap = new Map(); //stores in server memory

export default function rateLimiter(req, res, next) {
  const ip = req.ip;  //client ip address
  const now = Date.now();

  const WINDOW_MS = 60 * 1000; // 1 minute
  const MAX_REQUESTS = 60;


  //create new entry for ip
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, startTime: now });
    return next();
  }

  const data = rateLimitMap.get(ip);
  
  if (now - data.startTime < WINDOW_MS) {
    if (data.count >= MAX_REQUESTS) {
      return res.status(429).json({
        message: "Too many requests. Please try again later."
      });
    }
    data.count++;
  } else {
    // Reset window
    rateLimitMap.set(ip, { count: 1, startTime: now });
  }

  next();
}
