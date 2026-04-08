import roleSchema from '../entities/roles.js';
import { AppDataSource } from '../util/database.js';

export const employeeRepository = AppDataSource.getRepository('employees').extend({
    async findEmployeeRole() {
        return await this.find()
    }
});


// // role.repository.js
// const { AppDataSource } = require("./data-source");
// const { Role } = require("./entity/Role");

// // Create the custom repository by extending the base one
// export const roleRepository = AppDataSource.getRepository(Role).extend({
//     async findOneRoleById(id) {
//         // Use 'this' to access built-in repository methods
//         return await this.findOneBy({ id: parseInt(id) });
//     },
// });


export const roleRepository = AppDataSource.getRepository(roleSchema).extend({
    async findAllRoles() {
        return await this.find();
    },

    async findOneRoleById(id) {
        return await this.findOneBy({ id: parseInt(id) })
    },

    async createRole(role , salary , department_id) {
        return await this.insert({
            role, salary, department_id
        })
    },

    async saveRole(){
        return await this.save()
    },

    async findEmployeeRoleById() {
        return await this.employeeRepository.find({
            where: { role_id: role_id }
        })
    },

    async deleteRole() {
        return await this.delete()
    },

});
