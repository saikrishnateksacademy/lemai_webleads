import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const NewSiteModel = sequelize.define(
  "NewSiteModel",   // ← rename to match your site
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    // ─── Add your site's own columns ─────────────────────────
    name: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    phone: { type: DataTypes.STRING(30), allowNull: true },


    // Add as many fields as you need — this table is yours alone

    status: {
      type: DataTypes.ENUM("PENDING_CRM", "RETRYING", "SENT_TO_CRM", "FAILED"),
      defaultValue: "PENDING_CRM",
    },
    retry_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: "new_site_leads",   // ← rename to your table name
    timestamps: true,
  }
);

export default NewSiteModel;
