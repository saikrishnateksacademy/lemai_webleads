import Redis from "ioredis";

const useTls = String(process.env.REDIS_TLS).toLowerCase() === "true";

let redis;
if (process.env.REDIS_URL) {
//   console.log("Connecting to Redis using REDIS_URL");
  redis = new Redis(process.env.REDIS_URL);
} else {
  const opts = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
  };
  if (process.env.REDIS_PASSWORD) opts.password = process.env.REDIS_PASSWORD;
  if (useTls) opts.tls = { rejectUnauthorized: false };

//   console.log("Connecting to Redis with host:", opts.host, "port:", opts.port, "tls:", useTls);
  redis = new Redis(opts);
}

redis.on("connect", () => console.log("Connected to Redis"));
redis.on("error", (err) => console.error("Redis Error", err));

export default redis;
