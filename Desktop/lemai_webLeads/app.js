import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimiter from "./middlewares/rateLimiter.js";
import otpRoutes from "./routes/otp.routes.js";
import leadRoutes from "./routes/lead.routes.js";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("tiny"));
app.use(rateLimiter);

app.use("/api/v1/otp", otpRoutes);
app.use("/api/v1/leads", leadRoutes);

app.get("/", (req, res) => res.send("Lead System Running"));

export default app;
