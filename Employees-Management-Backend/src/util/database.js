import("reflect-metadata");
import { DataSource } from "typeorm";
import departmentSchema from "../entities/department.js";
import employeesSchema from "../entities/employees.js";
import roleSchema from "../entities/roles.js";
import dotenv from "dotenv";

dotenv.config({path: './src/.env'});

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // Auto-creates tables (disable in production)
    logging: false,
    entities: [departmentSchema, employeesSchema, roleSchema]
});
  