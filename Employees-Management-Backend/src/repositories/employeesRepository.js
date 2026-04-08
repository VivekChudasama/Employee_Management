import { AppDataSource } from '../util/database.js';

const employeeRepository = AppDataSource.getRepository(employeeModel);
const departmentRepository = AppDataSource.getRepository(departmentModel);
const roleRepository = AppDataSource.getRepository(roleModel);

