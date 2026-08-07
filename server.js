import http from "http";
import app, { initApp } from "./app.js";
import { startOtpWorker }         from "./workers/otp.worker.js";
import { startUnifiedLeadWorker } from "./core/worker.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Graceful Shutdown 
const shutdown = (signal) => {
  console.log(`\n[Server] ${signal} received — shutting down gracefully`);
  server.close(() => {
    console.log("[Server] HTTP server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT",  () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  console.error("[Server] Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("[Server] Uncaught Exception:", err.message);
  process.exit(1);
});

// Bootstrap 
(async () => {
  await initApp();

  startOtpWorker();           // sends OTP emails
  startUnifiedLeadWorker();   // CRM sync — handles all registered sites

  server.listen(PORT, () => {
    console.log(`✅ Server running  → http://localhost:${PORT}`);
    console.log(`📋 Bull Board      → http://localhost:${PORT}/admin/queues`);
  });
})();
