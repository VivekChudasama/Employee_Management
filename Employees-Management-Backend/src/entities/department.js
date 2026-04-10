import { EntitySchema } from "typeorm";
import { Tables } from "../config/tables.js";

const departmentSchema = new EntitySchema({
    name: Tables.DEPARTMENT,
    columns: {
        id: {
            type: "int",
            generated: true,
            primary: true
        },
        departmentName: {
            type: "varchar",
            name: "department_name"
        }
    },
    relations: {
        roles: {
            type: "one-to-many",
            target: "roles",
            inverseSide: "department",
            cascade : true,
            onDelete: 'CASCADE'
        }
    }
});
export default departmentSchema;