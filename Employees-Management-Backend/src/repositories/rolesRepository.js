import roleSchema from '../entities/roles.js';
import { AppDataSource } from '../util/database.js';

//// Role repository with custom methods for for fetching role data
export const roleRepository = AppDataSource.getRepository(roleSchema).extend({
    async findAllRoles() {
        return await this.find({ relations: ["department"] });
    },

    async findRolesById(id) {
        return await this.findOne({ 
            where: { id: id },
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
