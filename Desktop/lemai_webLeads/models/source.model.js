import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Source = sequelize.define(
  "Source",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },

    label: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: "sources",
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

export default Source;
