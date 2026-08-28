import sequelize from "../config/database.js";

async function migrateFutureGenTable() {
  try {
    await sequelize.authenticate();
    console.log("Connected to MySQL database.");

    // Fetch existing columns
    const [columns] = await sequelize.query("DESCRIBE futuregen_website_leads;");
    const colNames = columns.map((c) => c.Field);

    const alterations = [];

    // Add missing columns if not present
    if (!colNames.includes("discount")) {
      alterations.push("ADD COLUMN discount VARCHAR(255) NULL AFTER referrer");
    }
    if (!colNames.includes("form_source")) {
      alterations.push("ADD COLUMN form_source VARCHAR(255) NULL AFTER discount");
    }

    // Drop legacy columns if present
    const columnsToDrop = [
      "course_slug",
      "page_title",
      "meta",
      "client_timestamp",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "device_type",
      "user_agent",
      "owner",
      "category",
      "product",
      "volume",
      "highest_qualification",
      "current_status",
      "campaign",
      "when_to_start",
    ];

    for (const col of columnsToDrop) {
      if (colNames.includes(col)) {
        alterations.push(`DROP COLUMN \`${col}\``);
      }
    }

    if (alterations.length === 0) {
      console.log("No table alterations needed. Schema is already up to date.");
    } else {
      const sql = `ALTER TABLE futuregen_website_leads ${alterations.join(", ")};`;
      console.log("Executing SQL migration:");
      console.log(sql);

      await sequelize.query(sql);
      console.log("✅ Table futuregen_website_leads altered successfully!");
    }

    // Verify resulting table structure
    const [finalCols] = await sequelize.query("DESCRIBE futuregen_website_leads;");
    console.log("\nUpdated Table Schema:");
    console.table(finalCols.map((r) => ({ Field: r.Field, Type: r.Type, Null: r.Null })));

    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  }
}

migrateFutureGenTable();
