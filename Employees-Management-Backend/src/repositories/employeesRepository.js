import { AppDataSource } from '../util/database.js';

import employeeSchema from '../entities/employees.js';

// Employee repository with custom methods for for fetching employee data
export const employeeRepository = AppDataSource.getRepository(employeeSchema).extend({
    // Get all employees details
    async findEmployees() {
        return await this.find()
    },

    //count employees based on role id for checking if any employee is assigned to the role which we want to delete
    async countEmployeesByRoleId(roleId) {
        return await this.count({ where: { role_id: roleId } })
    },

    // Find employee by ID with role relation
    async findOneEmployeeById(id) {
        return await this.findOne({ where: { id: id }, relations: ["role", "role.department"] })
    },

    // Method to find employee by email for checking email uniqueness
    async findEmployeeByEmail(email) {
        return await this.findOne({ where: { email: email }, relations: ["role", "role.department"] })
    },

    //save employee details in database
    async saveEmployee(employeeData) {
        return await this.save(employeeData)
    },

    async updateEmployee(employeeId, updateData) {
        return await this.update(employeeId, updateData)
    },

    //delete employee by id
    async removeEmployeeById(employeeId) {
        return await this.remove(employeeId)
    }
})
