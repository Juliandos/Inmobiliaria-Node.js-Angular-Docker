/// <reference types="node" />
import { Sequelize } from "sequelize";
import { initModels } from "../models/init-models.js";

const sequelize = new Sequelize(
  process.env.DB_NAME || "db_inmobiliaria",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql"
  }
);

const models = initModels(sequelize);

export { sequelize, models };
