import employeeService from '../services/employees.js';
import roleService from '../services/roles.js';

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

        res.status(200).json({ employees, departments, roles });
    } catch (err) {
        console.log(err);
        if (req.query.ajax) return res.status(500).json({ error: "Server error" });
        next(err);
    }
};

// Handle add employee form submission
const postAddEmployee = async (req, res, next) => {
    try {
        const { name, email, role_id, joining_date, status } = req.body;

        const employee = await employeeService.createEmployee({ name, email, role_id, joining_date, status });

        res.status(201).json({ message: "Employee added successfully", employee });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error adding employee", error: err.message });
    }
};

// Get employee detail by ID for editing
const getEditEmployeeDetailById = async (req, res, next) => {
    try {
        const empId = req.params.employeeId;

        const employee = await employeeService.findEmployeeById(empId);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const departments = await employeeService.findAllDepartments();
        const roles = await employeeService.findAllRoles();

        res.status(200).json({ employee, departments, roles });
    } catch (err) {
        res.status(500).json({ message: "Error fetching employee data", error: err.message });
    }
};

// Handle edit employee form submission
const editEmployee = async (req, res, next) => {
    try {
        const { employeeId, name, email, role_id, joining_date, status } = req.body;

        const updated = await employeeService.updateEmployee({ employeeId, name, email, role_id, joining_date, status });
        if (!updated) return res.status(404).json({ message: "Employee not found" });

        res.status(200).json({ message: "Employee updated successfully", employee: updated });
    } catch (err) {
        res.status(500).json({ message: "Error updating employee", error: err.message });
    }
};

// Handle delete employee request
const deleteEmployee = async (req, res, next) => {
    try {
        const empId = req.body.employeeId;

        const deleted = await employeeService.deleteEmployeeById(empId);
        if (!deleted) return res.status(404).json({ message: "Employee not found" });

        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting employee", error: err.message });
    }
};

export default {
    getEmployees,
    postAddEmployee,
    getEditEmployeeDetailById,
    editEmployee,
    deleteEmployee
};