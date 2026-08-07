import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const InfozitWebsiteLead = sequelize.define(
  'InfozitWebsiteLead',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    source: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    contact: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    service: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    occupation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'infozit_website_leads',
    timestamps: true, // handles createdAt and updatedAt
  }
);

export default InfozitWebsiteLead;