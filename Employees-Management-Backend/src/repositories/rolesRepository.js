import roleSchema from '../entities/roles.js';
import employeeSchema from '../entities/employees.js';
import { AppDataSource } from '../util/database.js';

// Employee repository with custom methods for for fetching employee data for role deletion
export const employeeRepository = AppDataSource.getRepository(employeeSchema).extend({
    async findEmployeeRole(roleId) {
        return await this.find(roleId)
    }
});

//// Role repository with custom methods for for fetching role data
export const roleRepository = AppDataSource.getRepository(roleSchema).extend({
    async findAllRoles() {
        return await this.find({ relations: ["department"] });
    },

    async findRolesById(id) {
        return await this.findOne({ 
            where: { id: parseInt(id) },
            relations: ["department"] 
        });
    },

    async createRole(roleData) {
        return await this.insert(roleData);
    },

    async saveRole(role) {
        return await this.save(role);
    },

    async deleteRole(criteria) {
        return await this.delete(criteria);
    },
});
