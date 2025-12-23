import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Lead = sequelize.define(
    "Lead",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },

        country_code: { type: DataTypes.STRING(10), allowNull: false },
        phone_number: { type: DataTypes.STRING(20), allowNull: false },
        full_phone: { type: DataTypes.STRING(30), allowNull: false },

        company_name: { type: DataTypes.STRING, allowNull: true },
        city: { type: DataTypes.STRING, allowNull: true },

        sales_team_size: {
            type: DataTypes.ENUM(
                "SIZE_0_5",
                "SIZE_5_10",
                "SIZE_10_25",
                "SIZE_25_50",
                "SIZE_50_100",
                "ABOVE_100"
            ),
            allowNull: true,
        },

        heard_from: {
            type: DataTypes.ENUM(
                "GOOGLE_SEARCH",
                "FB_INSTAGRAM",
                "SOCIAL_MEDIA",
                "REFERENCE",
                "INFLUENCER",
                "OTHERS"
            ),
            allowNull: true,
        },

        heard_from_text: { type: DataTypes.STRING, allowNull: true },

        status: {
            type: DataTypes.ENUM(
                "PENDING_CRM",
                "RETRYING",
                "SENT_TO_CRM",
                "FAILED"
            ),
            defaultValue: "PENDING_CRM",
        },

        retry_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
        tableName: "leads",
        timestamps: true,
        underscored: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

export default Lead;
