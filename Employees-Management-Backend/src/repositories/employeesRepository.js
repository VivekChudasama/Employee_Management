import { AppDataSource } from '../util/database.js';

import employeeSchema from '../entities/employees.js';
import departmentSchema from '../entities/department.js';

export const departmentRepository = AppDataSource.getRepository(departmentSchema).extend({
    async findDepartments() {
        return await this.find()
    }
})

export const employeeRepository = AppDataSource.getRepository(employeeSchema).extend({
    async findEmployees() {
        return await this.find()
    },

    async findOneEmployeeById(id) {
        return await this.findOne({ where: { id }, relations: ["role"] })
    },

    async findEmployeeWithEmployeeId(employeeId) {
        return await this.findOne({ where: { id: employeeId }, relations: ["role"] })
    },

    async saveEmployee() {
        return await this.save()
    },

    async removeEmployeeById() {
        return await this.remove()
    }
})
