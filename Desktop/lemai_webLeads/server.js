import "./config/env.js";
import app from "./app.js";
import "./utils/queue.js";
import { initDB } from "./models/index.js";
import './models/lead.model.js';

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        // Initialize DB (authenticate + create tables)
        await initDB();
        console.log("MySQL initialized via models/index.js");

        // Start Server
        app.listen(PORT, () => console.log("Server running on", PORT));

    } catch (err) {
        console.error("❌ Database connection failed");
        console.error(err.message);
        process.exit(1); // Stop app if DB is dead
    }
})();

