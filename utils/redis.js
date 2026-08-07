import Redis from "ioredis";

let redis;

// If REDIS_URL exists → always use it
if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false
  });

} else {
  // Fallback only if URL not provided
  redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
    enableReadyCheck: false
  });
}

redis.on("connect", () => console.log("Connected to Redis"));
redis.on("error", (err) => console.error("Redis Error", err));

export default redis;
