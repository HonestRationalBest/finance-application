import { Sequelize } from "sequelize-typescript";

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: "sql11.freesqldatabase.com",
  port: 3306,
  username: "sql11662378",
  password: process.env.DB_PASSWORD,
  database: "sql11662378",
  models: [__dirname + "/../models"],
});
