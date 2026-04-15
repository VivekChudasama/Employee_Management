import roleSchema from '../entities/roles.js';
import { AppDataSource } from '../util/database.js';

//// Role repository with custom methods for for fetching role data
export const roleRepository = AppDataSource.getRepository(roleSchema).extend({
    // Get all roles with their associated department
    async findAllRoles() {
        return await this.find({ relations: ["department"] });
    },

    // Find role by ID with department relation
    async findRolesById(id) {
        return await this.findOne({ 
            where: { id: id },
            relations: ["department"] 
        });
    },

    // Method to check if a role with the same name already exists for checking role name uniqueness
    async findRoleIsExistByName(role) {
        return await this.findOne({ where: { role : role } });
    },

    //save role details in database
    async saveRole(role) {
        return await this.save(role);
    },

    //delete role by id
    async deleteRole(roleId) {
        return await this.delete(roleId);
    },
});
