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
    }
});

export default roleSchema;