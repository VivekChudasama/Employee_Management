import { EntitySchema } from "typeorm";
import roles from "./roles.js";

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
        },
        // relationship: {
        //     roles :{
        //         type:"one-to-many",
        //         target: roles,
        //         inverseSide: "department"
        //     }
        // }
    }
});
export default departmentSchema;