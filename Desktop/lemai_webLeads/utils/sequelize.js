import { Sequelize } from "sequelize";

const connectionString = process.env.DATABASE_URL;

const sequelize = connectionString
  ? new Sequelize(connectionString, { dialect: "mysql", logging: false })
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
      host: process.env.DB_HOST || "localhost",
      dialect: "mysql",
      logging: false
    });

export default sequelize;
