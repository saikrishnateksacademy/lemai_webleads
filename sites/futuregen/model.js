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
    course_slug: { type: DataTypes.STRING(255), allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: true },
    page_path: { type: DataTypes.STRING(500), allowNull: true },
    page_title: { type: DataTypes.STRING(255), allowNull: true },
    meta: { type: DataTypes.JSON, allowNull: true },
    client_timestamp: { type: DataTypes.STRING(100), allowNull: true },
    referrer: { type: DataTypes.STRING(500), allowNull: true },
    utm_source: { type: DataTypes.STRING(255), allowNull: true },
    utm_medium: { type: DataTypes.STRING(255), allowNull: true },
    utm_campaign: { type: DataTypes.STRING(255), allowNull: true },
    utm_term: { type: DataTypes.STRING(255), allowNull: true },
    utm_content: { type: DataTypes.STRING(255), allowNull: true },
    device_type: { type: DataTypes.STRING(100), allowNull: true },
    user_agent: { type: DataTypes.TEXT, allowNull: true },

    // Direct CRM specific fields
    owner: { type: DataTypes.INTEGER, allowNull: true },
    category: { type: DataTypes.INTEGER, allowNull: true },
    product: { type: DataTypes.INTEGER, allowNull: true },
    volume: { type: DataTypes.INTEGER, allowNull: true },
    highest_qualification: { type: DataTypes.STRING(255), allowNull: true },
    current_status: { type: DataTypes.STRING(255), allowNull: true },
    campaign: { type: DataTypes.STRING(255), allowNull: true },
    when_to_start: { type: DataTypes.STRING(255), allowNull: true },

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
