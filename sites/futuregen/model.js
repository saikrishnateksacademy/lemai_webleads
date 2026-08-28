import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const FutureGenLead = sequelize.define(
  "FutureGenLead",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    source: { type: DataTypes.STRING(255), allowNull: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    phone: { type: DataTypes.STRING(50), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: true },
    course: { type: DataTypes.STRING(255), allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: true },
    page_path: { type: DataTypes.STRING(500), allowNull: true },
    referrer: { type: DataTypes.STRING(500), allowNull: true },
    discount: { type: DataTypes.STRING(255), allowNull: true },
    form_source: { type: DataTypes.STRING(255), allowNull: true },

    status: {
      type: DataTypes.ENUM("PENDING_CRM", "RETRYING", "SENT_TO_CRM", "FAILED"),
      defaultValue: "PENDING_CRM",
    },

    retry_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: "futuregen_website_leads",
    timestamps: true,
  }
);

export default FutureGenLead;
