import employeemodel from '../models/employees.js';
import departmentModel from '../models/department.js';
import roleModel from '../models/roles.js';
import { AppDataSource } from '../util/database.js';

import { Like, Between, MoreThanOrEqual, LessThanOrEqual } from "typeorm";


const employeeRepository = AppDataSource.getRepository(employeemodel);
const departmentRepository = AppDataSource.getRepository(departmentModel);
const roleRepository = AppDataSource.getRepository(roleModel);


//get list of employees with search support 
const getEmployees = async (req, res, next) => {
    try {
        const { search, ajax, department_id, status, min_salary, max_salary } = req.query;

        let findOptions = {
            relations: ["role", "role.department"]
        };

        let Filter = {};
        if (status) {
            Filter.status = status;
        }

        let roleFilter = {};
        if (department_id) {
            roleFilter.department_id = parseInt(department_id);
        }

        if (min_salary && max_salary) {
            roleFilter.salary = Between(parseInt(min_salary), parseInt(max_salary));
        } else if (min_salary) {
            roleFilter.salary = MoreThanOrEqual(parseInt(min_salary));
        } else if (max_salary) {
            roleFilter.salary = LessThanOrEqual(parseInt(max_salary));
        }

        if (Object.keys(roleFilter).length > 0) {
            Filter.role = roleFilter;
        }

        if (search) {
            findOptions.where = [
                { ...Filter, name: Like(`%${search}%`) },
                { ...Filter, email: Like(`%${search}%`) },
                { ...Filter, role: { ...roleFilter, role: Like(`%${search}%`) } }
            ];
        }
        // get list of filter's like(min_salary and max_salary , rolefilter)
        else if (Object.keys(Filter).length > 0) {
            findOptions.where = Filter;
        }

        const employees = await employeeRepository.find(findOptions);

        if (ajax) {
            return res.json(employees);
        }

        const departments = await departmentRepository.find();

        res.render('employees/employees_list', {
            pageTitle: 'Employees',
            employees: employees,
            departments: departments,
            path: '/employees'
        });
    } catch (err) {
        console.log(err);
        if (req.query.ajax) return res.status(500).json({ error: "Server error" });
        next(err);
    }
};

// Render add employee form
const getAddEmployees = async (req, res, next) => {
    try {
        const departments = await departmentRepository.find();
        const roles = await roleRepository.find()
        res.render('employees/add_employee', {
            pageTitle: 'Add Employee',
            path: '/add-employee',
            departments: departments,
            roles: roles,
            editing: false
        });
    } catch (err) {
        console.log(err);
    }
};

// Handle add employee form submission
const postAddEmployee = async (req, res, next) => {
    try {
        const { name, email, department_id, role_name, salary, joining_date, status } = req.body;

        // First create the role
        const newRole = await roleRepository.save({
            role: role_name,
            salary: salary,
            department_id: department_id
        });

        // Then create the employee
        await employeeRepository.save({
            name: name,
            email: email,
            role_id: newRole.id,
            joining_date: joining_date,
            status: status
        });

        res.status(201).redirect('/employees');
    } catch (err) {
        res.status(500).send({ message: "Error adding employee", error: err.message });
    }
};

// Render edit employee form with employee data and list of departments in dropdown
const getEditEmployee = async (req, res, next) => {
    const empId = req.params.employeeId;

    try {
        const fetchedDepartments = await departmentRepository.find();
        const fetchedRoles = await roleRepository.find();
        const employee = await employeeRepository.findOne({ where: { id: empId }, relations: ["role"] });

        if (!employee) {
            return res.redirect('/employees');
        }
        res.render('employees/edit_employee', {
            pageTitle: 'Edit Employee',
            path: '/edit-employee',
            employee: employee,
            departments: fetchedDepartments,
            roles: fetchedRoles,
            editing: true
        });
    } catch (err) {
        res.status(500).send({ message: "Error fetching employee data", error: err.message });
    }
};

// Handle edit employee form submission
const editEmployee = async (req, res, next) => {
    try {
        const { employeeId, name, email, department_id, role_name, salary, joining_date, status } = req.body;

        const employee = await employeeRepository.findOne({ where: { id: employeeId }, relations: ["role"] });
        if (!employee) return res.status(404).send({ message: "Employee not found" });

        employee.name = name;
        employee.email = email;
        employee.status = status;
        employee.joining_date = joining_date;

        // Also update the role
        if (employee.role) {
            if (role_name) employee.role.role = role_name;
            if (salary) employee.role.salary = salary;
            if (department_id) employee.role.department_id = department_id;
            await roleRepository.save(employee.role);
        }

        await employeeRepository.save(employee);
        res.redirect('/employees');
    } catch (err) {
        res.status(500).send({ message: "Error updating employee", error: err.message });
    }
};

// Handle delete employee request
const deleteEmployee = async (req, res, next) => {
    try {
        const empId = req.body.employeeId;
        const employee = await employeeRepository.findOne({ where: { id: empId }, relations: ["role"] });

        if (!employee) return res.redirect('/employees');

        // Delete employee, then delete their role
        const role = employee.role;
        await employeeRepository.remove(employee);

        if (role) {
            await roleRepository.remove(role);
        }

        res.redirect('/employees');
    } catch (err) {
        res.status(500).send({ message: "Error deleting employee", error: err.message });
    }
};

export default {
    getEmployees,
    getAddEmployees,
    postAddEmployee,
    getEditEmployee,
    editEmployee,
    deleteEmployee
};