// import "./config/env.js";
// import app from "./app.js";
// import "./utils/queue.js";
// import { initDB } from "./models/index.js";
// import './models/lead.model.js';


// // Review#1: Run App in HTTP Environment
// // Review#1: Use HTTP Native events to handle Promise Rejections and Unhandled Exceptions
// const PORT = process.env.PORT || 5000;

// (async () => {
//     try {
//         // Initialize DB (authenticate + create tables)
//         await initDB();
//         console.log("MySQL initialized");

//         // Start Server
//         app.listen(PORT, () => console.log("Server running on", PORT));

//     } catch (err) {
//         console.error("❌ Database connection failed");
//         console.error(err.message);
//         process.exit(1); // Stop app if DB is dead
//     }
// })();


import http from "http";
import app, { initApp } from "./app.js";

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

(async () => {
  await initApp();

  server.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
  });
})();

