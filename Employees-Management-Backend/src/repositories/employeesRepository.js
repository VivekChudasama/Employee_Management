import { AppDataSource } from '../util/database.js';

import employeeSchema from '../entities/employees.js';

// Employee repository with custom methods for for fetching employee data
export const employeeRepository = AppDataSource.getRepository(employeeSchema).extend({
    async findEmployees() {
        return await this.find()
    },

    async countEmployeesByRoleId(roleId) {
        return await this.count({ where: { role_id: parseInt(roleId) } })
    },

    async findOneEmployeeById(id) {
        return await this.findOne({ where: { id: parseInt(id) }, relations: ["role", "role.department"] })
    },

    async saveEmployee(employeeData) {
        return await this.save(employeeData)
    },

    async removeEmployeeById(employee) {
        return await this.remove(employee)
    }
})
