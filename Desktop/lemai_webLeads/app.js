import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimiter from "./middlewares/rateLimiter.js";
import routes from "./routes/index.js";
import cors from "cors";
import bullBoard from "./dashboard/bull.board.js";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));
app.use(rateLimiter);
app.use(cors({
  origin: [
    "http://127.0.0.1:5500",   
    "https://lemai.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Single source of truth for API base
app.use("/api/v1", routes);
app.use("/admin/queues", bullBoard.getRouter());

app.get("/", (req, res) => res.send("Lead System Running"));

export default app;
