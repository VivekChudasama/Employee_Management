import { EntitySchema } from "typeorm";
import { Tables } from "../config/tables.js";

const roleSchema = new EntitySchema({
    name: Tables.ROLES,
    columns: {
        id: {
            type: "int",
            generated: true,
            primary: true
        },
        role: {
            type: "varchar",
            name: "role",
            unique: true
        },
        salary: {
            type: "int",
            name: "salary"
        },
        department_id: {
            type: "int",
            name: "department_id"
        }
    },
    relations: {
        department: {
            type: "many-to-one",
            target: "department",
            inverseSide: "roles",
            joinColumn: { name: "department_id" },
            onDelete: "RESTRICT"
        },
        employees: {
            type: "one-to-many",
            target: "employees",
            inverseSide: "role",

        }
    }
});

export default roleSchema;