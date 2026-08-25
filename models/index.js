import sequelize from "../config/database.js";
import Source from "./source.model.js";

// Site Plugin Models 
import LemaiLead from "../sites/lemai/model.js";
import InfozitLead from "../sites/infozit/model.js";
import FutureGenLead from "../sites/futuregen/model.js";

async function initDB() {
  try {
    await sequelize.authenticate();
    console.log("MySQL Connected via Sequelize");

    // Syncs all defined models — creates tables if they don't exist
    await sequelize.sync();
    console.log("✅ DB sync complete");

  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  }
}

export { sequelize, Source, LemaiLead, InfozitLead, FutureGenLead, initDB };
