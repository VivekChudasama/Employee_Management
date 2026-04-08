import roleSchema from '../entities/roles.js';
import { AppDataSource } from '../util/database.js';

const employeeRepository = AppDataSource.getRepository('employees').extend({
    async findEmployeeRole() {
        return await this.find()
    }
});

const roleRepository = AppDataSource.getRepository(roleSchema).extend({
    async findAllRoles() {
        return await this.find();
    },

    async findOneRoleById(id) {
        return await this.findOneBy({ id: parseInt(id) })
    },

    async createRole() {
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

export default {
    roleRepository , 
    employeeRepository
};
