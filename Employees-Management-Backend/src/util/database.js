import("reflect-metadata");
import { DataSource } from "typeorm";
import departmentSchema from "../entities/department.js";
import employeesSchema from "../entities/employees.js";
import roleSchema from "../entities/roles.js";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "vivek@123456",
    database: "employees_data",
    synchronize: true, // Auto-creates tables (disable in production)
    logging: false,
    entities: [departmentSchema, employeesSchema, roleSchema]
});

 