import sequelize from "../config/database.js";
import Lead from "./lead.model.js";

async function initDB() {
  try {
    await sequelize.authenticate();
    console.log("MySQL Connected via Sequelize");

  } catch (err) {
    console.error("DB connection failed", err);
    process.exit(1);
  }
}

export { sequelize, Lead, initDB };
