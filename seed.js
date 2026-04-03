// const sequelize = require('./util/database');
// const { employees, department, roles } = require('./models/relation');

// const seedData = async () => {
//     try {
//         console.log("Syncing database and wiping old data...");
//         await sequelize.sync({ force: true });

//         console.log("Creating Departments...");
//         const deptEng = await department.create({ departmentName: 'Engineering' });
//         const deptHR = await department.create({ departmentName: 'HR' });
//         const deptSales = await department.create({ departmentName: 'Sales' });
//         const deptMarketing = await department.create({ departmentName: 'Marketing' });

//         console.log("Creating Roles...");
//         const roleSwe = await roles.create({ 
//             role: 'Software Engineer', 
//             salary: 45000, 
//             Department_id: deptEng.id
//         });
        
//         const roleHrManager = await roles.create({ 
//             role: 'HR Manager', 
//             salary: 30000, 
//             Department_id: deptHR.id
//         });
        
//         const roleSalesLead = await roles.create({ 
//             role: 'Sales Executive', 
//             salary: 30000, 
//             Department_id: deptSales.id
//         });

//         const roleMarketingSpecialist = await roles.create({ 
//             role: 'Marketing Specialist', 
//             salary: 35000, 
//             Department_id: deptMarketing.id
//         });

//         console.log("Creating Employees...");
//         await employees.create({
//             name: 'John Doe',
//             email: 'john.doe@example.com',
//             role_id: roleSwe.id,
//             status: 'active',
//             joining_date: new Date('2025-01-15')
//         });

//         await employees.create({
//             name: 'Jane Smith',
//             email: 'jane.smith@example.com',
//             role_id: roleHrManager.id,
//             status: 'active',
//             joining_date: new Date('2024-06-10')
//         });

//         await employees.create({
//             name: 'Robert Brown',
//             email: 'robert.b@example.com',
//             role_id: roleSalesLead.id,
//             status: 'inactive',
//             joining_date: new Date('2023-11-20')
//         });

//         await employees.create({
//             name: 'Emily Davis',
//             email: 'emily.davis@example.com',
//             role_id: roleMarketingSpecialist.id,
//             status: 'active',
//             joining_date: new Date('2024-03-15')
//         });

//         console.log("Dummy data successfully injected!");
//         process.exit();

//     } catch (error) {
//         console.error("Failed to seed dummy data: ", error);
//         process.exit(1);
//     }
// };

// seedData();
