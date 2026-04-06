import { EntitySchema } from "typeorm";

const departmentSchema = new EntitySchema({
    name: "department",
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
            inverseSide: "department"
        }
    }
});
export default departmentSchema;