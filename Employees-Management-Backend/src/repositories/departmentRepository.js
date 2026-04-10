import { AppDataSource } from '../util/database.js';
import departmentSchema from '../entities/department.js';

// Department repository with custom methods for fetching department data
export const departmentRepository = AppDataSource.getRepository(departmentSchema).extend({
    async findDepartments() {
        return await this.find()
    }
})