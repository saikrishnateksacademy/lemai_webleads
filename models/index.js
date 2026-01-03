import sequelize from "../config/database.js";
import Lead from "./lead.model.js";

async function initDB() {
  try {
    // 1️⃣ Test DB connection
    await sequelize.authenticate();
    console.log("MySQL Connected via Sequelize");

    // 2️ Drop & recreate all tables
    await sequelize.sync();
    console.log("sync done");

  } catch (err) {
    console.error(" DB connection failed");
    console.error(err.message);
    process.exit(1);
  }
}

export { sequelize, Lead, initDB };
