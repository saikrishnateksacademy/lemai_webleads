import express from "express";
import helmet from "helmet";
import morgan from "morgan";
//import rateLimiter from "./middlewares/rateLimiter.js";
import routes from "./routes/index.js";
import cors from "cors";
import bullBoard from "./dashboard/bull.board.js";

const app = express();

app.use(express.json());
// Review#1: Is Helmet Configured Properly?
app.use(helmet());
app.use(morgan("dev"));
//app.use(rateLimiter);
app.use(cors({
  origin: [
    "http://127.0.0.1:5500",   
    "https://lemai.com"
  ],
  methods: ["GET", "POST"],
  // Review#1: Why are we using crendetials true?
  credentials: true
}));

// Single source of truth for API base
app.use("/api/v1", routes);
// Review#1: Add Basic Auth to Bull Board
app.use("/admin/queues", bullBoard.getRouter());
// Review#1: Replace this route to provide better info on system status
app.get("/", (req, res) => res.send("Lead System Running"));

export default app;
