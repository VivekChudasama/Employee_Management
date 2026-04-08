import employeeService from '../services/employees.js';

// Get list of employees with search support
const getEmployees = async (req, res, next) => {
    try {
        const { search, ajax, department_id, status, min_salary, max_salary } = req.query;

        const employees = await employeeService.findAllEmployees({ search, department_id, status, min_salary, max_salary });

        if (ajax) {
            return res.json(employees);
        }

        const departments = await employeeService.findAllDepartments();
        const roles = await employeeService.findAllRoles();

        // res.render('employees/employees_list', {
        //     pageTitle: 'Employees',
        //     employees,
        //     departments,
        //     roles,
        //     path: '/employees'
        // });
        res.status(200).send(employees , departments , roles)
    } catch (err) {
        console.log(err);
        if (req.query.ajax) return res.status(500).json({ error: "Server error" });
        next(err);
    }
};

// // Render add employee form
// const getEmployeesDepartments = async (req, res, next) => {
//     try {
//         const departments = await employeeService.findAllDepartments();
//         // const roles = await employeeService.findAllRoles();

//         // res.render('employees/add_employee', {
//         //     pageTitle: 'Add Employee',
//         //     path: '/add-employee',
//         //     departments,
//         //     editing: false
//         // });
//         res.send(departments);
//     } catch (err) {
//         console.log(err);
//         next(err);
//     }
// };

// Handle add employee form submission
const postAddEmployee = async (req, res, next) => {
    try {
        const { name, email, department_id , role_name, salary, joining_date, status } = req.body;

        await employeeService.createEmployee({ name, email, department_id , role_name, salary, joining_date, status });

        res.status(201).redirect('/employees');
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: "Error adding employee", error: err.message });
    }
};

// Render edit employee form
const getEditEmployeeDetailById = async (req, res, next) => {
    try {
        const empId = req.params.employeeId;

        const employee = await employeeService.findEmployeeById(empId);
        if (!employee) {
            return res.redirect('/employees');
        }

        const departments = await employeeService.findAllDepartments();
        const roles = await employeeService.findAllRoles();

        // res.render('employees/edit_employee', {
        //     pageTitle: 'Edit Employee',
        //     path: '/edit-employee',
        //     employee,
        //     departments,
        //     roles,
        //     editing: true
        // });

        res.status(200).send(employee , departments , roles)

    } catch (err) {
        res.status(500).send({ message: "Error fetching employee data", error: err.message });
    }
};

// Handle edit employee form submission
const editEmployee = async (req, res, next) => {
    try {
        const { employeeId, name, email,  department_id , role_name, salary, joining_date, status } = req.body;

        const updated = await employeeService.updateEmployee({ employeeId, name, email,  department_id , role_name, salary, joining_date, status });
        if (!updated) return res.status(404).send({ message: "Employee not found" });

        res.status(204).redirect('/employees');
    } catch (err) {
        res.status(500).send({ message: "Error updating employee", error: err.message });
    }
};

// Handle delete employee request
const deleteEmployee = async (req, res, next) => {
    try {
        const empId = req.body.employeeId;

        const deleted = await employeeService.deleteEmployeeById(empId);
        if (!deleted) return res.redirect('/employees');

        res.status(200).redirect('/employees');
    } catch (err) {
        res.status(500).send({ message: "Error deleting employee", error: err.message });
    }
};

export default {
    getEmployees,
    // getEmployeesDepartments,
    postAddEmployee,
    getEditEmployeeDetailById,
    editEmployee,
    deleteEmployee
};