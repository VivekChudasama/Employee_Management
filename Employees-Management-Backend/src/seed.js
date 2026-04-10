import { AppDataSource } from './util/database.js';
import roleModel from './entities/roles.js';
import departmentModel from './entities/department.js';
import employeemodel from './entities/employees.js';

async function seedDatabase() {
    try {
        await AppDataSource.initialize();
        console.log("Database connected. Starting seed processing...");

        const departmentRepo = AppDataSource.getRepository(departmentModel);
        const roleRepo = AppDataSource.getRepository(roleModel);
        const employeeRepo = AppDataSource.getRepository(employeemodel);

        
        // Add Departments
        const d1 = await departmentRepo.save({ departmentName: "Human Resources" });
        const d2 = await departmentRepo.save({ departmentName: "Engineering" });
        const d3 = await departmentRepo.save({ departmentName: "Sales" });
        const d4 = await departmentRepo.save({ departmentName: "Marketing" });

        // Add Roles
        const r1 = await roleRepo.save({ role: "Software Engineer", salary: 85000, department_id: d2.id });
        const r2 = await roleRepo.save({ role: "DevOps Engineer", salary: 90000, department_id: d2.id });
        const r3 = await roleRepo.save({ role: "HR Manager", salary: 75000, department_id: d1.id });
        const r4 = await roleRepo.save({ role: "Marketing Specialist", salary: 65000, department_id: d4.id });
        const r5 = await roleRepo.save({ role: "Sales Representative", salary: 55000, department_id: d3.id });
        
        // Add Employees
        await employeeRepo.save({ name: "Vivek", email: "vivek@example.com", status: "active", joining_date: new Date(), role_id: r1.id });
        await employeeRepo.save({ name: "mihir", email: "mihir@example.com", status: "active", joining_date: new Date(), role_id: r2.id });
        await employeeRepo.save({ name: "Kirtan", email: "kirtan@example.com", status: "inactive", joining_date: new Date(), role_id: r3.id });
        await employeeRepo.save({ name: "sagar", email: "sagar@example.com", status: "active", joining_date: new Date(), role_id: r4.id });
        await employeeRepo.save({ name: "priyansh", email: "priyansh@example.com", status: "active", joining_date: new Date(), role_id: r5.id });    
        console.log("Dummy data successfully seeded into database!");
        process.exit(0);
    } catch (err) {
        console.error("Error writing dummy data:", err);
        process.exit(1);
    }
}

seedDatabase();
