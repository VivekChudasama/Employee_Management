import { AppDataSource } from '../util/database.js';

import employeeSchema from '../entities/employees.js';
import departmentSchema from '../entities/department.js';

// Department repository with custom methods for fetching department data
export const departmentRepository = AppDataSource.getRepository(departmentSchema).extend({
    async findDepartments() {
        return await this.find()
    }
})

// Employee repository with custom methods for for fetching employee data
export const employeeRepository = AppDataSource.getRepository(employeeSchema).extend({
    async findEmployees() {
        return await this.find()
    },

    async findOneEmployeeById(id) {
        return await this.findOne({ where: { id: parseInt(id) }, relations: ["role", "role.department"] })
    },

    async findEmployeeWithEmployeeId(employeeId) {
        return await this.findOne({ where: { id: parseInt(employeeId) }, relations: ["role", "role.department"] })
    },

    async saveEmployee(employeeData) {
        return await this.save(employeeData)
    },

    async removeEmployeeById(employee) {
        return await this.remove(employee)
    }
})
