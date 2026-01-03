// import express from "express";
// import helmet from "helmet";
// import morgan from "morgan";
// // import rateLimiter from "./middlewares/rateLimiter.js";
// import rateLimiter from "./middlewares/rateLimiter.js";
// import routes from "./routes/index.js";
// import cors from "cors";
// import bullBoard from "./dashboard/bull.board.js";

// const app = express();

// app.use(express.json());
// // Review#1: Is Helmet Configured Properly?
// app.use(helmet());
// app.use(morgan("dev"));
// // app.use(rateLimiter);

// app.use(rateLimiter);
// app.use(cors({
//   origin: [
//     "http://127.0.0.1:5500",   
//     "https://lemai.com"
//   ],
//   methods: ["GET", "POST"],
//   // Review#1: Why are we using crendetials true?
//   credentials: true
// }));

// // Single source of truth for API base
// app.use("/api/v1", routes);
// // Review#1: Add Basic Auth to Bull Board
// app.use("/admin/queues", bullBoard.getRouter());
// // Review#1: Replace this route to provide better info on system status
// app.get("/", (req, res) => res.send("Lead System Running"));

// export default app;


import "./config/env.js";          // env FIRST
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import rateLimiter from "./middlewares/rateLimiter.js";
import routes from "./routes/index.js";
import bullBoard from "./dashboard/bull.board.js";

import "./utils/queue.js";
import { initDB } from "./models/index.js";
import "./models/lead.model.js";

const app = express();

/* -------------------- Core Middlewares -------------------- */
app.set("trust proxy", true); // IMPORTANT for rate limiter & IPs
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

/* -------------------- Security -------------------- */
app.use(rateLimiter);

app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "https://lemai.com"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

/* -------------------- Routes -------------------- */
app.use("/api/v1", routes);
app.use("/admin/queues", bullBoard.getRouter());

app.get("/", (req, res) => {
  res.send("Lead System Running");
});

/* -------------------- Init Dependencies -------------------- */
export const initApp = async () => {
  try {
    await initDB();
    console.log("✅ MySQL initialized");
  } catch (err) {
    console.error("❌ Database connection failed");
    console.error(err.message);
    process.exit(1);
  }
};

export default app;
