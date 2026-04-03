import { EntitySchema } from "typeorm";
import roles from './roles.js';

const employeesSchema = new EntitySchema({
    name: "employees",
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
    },
    // relationsip: {
    //     role : {
    //         type: "many-to-one",
    //         target: roles,
    //         inverseSide: "employees",
    //         joinColumn: { name: "Role_id" }
    //     }
    // }
}
});

export default employeesSchema;
