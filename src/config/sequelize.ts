import { Sequelize } from "sequelize-typescript";

const match = (process.env.JAWSDB_URL as string).match(
  /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/
);

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: match ? match[3] : "localhost",
  port: match ? parseInt(match[4], 10) : 3306,
  username: match ? match[1] : "root",
  password: match ? match[2] : "",
  database: match ? match[5] : "database_name",
  models: [__dirname + "/../models"],
});
