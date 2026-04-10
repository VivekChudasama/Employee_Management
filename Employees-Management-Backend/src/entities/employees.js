import { EntitySchema } from "typeorm";
import { Tables } from "../config/tables.js";

const employeesSchema = new EntitySchema({
    name: Tables.EMPLOYEES,
    columns: {
        id: {
            type: "int",
            generated: true,
            primary: true
        },
        name: {
            type: "varchar",
            name: "name"
        },
        email: {
            type: "varchar",
            name: "email"
        },
        role_id: {
            type: "int",
            name: "role_id"
        },
        status: {
            type: "enum",
            enum: ["active", "inactive"],
            name: "status"
        },

        joining_date: {
            type: Date,
            name: "joining_date"
        }
    },
    relations: {
        role: {
            type: "many-to-one",
            target: "roles",
            inverseSide: "employees",
            joinColumn: { name: "role_id" },
            onDelete: "CASCADE"
        }
    }
});

export default employeesSchema;
