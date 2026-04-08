import roleSchema from '../entities/roles.js';
import employeeSchema from '../entities/employees.js';
import { AppDataSource } from '../util/database.js';

export const employeeRepository = AppDataSource.getRepository(employeeSchema).extend({
    async findEmployeeRole() {
        return await this.find()
    }
});

export const roleRepository = AppDataSource.getRepository(roleSchema).extend({
    async findAllRoles() {
        return await this.find();
    },

    async findRolesById(id) {
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
