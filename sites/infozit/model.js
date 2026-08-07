import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const InfozitLead = sequelize.define(
  "InfozitLead",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    source: { type: DataTypes.STRING(255), allowNull: true },
    name: { type: DataTypes.STRING(255), allowNull: true },
    email: { type: DataTypes.STRING(255), allowNull: true, unique: true },
    contact: { type: DataTypes.STRING(255), allowNull: true },
    city: { type: DataTypes.STRING(255), allowNull: true },
    service: { type: DataTypes.STRING(255), allowNull: true },
    occupation: { type: DataTypes.STRING(255), allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: true },

    status: {
      type: DataTypes.ENUM("PENDING_CRM", "RETRYING", "SENT_TO_CRM", "FAILED"),
      defaultValue: "PENDING_CRM",
    },

    retry_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: "infozit_website_leads",
    timestamps: true,
  }
);

export default InfozitLead;
