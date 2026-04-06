import { EntitySchema } from "typeorm";

const roleSchema = new EntitySchema({
    name: "roles",
    columns: {
        id: {
            type: "int",
            generated: true,
            primary: true
        },
        role: {
            type: "varchar",
            name: "role"
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
            joinColumn: { name: "department_id" }
        },
        employees: {
            type: "one-to-many",
            target: "employees",
            inverseSide: "role"
        }
    }
});

export default roleSchema;